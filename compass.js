/**
 * NoorHub - Professional Astronomical & Geodesic Qibla Compass Engine
 * 
 * Precision Navigation Features:
 * - Real-time DeviceOrientation on iOS (webkitCompassHeading) & Android (deviceorientationabsolute / alpha with screen orientation compensation)
 * - Liquid-damped fluid physics engine using requestAnimationFrame and shortest-path angular lerp (zero jitter)
 * - Spherical Forward Azimuth geodesy between observer and Holy Kaaba in Makkah (21.422487° N, 39.826206° E)
 * - Great Circle Haversine distance calculation (WGS84 Earth model)
 * - Embedded Leaflet.js interactive geodesic satellite & street alignment navigation
 * - Precision Great Circle orthodrome arc interpolation (120 points)
 * - Physical alignment detection (within ±4°) with multi-pulse haptic vibration & 528 Hz Solfeggio peace chime
 * - Unified sensor mode management: Live Hardware Compass vs Geographic Instrument Mode (GPS Calibrated)
 */

class NoorHubCompass {
  constructor() {
    this.kaabaCoords = { lat: 21.422487, lng: 39.826206 };
    this.currentLocation = { name: 'Makkah al-Mukarramah', country: 'Saudi Arabia', lat: 21.422487, lng: 39.826206 };
    
    // Physics & Heading State
    this.targetHeading = 0;      // Raw / desired orientation in degrees (0 - 360)
    this.renderedHeading = 0;    // Interpolated fluid orientation for dial/needle
    this.lerpFactor = 0.09;      // Liquid damping coefficient (smooth maritime compass behavior)
    this._rafId = null;
    this._rafRunning = false;

    // Navigation Telemetry
    this.qiblaBearing = 0;
    this.distanceKm = 0;
    this.sensorActive = false;
    this.sensorMode = 'geographic'; // 'hardware' or 'geographic'
    this.isAligned = false;
    
    // Audio Context
    this.audioContext = null;
    this.soundEnabled = true;
    this._orientationAttached = false;
    this._isDragging = false;

    // Leaflet Geodesic Map Instances
    this.map = null;
    this.userMarker = null;
    this.kaabaMarker = null;
    this.geodesicGlowPolyline = null;
    this.geodesicCorePolyline = null;
    this.activeLayerType = 'street'; // 'street' or 'satellite'
    this.tileLayers = {};

    // Listen to global location changes from NoorHub core
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
      loc = { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 };
    }

    this.currentLocation = loc;
    this.recalculateQibla(loc);
    this.bindControls();
    this.startFluidPhysicsEngine();
    this.tryAutoStartSensor();
    this.initGeodesicMap();
  }

  /* ==========================================================================
     1. ASTRONOMICAL GEODESIC MATHEMATICS
     ========================================================================== */

  /**
   * Calculates Spherical Forward Azimuth and Haversine Distance to the Holy Kaaba
   */
  recalculateQibla(loc) {
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return;
    this.currentLocation = loc;
    
    const lat1 = (loc.lat * Math.PI) / 180;
    const lat2 = (this.kaabaCoords.lat * Math.PI) / 180;
    const dLng = ((this.kaabaCoords.lng - loc.lng) * Math.PI) / 180;

    // Spherical Forward Azimuth
    const y = Math.sin(dLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    this.qiblaBearing = (qibla + 360) % 360;

    // Great Circle Distance (Haversine formula on WGS84 mean earth radius)
    const R = 6371.0088; // Earth's mean radius in km
    const dLat = lat2 - lat1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.distanceKm = Math.round(R * c);

    this.updateStaticUI();
    this.renderCompassVisuals();
    this.updateGeodesicMap();
  }

  /**
   * Generates interpolated coordinates along the Great Circle arc (orthodrome)
   */
  calculateGeodesicArc(start, end, numPoints = 120) {
    const toRad = deg => (deg * Math.PI) / 180;
    const toDeg = rad => (rad * 180) / Math.PI;

    const lat1 = toRad(start.lat);
    const lon1 = toRad(start.lng);
    const lat2 = toRad(end.lat);
    const lon2 = toRad(end.lng);

    const d = 2 * Math.asin(Math.sqrt(
      Math.sin((lat2 - lat1) / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
    ));

    if (d === 0) return [[start.lat, start.lng]];

    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints;
      const a = Math.sin((1 - f) * d) / Math.sin(d);
      const b = Math.sin(f * d) / Math.sin(d);

      const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
      const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
      const z = a * Math.sin(lat1) + b * Math.sin(lat2);

      const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
      const lon = Math.atan2(y, x);

      points.push([toDeg(lat), toDeg(lon)]);
    }
    return points;
  }

  /**
   * Resolves 16-point cardinal compass abbreviation
   */
  getCardinal(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
    return directions[idx];
  }

  /* ==========================================================================
     2. DAMPENED FLUID COMPASS PHYSICS ENGINE (requestAnimationFrame + lerp)
     ========================================================================== */

  /**
   * Starts the continuous fluid dampening physics loop.
   * Interpolates rendered heading smoothly toward target heading using shortest circular path.
   */
  startFluidPhysicsEngine() {
    if (this._rafRunning) return;
    this._rafRunning = true;

    const raf = typeof window !== 'undefined' && window.requestAnimationFrame ?
      window.requestAnimationFrame.bind(window) : (cb => setTimeout(cb, 16));

    const physicsStep = () => {
      // Calculate shortest angular difference (-180 to +180)
      const diff = (this.targetHeading - this.renderedHeading + 540) % 360 - 180;

      if (Math.abs(diff) > 0.01) {
        this.renderedHeading = (this.renderedHeading + diff * this.lerpFactor + 360) % 360;
        this.renderCompassVisuals();
      }

      this._rafId = raf(physicsStep);
    };

    this._rafId = raf(physicsStep);
  }

  /**
   * Renders the liquid-stabilized compass needle, rotating azimuth dial, and alignment state
   */
  renderCompassVisuals() {
    const heading = this.renderedHeading;
    const qibla = this.qiblaBearing;

    // Angle of Kaaba relative to device's top pointing axis
    const relativeAngle = (qibla - heading + 360) % 360;

    // Rotate dial opposite to heading so True North on dial aligns with true geographic North
    const dials = document.querySelectorAll('.compass-dial-rotate');
    dials.forEach(d => {
      d.style.transform = `rotate(${-heading}deg)`;
    });

    // Needle points directly to relative Kaaba bearing
    const needles = document.querySelectorAll('.qibla-pointer-needle, #qibla-needle, #salat-compass-needle');
    needles.forEach(n => {
      n.style.transform = `rotate(${relativeAngle}deg)`;
    });

    // Device Heading Labels
    const headingLabels = document.querySelectorAll('.current-heading-label');
    headingLabels.forEach(l => {
      l.textContent = `${Math.round(heading)}° ${this.getCardinal(heading)}`;
    });

    // Physical alignment detection within ±4°
    const angleDiff = Math.min(relativeAngle, 360 - relativeAngle);
    const aligned = angleDiff <= 4.0;

    // Turn guidance instructions
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

    // Alignment Banners and Sacred Feedback
    const alignedBanners = document.querySelectorAll('.qibla-aligned-banner');
    const compassFrames = document.querySelectorAll('.compass-outer-frame');

    if (aligned) {
      alignedBanners.forEach(b => b.classList.remove('hidden'));
      compassFrames.forEach(f => {
        f.classList.add('ring-4', 'ring-emerald-500', 'shadow-emerald-500/40');
      });

      if (!this.isAligned) {
        this.isAligned = true;
        // Physical haptic vibration pattern
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
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

  /**
   * Updates non-frame-rate static labels (Target Azimuth, Distance, Coordinates)
   */
  updateStaticUI() {
    const qibla = this.qiblaBearing;
    const dist = this.distanceKm;

    const bearingLabels = document.querySelectorAll('.qibla-bearing-label, #qibla-angle-degrees, #salat-qibla-bearing');
    bearingLabels.forEach(l => {
      l.textContent = `${qibla.toFixed(1)}° ${this.getCardinal(qibla)}`;
    });

    const distLabels = document.querySelectorAll('.qibla-distance-label, #kaaba-distance-label, #salat-kaaba-distance');
    distLabels.forEach(l => {
      const miles = Math.round(dist * 0.621371);
      l.textContent = `${dist.toLocaleString()} km (${miles.toLocaleString()} mi) to Makkah`;
    });

    const userCoordLabel = document.getElementById('geo-user-coords');
    if (userCoordLabel && this.currentLocation) {
      const latDir = this.currentLocation.lat >= 0 ? 'N' : 'S';
      const lngDir = this.currentLocation.lng >= 0 ? 'E' : 'W';
      userCoordLabel.textContent = `${Math.abs(this.currentLocation.lat).toFixed(4)}° ${latDir}, ${Math.abs(this.currentLocation.lng).toFixed(4)}° ${lngDir}`;
    }

    const overlayBearing = document.getElementById('map-overlay-bearing');
    if (overlayBearing) overlayBearing.textContent = `${qibla.toFixed(1)}° ${this.getCardinal(qibla)}`;

    const overlayDistance = document.getElementById('map-overlay-distance');
    if (overlayDistance) overlayDistance.textContent = `${dist.toLocaleString()} km`;
  }

  /* ==========================================================================
     3. HARDWARE SENSOR MANAGEMENT (iOS True North & Android Orientation)
     ========================================================================== */

  tryAutoStartSensor() {
    // Automatically attach on Android/modern browsers where permission gesture is not required
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      this.attachOrientationEvents();
    }
  }

  requestSensorPermission() {
    this.unlockAudio();

    // iOS 13+ permission request protocol
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            this.attachOrientationEvents();
            this.setSensorStatus('hardware');
            this.showFeedbackToast('Hardware compass calibrated & active. Hold device flat.');
          } else {
            this.setSensorStatus('geographic');
            this.showFeedbackToast('Compass permission denied. Using Geographic Instrument Mode.');
          }
        })
        .catch(err => {
          console.warn('Compass sensor permission error:', err);
          this.attachOrientationEvents();
        });
    } else {
      this.attachOrientationEvents();
      if (!window.DeviceOrientationEvent) {
        this.setSensorStatus('geographic');
        this.showFeedbackToast('Device without magnetometer. Orient using live Great Circle satellite map below.');
      } else {
        this.showFeedbackToast('Hardware orientation sensors listening. Hold device flat.');
      }
    }
  }

  attachOrientationEvents() {
    if (this._orientationAttached) return;
    this._orientationAttached = true;

    const handleOrientation = (e) => {
      let heading = null;

      // 1. iOS Safari webkitCompassHeading (True heading relative to North)
      if (typeof e.webkitCompassHeading !== 'undefined' && e.webkitCompassHeading !== null) {
        heading = e.webkitCompassHeading;
      }
      // 2. Android Device Orientation with Screen Orientation Compensation
      else if (e.alpha !== null && typeof e.alpha !== 'undefined') {
        let screenAngle = 0;
        if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
          screenAngle = window.screen.orientation.angle;
        } else if (typeof window.orientation === 'number') {
          screenAngle = window.orientation;
        }
        
        // Counter-clockwise alpha converted to clockwise compass heading
        heading = (360 - e.alpha + screenAngle) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        this.targetHeading = heading;
        this.sensorActive = true;
        this.setSensorStatus('hardware');
      }
    };

    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    }
    if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }

  setSensorStatus(mode) {
    this.sensorMode = mode;
    const badges = document.querySelectorAll('.compass-sensor-badge');
    const geoStatus = document.getElementById('qibla-geo-status');
    const activateBtns = document.querySelectorAll('.calibrate-activate-sensors-btn, .enable-compass-sensor-btn');

    if (mode === 'hardware') {
      badges.forEach(b => {
        b.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span> Hardware Magnetometer: Active`;
        b.className = 'compass-sensor-badge inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800';
      });
      if (geoStatus) geoStatus.textContent = 'Hardware Magnetometer';
      activateBtns.forEach(btn => {
        btn.innerHTML = `<span>✅ Hardware Magnetometer: Active</span>`;
        btn.classList.replace('bg-emerald-600', 'bg-slate-800');
      });
    } else {
      badges.forEach(b => {
        b.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span> Geographic Direction Mode (GPS Calibrated)`;
        b.className = 'compass-sensor-badge inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-800';
      });
      if (geoStatus) geoStatus.textContent = 'GPS Calibrated';
    }
  }

  /* ==========================================================================
     4. CONTROLS, GESTURES & AUDIO
     ========================================================================== */

  bindControls() {
    // 1. Single Dignified Sensor Activation Button
    const activateBtns = document.querySelectorAll('.calibrate-activate-sensors-btn, .enable-compass-sensor-btn');
    activateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.requestSensorPermission();
      });
    });

    // 2. Audio Chime Toggle
    const soundBtns = document.querySelectorAll('.toggle-compass-sound-btn');
    soundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        btn.innerHTML = this.soundEnabled ? '🔔 Chime: On' : '🔕 Chime: Off';
        this.showFeedbackToast(this.soundEnabled ? 'Spiritual alignment chime enabled' : 'Chime muted');
      });
    });

    // 3. Fluid Azimuth Dial Touch & Mouse Inspection
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
        startAngle = getAngle(e, rect) - this.targetHeading;
        this.unlockAudio();
      };

      const doDrag = (e) => {
        if (!this._isDragging) return;
        const rect = container.getBoundingClientRect();
        const angle = getAngle(e, rect);
        this.targetHeading = (angle - startAngle + 360) % 360;
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

  unlockAudio() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } catch (e) {}
  }

  playSpiritualChime() {
    if (!this.soundEnabled) return;
    try {
      this.unlockAudio();
      if (!this.audioContext) return;

      const now = this.audioContext.currentTime;
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Sacred Solfeggio 528 Hz tone (Transformation & Heart Peace frequency) + 660 Hz harmonic
      osc1.frequency.setValueAtTime(528, now);
      osc2.frequency.setValueAtTime(660, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
    } catch (e) {
      console.warn('Audio chime notification:', e);
    }
  }

  /* ==========================================================================
     5. LIVE GEODESIC MAP INTEGRATION (LEAFLET.JS)
     ========================================================================== */

  initGeodesicMap() {
    const mapContainer = document.getElementById('qibla-map');
    if (!mapContainer || typeof L === 'undefined') return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    // Street and High-Resolution Satellite Tile Layers
    this.tileLayers.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    this.tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS Community'
    });

    this.map = L.map('qibla-map', {
      layers: [this.tileLayers.street],
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Custom Holy Kaaba Marker
    const kaabaIcon = L.divIcon({
      className: 'noorhub-map-marker-clean',
      html: `
        <div style="width: 44px; height: 44px; border-radius: 14px; background: #0f172a; border: 2.5px solid #fbbf24; box-shadow: 0 0 20px rgba(251,191,36,0.7); display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer;">
          🕋
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    this.kaabaMarker = L.marker([this.kaabaCoords.lat, this.kaabaCoords.lng], { icon: kaabaIcon }).addTo(this.map);
    this.kaabaMarker.bindPopup(`
      <div style="font-family: inherit; padding: 6px; min-width: 210px;">
        <div style="font-weight: 800; color: #0f172a; font-size: 14px;">The Holy Kaaba (الكعبة المشرفة)</div>
        <div style="color: #059669; font-size: 11px; font-weight: 600; margin-top: 1px;">Al-Masjid al-Haram, Makkah</div>
        <div style="margin-top: 6px; font-size: 11px; color: #475569; font-family: monospace;">21.422487° N, 39.826206° E</div>
        <div style="margin-top: 4px; font-size: 11px; color: #d97706; font-weight: 700;">Global Sanctuary & Qibla Direction</div>
      </div>
    `);

    // Custom User Marker with Radiant Pulse
    const userIcon = L.divIcon({
      className: 'noorhub-map-marker-clean',
      html: `
        <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(16, 185, 129, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #059669; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 13px;">
            📍
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19]
    });

    this.userMarker = L.marker([this.currentLocation.lat, this.currentLocation.lng], { icon: userIcon }).addTo(this.map);

    // Initial Geodesic Path Drawing
    this.updateGeodesicMap(true);
    this.bindMapControls();
  }

  updateGeodesicMap(fitInitialBounds = false) {
    if (!this.map || !this.currentLocation) return;

    const userLatLng = [this.currentLocation.lat, this.currentLocation.lng];
    const kaabaLatLng = [this.kaabaCoords.lat, this.kaabaCoords.lng];

    // Update User Marker
    if (this.userMarker) {
      this.userMarker.setLatLng(userLatLng);
      this.userMarker.bindPopup(`
        <div style="font-family: inherit; padding: 6px; min-width: 220px;">
          <div style="font-weight: 800; color: #0f172a; font-size: 14px;">${this.currentLocation.name || 'Your Location'}</div>
          <div style="color: #059669; font-size: 11px; font-weight: 600;">${this.currentLocation.country || 'Geographic Observer'}</div>
          <div style="margin-top: 6px; font-size: 11px; color: #475569; font-family: monospace;">
            ${Math.abs(this.currentLocation.lat).toFixed(4)}° ${this.currentLocation.lat >= 0 ? 'N' : 'S'}, ${Math.abs(this.currentLocation.lng).toFixed(4)}° ${this.currentLocation.lng >= 0 ? 'E' : 'W'}
          </div>
          <div style="margin-top: 6px; padding: 4px 8px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; font-size: 11px; color: #065f46; font-weight: 600;">
            Azimuth: ${this.qiblaBearing.toFixed(1)}° ${this.getCardinal(this.qiblaBearing)} (${this.distanceKm.toLocaleString()} km)
          </div>
        </div>
      `);
    }

    // Generate Radiant Geodesic Arc (Orthodrome)
    const arcPoints = this.calculateGeodesicArc(
      { lat: this.currentLocation.lat, lng: this.currentLocation.lng },
      this.kaabaCoords,
      120
    );

    // Remove existing polylines
    if (this.geodesicGlowPolyline) this.map.removeLayer(this.geodesicGlowPolyline);
    if (this.geodesicCorePolyline) this.map.removeLayer(this.geodesicCorePolyline);

    // Outer radiant golden glow line
    this.geodesicGlowPolyline = L.polyline(arcPoints, {
      color: '#fbbf24',
      weight: 8,
      opacity: 0.45,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Core directional geodesic path
    this.geodesicCorePolyline = L.polyline(arcPoints, {
      color: '#d97706',
      weight: 3.5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    if (fitInitialBounds) {
      const bounds = L.latLngBounds([userLatLng, kaabaLatLng]);
      this.map.fitBounds(bounds, { padding: [60, 60] });
    }
  }

  bindMapControls() {
    // 1. Street-Level Zoom Button (building/street alignment)
    const btnUser = document.getElementById('map-btn-user');
    if (btnUser) {
      btnUser.addEventListener('click', () => {
        if (!this.map || !this.currentLocation) return;
        this.map.flyTo([this.currentLocation.lat, this.currentLocation.lng], 18, {
          duration: 1.6
        });
        if (this.userMarker) {
          setTimeout(() => this.userMarker.openPopup(), 1700);
        }
      });
    }

    // 2. Full Geodesic Arc View
    const btnFit = document.getElementById('map-btn-fit');
    if (btnFit) {
      btnFit.addEventListener('click', () => {
        if (!this.map || !this.currentLocation) return;
        const bounds = L.latLngBounds([
          [this.currentLocation.lat, this.currentLocation.lng],
          [this.kaabaCoords.lat, this.kaabaCoords.lng]
        ]);
        this.map.flyToBounds(bounds, { padding: [60, 60], duration: 1.6 });
      });
    }

    // 3. Kaaba Focus
    const btnKaaba = document.getElementById('map-btn-kaaba');
    if (btnKaaba) {
      btnKaaba.addEventListener('click', () => {
        if (!this.map) return;
        this.map.flyTo([this.kaabaCoords.lat, this.kaabaCoords.lng], 17, {
          duration: 1.6
        });
        if (this.kaabaMarker) {
          setTimeout(() => this.kaabaMarker.openPopup(), 1700);
        }
      });
    }

    // 4. Satellite / Street Toggle
    const btnLayer = document.getElementById('map-layer-toggle');
    if (btnLayer) {
      btnLayer.addEventListener('click', () => {
        if (!this.map) return;
        if (this.activeLayerType === 'street') {
          this.map.removeLayer(this.tileLayers.street);
          this.map.addLayer(this.tileLayers.satellite);
          this.activeLayerType = 'satellite';
          btnLayer.innerHTML = `<span>🗺️ Switch to Street Map</span>`;
        } else {
          this.map.removeLayer(this.tileLayers.satellite);
          this.map.addLayer(this.tileLayers.street);
          this.activeLayerType = 'street';
          btnLayer.innerHTML = `<span>🛰️ Switch to Satellite</span>`;
        }
      });
    }
  }

  /* ==========================================================================
     6. FEEDBACK NOTIFICATIONS
     ========================================================================== */

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
    }, 3800);
  }
}

// Global Singleton
window.NoorHubCompass = new NoorHubCompass();
