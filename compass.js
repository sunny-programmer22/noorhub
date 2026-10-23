/**
 * NoorHub - Professional Interactive Qibla Compass Engine
 * Supports:
 * - Real-time DeviceOrientation on iOS (webkitCompassHeading) & Android (deviceorientationabsolute/alpha)
 * - Spherical forward azimuth trigonometry between user GPS/selected city and the Kaaba in Makkah (21.422487° N, 39.826206° E)
 * - Real-time Alignment detection (within ±4°) with haptic vibration & spiritual Web Audio chime (528 Hz Solfeggio tone)
 * - Desktop interactive simulation (manual 0°-360° heading slider & touch/mouse circular drag)
 * - One-click test simulation buttons (Align with Kaaba, Reset to 0° North, Test East/West)
 * - Audio Chime toggle
 * - Calibration guide
 */

class NoorHubCompass {
  constructor() {
    this.kaabaCoords = { lat: 21.422487, lng: 39.826206 };
    this.deviceHeading = 0;
    this.qiblaBearing = 0;
    this.distanceKm = 0;
    this.sensorActive = false;
    this.isAligned = false;
    this.audioContext = null;
    this.soundEnabled = true;
    this._orientationAttached = false;
    this._isDragging = false;

    // Listen to global location changes
    window.addEventListener('noorhub-location-changed', (e) => {
      this.recalculateQibla(e.detail);
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    let loc = null;
    if (window.NoorHub && window.NoorHub.city) {
      loc = window.NoorHub.city;
    } else {
      try {
        const saved = localStorage.getItem('noorhub_location');
        if (saved) loc = JSON.parse(saved);
      } catch (e) {}
    }

    if (!loc) {
      // Default to Makkah or London fallback
      loc = { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 };
    }

    this.recalculateQibla(loc);
    this.bindControls();
    this.tryAutoStartSensor();
  }

  recalculateQibla(loc) {
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return;
    
    // Spherical Forward Azimuth
    const lat1 = (loc.lat * Math.PI) / 180;
    const lat2 = (this.kaabaCoords.lat * Math.PI) / 180;
    const dLng = ((this.kaabaCoords.lng - loc.lng) * Math.PI) / 180;

    const y = Math.sin(dLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    this.qiblaBearing = (qibla + 360) % 360;

    // Great Circle Distance (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = lat2 - lat1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.distanceKm = Math.round(R * c);

    this.updateUI();
  }

  getCardinal(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((deg % 360) / 22.5) % 16;
    return directions[idx];
  }

  bindControls() {
    // 1. Mobile Sensor Activation Buttons (iOS / Android)
    const activateBtns = document.querySelectorAll('.enable-compass-sensor-btn');
    activateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.requestSensorPermission();
      });
    });

    // 2. Audio Toggle Buttons
    const soundBtns = document.querySelectorAll('.toggle-compass-sound-btn');
    soundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        btn.innerHTML = this.soundEnabled ? '🔔 Chime: On' : '🔕 Chime: Off';
        this.showFeedbackToast(this.soundEnabled ? 'Spiritual alignment chime enabled' : 'Chime muted');
      });
    });

    // 3. Desktop Heading Slider
    const sliders = document.querySelectorAll('.compass-heading-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        this.deviceHeading = parseFloat(e.target.value);
        this.updateUI();
      });
    });

    // 4. Test Buttons (Face Kaaba Directly, Reset North, etc.)
    const alignKaabaBtns = document.querySelectorAll('.test-align-kaaba-btn');
    alignKaabaBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.deviceHeading = Math.round(this.qiblaBearing);
        sliders.forEach(s => s.value = this.deviceHeading);
        this.updateUI();
        this.showFeedbackToast('Simulated: Device turned directly toward Kaaba!');
      });
    });

    const resetNorthBtns = document.querySelectorAll('.test-reset-north-btn');
    resetNorthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.deviceHeading = 0;
        sliders.forEach(s => s.value = 0);
        this.updateUI();
      });
    });

    // 5. Touch & Mouse Drag on the Compass dial
    const dialContainers = document.querySelectorAll('.interactive-compass-dial-container');
    dialContainers.forEach(container => {
      let startAngle = 0;

      const getAngle = (e, rect) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(clientY - centerY, clientX - centerX);
        return (rad * 180 / Math.PI + 90 + 360) % 360;
      };

      const startDrag = (e) => {
        this._isDragging = true;
        const rect = container.getBoundingClientRect();
        startAngle = getAngle(e, rect) - this.deviceHeading;
        // Unlock audio context on first interaction if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      };

      const doDrag = (e) => {
        if (!this._isDragging) return;
        const rect = container.getBoundingClientRect();
        const angle = getAngle(e, rect);
        this.deviceHeading = Math.round((angle - startAngle + 360) % 360);
        sliders.forEach(s => s.value = this.deviceHeading);
        this.updateUI();
      };

      const stopDrag = () => {
        this._isDragging = false;
      };

      container.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', doDrag);
      window.addEventListener('mouseup', stopDrag);

      container.addEventListener('touchstart', startDrag, { passive: true });
      window.addEventListener('touchmove', doDrag, { passive: true });
      window.addEventListener('touchend', stopDrag);
    });
  }

  tryAutoStartSensor() {
    // Check if DeviceOrientationEvent exists without requiring user gesture (Android/older browsers)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      this.attachOrientationEvents();
    }
  }

  requestSensorPermission() {
    // Unlock Audio Context on this user gesture
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch (e) {}

    // iOS 13+ permission request
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            this.attachOrientationEvents();
            this.showFeedbackToast('Compass sensor activated! Hold device flat to face Kaaba.');
          } else {
            alert('Compass permission was denied. You can manually drag the dial or use the direction slider below.');
          }
        })
        .catch(err => {
          console.warn('Compass permission error:', err);
          this.attachOrientationEvents();
        });
    } else {
      this.attachOrientationEvents();
      if (!window.DeviceOrientationEvent) {
        this.showFeedbackToast('Desktop/device without magnetometer: use the 360° slider or drag the dial!');
      } else {
        this.showFeedbackToast('Orientation sensor listening! Hold phone flat.');
      }
    }
  }

  attachOrientationEvents() {
    if (this._orientationAttached) return;
    this._orientationAttached = true;

    const handleOrientation = (e) => {
      let heading = null;

      // 1. iOS Safari true north
      if (typeof e.webkitCompassHeading !== 'undefined' && e.webkitCompassHeading !== null) {
        heading = e.webkitCompassHeading;
      }
      // 2. Android device orientation
      else if (e.alpha !== null && typeof e.alpha !== 'undefined') {
        let angle = 0;
        if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
          angle = window.screen.orientation.angle;
        } else if (typeof window.orientation === 'number') {
          angle = window.orientation;
        }
        heading = (360 - e.alpha + angle) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        this.deviceHeading = Math.round(heading);
        this.sensorActive = true;
        this.updateSensorBadge(true);
        if (!this._isDragging) {
          const sliders = document.querySelectorAll('.compass-heading-slider');
          sliders.forEach(s => s.value = this.deviceHeading);
        }
        this.updateUI();
      }
    };

    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    }
    if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }

  updateSensorBadge(isActive) {
    const badges = document.querySelectorAll('.compass-sensor-badge');
    badges.forEach(b => {
      if (isActive) {
        b.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1"></span> Live Sensor Active`;
        b.className = 'compass-sensor-badge inline-flex items-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800';
      }
    });

    const activateBtns = document.querySelectorAll('.enable-compass-sensor-btn');
    activateBtns.forEach(btn => {
      if (isActive) btn.classList.add('hidden');
    });
  }

  playSpiritualChime() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (!this.audioContext) return;
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Sacred Solfeggio 528 Hz tone (DNA / Heart Peace frequency) + 660 Hz overtone
      osc1.frequency.setValueAtTime(528, now);
      osc2.frequency.setValueAtTime(660, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  }

  updateUI() {
    const heading = this.deviceHeading;
    const qibla = this.qiblaBearing;
    const dist = this.distanceKm;

    // Angle of Kaaba relative to user phone's top
    const relativeAngle = (qibla - heading + 360) % 360;

    // Check alignment within ±4 degrees
    const angleDiff = Math.min(relativeAngle, 360 - relativeAngle);
    const aligned = angleDiff <= 4.0;

    // 1. Needles & Dials
    // Rotate dial opposite to heading so North on dial points to true North
    const dials = document.querySelectorAll('.compass-dial-rotate');
    dials.forEach(d => {
      d.style.transform = `rotate(${-heading}deg)`;
    });

    // Needle points directly to relative Kaaba angle
    const needles = document.querySelectorAll('.qibla-pointer-needle, #qibla-needle, #salat-compass-needle');
    needles.forEach(n => {
      n.style.transform = `rotate(${relativeAngle}deg)`;
    });

    // 2. Headings and Degrees Labels
    const headingLabels = document.querySelectorAll('.current-heading-label');
    headingLabels.forEach(l => {
      l.textContent = `${Math.round(heading)}° ${this.getCardinal(heading)}`;
    });

    const bearingLabels = document.querySelectorAll('.qibla-bearing-label, #qibla-angle-degrees, #salat-qibla-bearing');
    bearingLabels.forEach(l => {
      l.textContent = `${Math.round(qibla)}° ${this.getCardinal(qibla)}`;
    });

    const distLabels = document.querySelectorAll('.qibla-distance-label, #kaaba-distance-label, #salat-kaaba-distance');
    distLabels.forEach(l => {
      const miles = Math.round(dist * 0.621371);
      l.textContent = `${dist.toLocaleString()} km (${miles.toLocaleString()} mi) to Makkah`;
    });

    // Relative instruction label (e.g. "Turn 24° Right")
    const turnLabels = document.querySelectorAll('.qibla-turn-instruction');
    turnLabels.forEach(l => {
      if (aligned) {
        l.textContent = "ALIGNED! Facing the Holy Kaaba (Qibla)";
        l.className = "qibla-turn-instruction font-bold text-emerald-600 dark:text-emerald-400";
      } else if (relativeAngle > 0 && relativeAngle <= 180) {
        l.textContent = `Turn ${Math.round(relativeAngle)}° Right ↻`;
        l.className = "qibla-turn-instruction font-medium text-amber-600 dark:text-amber-400";
      } else {
        l.textContent = `Turn ${Math.round(360 - relativeAngle)}° Left ↺`;
        l.className = "qibla-turn-instruction font-medium text-amber-600 dark:text-amber-400";
      }
    });

    // 3. Alignment Banners & State
    const alignedBanners = document.querySelectorAll('.qibla-aligned-banner');
    const compassFrames = document.querySelectorAll('.compass-outer-frame');

    if (aligned) {
      alignedBanners.forEach(b => b.classList.remove('hidden'));
      compassFrames.forEach(f => {
        f.classList.add('ring-4', 'ring-emerald-500', 'shadow-emerald-500/40');
      });

      if (!this.isAligned) {
        this.isAligned = true;
        // Trigger Haptic Vibration on mobile
        if (navigator.vibrate) {
          try {
            navigator.vibrate([120, 60, 120]);
          } catch (e) {}
        }
        this.playSpiritualChime();
      }
    } else {
      alignedBanners.forEach(b => b.classList.add('hidden'));
      compassFrames.forEach(f => {
        f.classList.remove('ring-4', 'ring-emerald-500', 'shadow-emerald-500/40');
      });
      this.isAligned = false;
    }
  }

  showFeedbackToast(msg) {
    const existing = document.querySelector('.noorhub-compass-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'noorhub-compass-toast fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white border border-emerald-500 shadow-2xl text-xs font-semibold flex items-center space-x-2 transition-all duration-300';
    toast.innerHTML = `<span>🕋</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

// Global Singleton
window.NoorHubCompass = new NoorHubCompass();
