/**
 * NoorHub - Flagship Portal Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const core = window.NoorHub;
  let activeTimings = null;
  let prayerInterval = null;

  // 1. Clock and Hijri Date
  function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('header-clock');
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Simple Hijri Date approximation or API sync
  function updateNativeHijriDate() {
    try {
      const today = new Date();
      const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const hijriText = hijriFormatter.format(today);
      const el = document.getElementById('header-hijri-date');
      if (el) el.textContent = hijriText + ' AH';
    } catch (e) {
      console.warn('Hijri Intl format fallback:', e);
    }
  }
  updateNativeHijriDate();

  // 2. City Dropdown & Selector
  const cityBtn = document.getElementById('city-selector-btn');
  const cityDropdown = document.getElementById('city-dropdown');
  const citiesList = document.getElementById('cities-list');
  const cityLabel = document.getElementById('current-city-label');
  const gpsBtn = document.getElementById('btn-use-gps');

  if (cityLabel) cityLabel.textContent = core.city.name;

  if (citiesList) {
    citiesList.innerHTML = NOORHUB_CITIES.map(c => `
      <button class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition ${c.name === core.city.name ? 'text-emerald-600 font-semibold bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'}" data-city="${c.name}">
        <span>${c.name}, ${c.country}</span>
        <span class="text-[10px] text-slate-400 font-mono">${c.lat.toFixed(1)}°, ${c.lng.toFixed(1)}°</span>
      </button>
    `).join('');

    citiesList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = NOORHUB_CITIES.find(c => c.name === btn.getAttribute('data-city'));
        if (selected) {
          core.saveCity(selected);
          if (cityLabel) cityLabel.textContent = selected.name;
          if (cityDropdown) cityDropdown.classList.add('hidden');
          loadPrayerTimes();
        }
      });
    });
  }

  if (cityBtn && cityDropdown) {
    cityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cityDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!cityDropdown.contains(e.target) && e.target !== cityBtn) {
        cityDropdown.classList.add('hidden');
      }
    });
  }

  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      core.requestGPSLocation((loc) => {
        if (cityLabel) cityLabel.textContent = loc.name;
        if (cityDropdown) cityDropdown.classList.add('hidden');
        loadPrayerTimes();
      });
    });
  }

  // 3. Prayer Times Calculation & Rendering
  async function loadPrayerTimes() {
    const loc = core.city;
    const now = new Date();
    let timings = null;

    // Try live API first with 3.5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const ts = Math.floor(now.getTime() / 1000);
      const res = await fetch(`https://api.aladhan.com/v1/timings/${ts}?latitude=${loc.lat}&longitude=${loc.lng}&method=3`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.timings) {
          timings = {
            Fajr: json.data.timings.Fajr.split(' ')[0],
            Sunrise: json.data.timings.Sunrise.split(' ')[0],
            Dhuhr: json.data.timings.Dhuhr.split(' ')[0],
            Asr: json.data.timings.Asr.split(' ')[0],
            Maghrib: json.data.timings.Maghrib.split(' ')[0],
            Isha: json.data.timings.Isha.split(' ')[0]
          };
          if (json.data.date && json.data.date.hijri) {
            const h = json.data.date.hijri;
            const el = document.getElementById('header-hijri-date');
            if (el) el.textContent = `${h.day} ${h.month.en} ${h.year} AH`;
          }
        }
      }
    } catch (e) {
      console.warn('Aladhan API timeout/network error, calculating offline:', e);
    }

    // Fallback to offline astronomical calculator if API failed
    if (!timings && typeof AstronomicalPrayerCalculator !== 'undefined') {
      timings = AstronomicalPrayerCalculator.calculate(now, loc.lat, loc.lng, 3, 0, 'night-middle', loc.tz);
    }

    if (!timings) {
      // Default fallback standard timings
      timings = {
        Fajr: '05:05',
        Sunrise: '06:22',
        Dhuhr: '12:15',
        Asr: '15:35',
        Maghrib: '18:05',
        Isha: '19:25'
      };
    }

    activeTimings = timings;
    renderTimings(timings);
    updateQibla(loc);
    startPrayerCountdown();
  }

  function renderTimings(t) {
    const ids = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    ids.forEach(key => {
      const cap = key.charAt(0).toUpperCase() + key.slice(1);
      const el = document.getElementById(`time-${key}`);
      if (el && t[cap]) {
        el.textContent = format12h(t[cap]);
      }
    });

    const suhoorEl = document.getElementById('fasting-suhoor-time');
    const iftarEl = document.getElementById('fasting-iftar-time');
    if (suhoorEl && t.Fajr) suhoorEl.textContent = format12h(t.Fajr);
    if (iftarEl && t.Maghrib) iftarEl.textContent = format12h(t.Maghrib);
  }

  function format12h(timeStr) {
    if (!timeStr) return '--:--';
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr ? mStr.substring(0, 2) : '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  }

  // 4. Next Prayer Countdown
  function startPrayerCountdown() {
    if (prayerInterval) clearInterval(prayerInterval);
    updateCountdown();
    prayerInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    if (!activeTimings) return;
    const now = new Date();
    const prayerOrder = [
      { name: 'Fajr', time: activeTimings.Fajr },
      { name: 'Sunrise', time: activeTimings.Sunrise, skipNext: true },
      { name: 'Dhuhr', time: activeTimings.Dhuhr },
      { name: 'Asr', time: activeTimings.Asr },
      { name: 'Maghrib', time: activeTimings.Maghrib },
      { name: 'Isha', time: activeTimings.Isha }
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    
    let nextPrayer = null;
    let nextPrayerMinutes = null;
    let prevPrayerMinutes = null;

    for (let i = 0; i < prayerOrder.length; i++) {
      const p = prayerOrder[i];
      const [h, m] = p.time.split(':').map(Number);
      const pMin = h * 60 + m;

      if (pMin > currentMinutes) {
        nextPrayer = p;
        nextPrayerMinutes = pMin;
        prevPrayerMinutes = i > 0 ? (prayerOrder[i - 1].time.split(':').map(Number)[0] * 60 + prayerOrder[i - 1].time.split(':').map(Number)[1]) : 0;
        break;
      }
    }

    // After Isha, next prayer is tomorrow's Fajr
    if (!nextPrayer) {
      nextPrayer = prayerOrder[0];
      const [h, m] = nextPrayer.time.split(':').map(Number);
      nextPrayerMinutes = 24 * 60 + (h * 60 + m);
      const ishaMin = prayerOrder[5].time.split(':').map(Number)[0] * 60 + prayerOrder[5].time.split(':').map(Number)[1];
      prevPrayerMinutes = ishaMin;
    }

    // Update Next Prayer Hero Card
    const nameEl = document.getElementById('next-prayer-name');
    const timeEl = document.getElementById('next-prayer-time');
    const timerEl = document.getElementById('prayer-countdown-timer');
    const progressEl = document.getElementById('prayer-progress-bar');

    if (nameEl) nameEl.textContent = nextPrayer.name;
    if (timeEl) timeEl.textContent = format12h(nextPrayer.time);

    const diffMinutes = nextPrayerMinutes - currentMinutes;
    const diffSecTotal = Math.max(0, Math.floor(diffMinutes * 60));
    const hours = Math.floor(diffSecTotal / 3600);
    const mins = Math.floor((diffSecTotal % 3600) / 60);
    const secs = diffSecTotal % 60;

    if (timerEl) {
      timerEl.textContent = `${hours}h ${mins}m ${secs.toString().padStart(2, '0')}s`;
    }

    // Highlight card
    ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(k => {
      const c = document.getElementById(`card-${k}`);
      if (c) {
        if (k.toLowerCase() === nextPrayer.name.toLowerCase()) {
          c.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-950/60');
        } else {
          c.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-950/60');
        }
      }
    });

    // Progress bar calculation
    if (progressEl && prevPrayerMinutes !== null) {
      const totalSpan = nextPrayerMinutes - prevPrayerMinutes;
      const elapsed = currentMinutes >= prevPrayerMinutes ? (currentMinutes - prevPrayerMinutes) : (currentMinutes + 24 * 60 - prevPrayerMinutes);
      const pct = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
      progressEl.style.width = `${pct}%`;
    }
  }

  // 5. Qibla Bearing Calculation
  function updateQibla(loc) {
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;

    const lat1 = (loc.lat * Math.PI) / 180;
    const lat2 = (kaabaLat * Math.PI) / 180;
    const dLng = ((kaabaLng - loc.lng) * Math.PI) / 180;

    const y = Math.sin(dLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    // Kaaba Distance (Haversine)
    const R = 6371;
    const dLat = lat2 - lat1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(R * c);

    const needle = document.getElementById('qibla-needle');
    const angleEl = document.getElementById('qibla-angle-degrees');
    const distEl = document.getElementById('kaaba-distance-label');

    if (needle) needle.style.transform = `rotate(${qibla}deg)`;
    if (angleEl) angleEl.textContent = `${Math.round(qibla)}°`;
    if (distEl) distEl.textContent = `${dist.toLocaleString()} km to Makkah`;
  }

  // 6. Interactive Quick Tasbih Counter
  let tasbihCount = 0;
  let tasbihTarget = 33;
  let tasbihCycles = 0;
  let soundEnabled = true;

  const countBtn = document.getElementById('quick-tasbih-tap-btn');
  const countEl = document.getElementById('quick-tasbih-count');
  const cyclesEl = document.getElementById('quick-tasbih-cycles');
  const targetEl = document.getElementById('quick-tasbih-target');
  const resetBtn = document.getElementById('quick-tasbih-reset-btn');
  const soundBtn = document.getElementById('quick-tasbih-sound-toggle');
  const arabicEl = document.getElementById('quick-tasbih-arabic');
  const transEl = document.getElementById('quick-tasbih-trans');

  // Web Audio chime for tasbih
  function playBeadClick() {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chime
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  if (countBtn) {
    countBtn.addEventListener('click', () => {
      tasbihCount++;
      playBeadClick();

      // Mobile Haptic vibration
      if (navigator.vibrate) {
        navigator.vibrate(25);
      }

      if (tasbihCount >= tasbihTarget) {
        tasbihCount = 0;
        tasbihCycles++;
        if (cyclesEl) cyclesEl.textContent = tasbihCycles;
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      }
      if (countEl) countEl.textContent = tasbihCount;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      tasbihCount = 0;
      tasbihCycles = 0;
      if (countEl) countEl.textContent = '0';
      if (cyclesEl) cyclesEl.textContent = '0';
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off';
    });
  }

  // Dhikr selector buttons
  document.querySelectorAll('.dhikr-selector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ar = btn.getAttribute('data-ar');
      const meaning = btn.getAttribute('data-meaning');
      if (arabicEl) arabicEl.textContent = ar;
      if (transEl) transEl.textContent = `${btn.getAttribute('data-dhikr')} (${meaning})`;
      tasbihCount = 0;
      if (countEl) countEl.textContent = '0';
    });
  });

  // 7. Ayah Recitation Audio & Copy
  const ayahAudioBtn = document.getElementById('btn-play-ayah-audio');
  const copyAyahBtn = document.getElementById('btn-copy-ayah');
  let currentAyahAudio = null;

  if (ayahAudioBtn) {
    ayahAudioBtn.addEventListener('click', () => {
      if (currentAyahAudio && !currentAyahAudio.paused) {
        currentAyahAudio.pause();
        ayahAudioBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        return;
      }
      // Al-Baqarah 2:286 Mishary Alafasy public CDN
      const audioUrl = 'https://everyayah.com/data/Alafasy_128kbps/002286.mp3';
      currentAyahAudio = new Audio(audioUrl);
      ayahAudioBtn.innerHTML = `<svg class="w-5 h-5 text-amber-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      
      currentAyahAudio.play().then(() => {
        ayahAudioBtn.innerHTML = `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      }).catch(err => {
        console.warn('Audio playback error:', err);
        ayahAudioBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>`;
      });

      currentAyahAudio.onended = () => {
        ayahAudioBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>`;
      };
    });
  }

  if (copyAyahBtn) {
    copyAyahBtn.addEventListener('click', () => {
      const text = `لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا - "Allah burdens not a person beyond his scope." [Surah Al-Baqarah 2:286] (via NoorHub.truxio.bond)`;
      navigator.clipboard.writeText(text).then(() => {
        copyAyahBtn.textContent = 'Copied to clipboard!';
        setTimeout(() => copyAyahBtn.textContent = 'Copy Ayah', 2000);
      });
    });
  }

  // Load initial timings
  loadPrayerTimes();
});
