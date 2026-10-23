/**
 * NoorHub - Sacred Lifestyle & Spiritual Dashboard Logic
 * Powered by Astronomical Salat Engine, Ambient Audio Synthesis, and Haptic Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  const core = window.NoorHub;
  let activeTimings = null;
  let prayerInterval = null;
  let ambientAudioCtx = null;
  let ambientPlaying = false;
  let ambientNodes = [];

  // =========================================================================
  // 1. Clock and Live Hijri Date
  // =========================================================================
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
      if (el) el.textContent = `${hijriText} AH`;
    } catch (e) {
      const el = document.getElementById('header-hijri-date');
      if (el) el.textContent = '1448 AH';
    }
  }
  updateNativeHijriDate();

  // =========================================================================
  // 2. City Selector & Dropdown
  // =========================================================================
  const cityBtn = document.getElementById('city-selector-btn');
  const cityDropdown = document.getElementById('city-dropdown');
  const citiesList = document.getElementById('cities-list');
  const cityLabel = document.getElementById('current-city-label');
  const gpsBtn = document.getElementById('btn-use-gps');

  if (cityLabel && core && core.city) cityLabel.textContent = core.city.name;

  if (citiesList && typeof NOORHUB_CITIES !== 'undefined') {
    citiesList.innerHTML = NOORHUB_CITIES.map(c => `
      <button class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition text-xs ${c.name === (core.city ? core.city.name : '') ? 'text-amber-500 font-bold bg-amber-500/10' : 'text-slate-700 dark:text-slate-300'}" data-city="${c.name}">
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
          if (window.NoorHubCompass) window.NoorHubCompass.recalculateQibla(selected);
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

  if (gpsBtn && core) {
    gpsBtn.addEventListener('click', () => {
      core.requestGPSLocation((loc) => {
        if (cityLabel) cityLabel.textContent = loc.name;
        if (cityDropdown) cityDropdown.classList.add('hidden');
        loadPrayerTimes();
        if (window.NoorHubCompass) window.NoorHubCompass.recalculateQibla(loc);
      });
    });
  }

  // =========================================================================
  // 3. Zen / Ambient Nature Audio Synthesizer (Flowing Water & Sanctuary Chime)
  // =========================================================================
  const ambientBtn = document.getElementById('zen-ambient-btn');
  
  function toggleAmbientSound() {
    if (ambientPlaying) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  }

  function startAmbientSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ambientAudioCtx = new AudioCtx();
      if (ambientAudioCtx.state === 'suspended') {
        ambientAudioCtx.resume();
      }

      // 1. Pink Noise generator buffer for soothing flowing stream/rain
      const bufferSize = ambientAudioCtx.sampleRate * 2;
      const noiseBuffer = ambientAudioCtx.createBuffer(1, bufferSize, ambientAudioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ambientAudioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter: gentle resonant lowpass like a forest stream
      const filter = ambientAudioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ambientAudioCtx.currentTime);
      filter.Q.setValueAtTime(1.2, ambientAudioCtx.currentTime);

      const gain = ambientAudioCtx.createGain();
      gain.gain.setValueAtTime(0.01, ambientAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ambientAudioCtx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ambientAudioCtx.destination);
      whiteNoise.start();

      ambientNodes = [whiteNoise, filter, gain];
      ambientPlaying = true;
      if (ambientBtn) {
        ambientBtn.classList.add('gold-pill-active', 'text-amber-400');
        ambientBtn.innerHTML = `<span>🌊 Sanctuary Audio: On</span>`;
      }
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  }

  function stopAmbientSound() {
    if (ambientAudioCtx) {
      try {
        ambientNodes.forEach(node => {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        });
        ambientAudioCtx.close();
      } catch (e) {}
    }
    ambientPlaying = false;
    if (ambientBtn) {
      ambientBtn.classList.remove('gold-pill-active', 'text-amber-400');
      ambientBtn.innerHTML = `<span>🌿 Ambient: Calm</span>`;
    }
  }

  if (ambientBtn) {
    ambientBtn.addEventListener('click', toggleAmbientSound);
  }

  // =========================================================================
  // 4. Prayer Times Engine & Hero Countdown
  // =========================================================================
  async function loadPrayerTimes() {
    const loc = core.city || { lat: 21.4225, lng: 39.8262, name: 'Makkah', tz: 'Asia/Riyadh' };
    const now = new Date();
    let timings = null;

    if (typeof AstronomicalPrayerCalculator !== 'undefined') {
      timings = AstronomicalPrayerCalculator.calculate(now, loc.lat, loc.lng, 3, 0, 'night-middle', loc.tz);
    }

    if (timings) {
      activeTimings = timings;
      renderPrayerDashboard();
      startPrayerCountdown();
    }
  }

  function format12h(time24) {
    if (!time24) return '--:--';
    const [hours, mins] = time24.split(':');
    let h = parseInt(hours, 10);
    const m = mins.slice(0, 2);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  }

  function renderPrayerDashboard() {
    if (!activeTimings) return;
    const list = [
      { key: 'fajr', label: 'Fajr', time: activeTimings.Fajr },
      { key: 'dhuhr', label: 'Dhuhr', time: activeTimings.Dhuhr },
      { key: 'asr', label: 'Asr', time: activeTimings.Asr },
      { key: 'maghrib', label: 'Maghrib', time: activeTimings.Maghrib },
      { key: 'isha', label: 'Isha', time: activeTimings.Isha }
    ];

    list.forEach(p => {
      const el = document.getElementById(`timeline-${p.key}-time`);
      if (el) el.textContent = p.time;
    });
  }

  function startPrayerCountdown() {
    if (prayerInterval) clearInterval(prayerInterval);
    updateCountdown();
    prayerInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    if (!activeTimings) return;
    const now = new Date();
    const prayerOrder = [
      { name: 'Fajr', time: activeTimings.Fajr, key: 'fajr' },
      { name: 'Dhuhr', time: activeTimings.Dhuhr, key: 'dhuhr' },
      { name: 'Asr', time: activeTimings.Asr, key: 'asr' },
      { name: 'Maghrib', time: activeTimings.Maghrib, key: 'maghrib' },
      { name: 'Isha', time: activeTimings.Isha, key: 'isha' }
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    let nextPrayer = null;
    let nextPrayerMinutes = null;

    for (let i = 0; i < prayerOrder.length; i++) {
      const p = prayerOrder[i];
      const [h, m] = p.time.split(':').map(Number);
      const pMin = h * 60 + m;
      if (pMin > currentMinutes) {
        nextPrayer = p;
        nextPrayerMinutes = pMin;
        break;
      }
    }

    if (!nextPrayer) {
      nextPrayer = prayerOrder[0];
      const [h, m] = nextPrayer.time.split(':').map(Number);
      nextPrayerMinutes = 24 * 60 + (h * 60 + m);
    }

    const diffMinutes = nextPrayerMinutes - currentMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const mins = Math.floor(diffMinutes % 60);

    const countdownHeading = document.getElementById('hero-next-prayer-heading');
    if (countdownHeading) {
      const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      countdownHeading.textContent = `${nextPrayer.name} in ${timeStr}`;
    }

    // Highlight timeline row matching next prayer with champagne gold glowing pill
    prayerOrder.forEach(p => {
      const row = document.getElementById(`timeline-row-${p.key}`);
      if (row) {
        if (p.key === nextPrayer.key) {
          row.className = 'flex items-center justify-between px-3 py-1.5 rounded-xl gold-pill-active text-amber-300 font-bold';
        } else {
          row.className = 'flex items-center justify-between px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition';
        }
      }
    });
  }

  // =========================================================================
  // 5. Verse of the Day Carousel & Audio Recitation
  // =========================================================================
  const SACRED_VERSES = [
    {
      arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      translation: 'Indeed, with hardship will be ease. (Surah Ash-Sharh 94:6)',
      surah: 'Surah Ash-Sharh (94:5-6)',
      audio: 'https://everyayah.com/data/Alafasy_128kbps/094005.mp3'
    },
    {
      arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
      translation: 'Allah does not burden a soul beyond that it can bear. (Surah Al-Baqarah 2:286)',
      surah: 'Surah Al-Baqarah (2:286)',
      audio: 'https://everyayah.com/data/Alafasy_128kbps/002286.mp3'
    },
    {
      arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
      translation: 'And He is with you wherever you are. (Surah Al-Hadid 57:4)',
      surah: 'Surah Al-Hadid (57:4)',
      audio: 'https://everyayah.com/data/Alafasy_128kbps/057004.mp3'
    },
    {
      arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
      translation: 'Unquestionably, by the remembrance of Allah hearts find rest. (Surah Ar-Ra\'d 13:28)',
      surah: 'Surah Ar-Ra\'d (13:28)',
      audio: 'https://everyayah.com/data/Alafasy_128kbps/013028.mp3'
    }
  ];

  let currentVerseIdx = 0;
  let verseAudio = null;

  function renderVerse(idx) {
    const v = SACRED_VERSES[idx];
    const arEl = document.getElementById('daily-verse-arabic');
    const transEl = document.getElementById('daily-verse-trans');
    const refEl = document.getElementById('daily-verse-ref');

    if (arEl) arEl.textContent = v.arabic;
    if (transEl) transEl.textContent = v.translation;
    if (refEl) refEl.textContent = v.surah;
  }
  renderVerse(0);

  const cycleVerseBtn = document.getElementById('btn-cycle-verse');
  if (cycleVerseBtn) {
    cycleVerseBtn.addEventListener('click', () => {
      currentVerseIdx = (currentVerseIdx + 1) % SACRED_VERSES.length;
      renderVerse(currentVerseIdx);
      if (verseAudio && !verseAudio.paused) {
        verseAudio.pause();
      }
    });
  }

  const playVerseBtn = document.getElementById('btn-play-verse');
  if (playVerseBtn) {
    playVerseBtn.addEventListener('click', () => {
      const v = SACRED_VERSES[currentVerseIdx];
      if (verseAudio && !verseAudio.paused) {
        verseAudio.pause();
        playVerseBtn.innerHTML = `<span>▶ Listen Recitation</span>`;
        return;
      }
      verseAudio = new Audio(v.audio);
      playVerseBtn.innerHTML = `<span>⏸ Pause Recitation</span>`;
      verseAudio.play().catch(e => console.warn('Audio play err:', e));
      verseAudio.onended = () => {
        playVerseBtn.innerHTML = `<span>▶ Listen Recitation</span>`;
      };
    });
  }

  // =========================================================================
  // 6. Spiritual Dashboard - Glowing Progress Rings
  // =========================================================================
  const PRAYER_MAX = 5;
  const DHIKR_MAX = 99;
  const QURAN_MAX = 30; // 30 mins
  const HABITS_MAX = 5;

  let statePrayers = 3;
  let stateDhikr = 66;
  let stateQuran = 15;
  let stateHabits = 4;

  function updateProgressRing(id, current, max) {
    const circle = document.getElementById(id);
    if (!circle) return;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (Math.min(current, max) / max) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  function syncAllRings() {
    updateProgressRing('ring-prayers', statePrayers, PRAYER_MAX);
    updateProgressRing('ring-dhikr', stateDhikr, DHIKR_MAX);
    updateProgressRing('ring-quran', stateQuran, QURAN_MAX);
    updateProgressRing('ring-habits', stateHabits, HABITS_MAX);

    const prayerVal = document.getElementById('val-ring-prayers');
    if (prayerVal) prayerVal.textContent = `${statePrayers}/${PRAYER_MAX}`;

    const dhikrVal = document.getElementById('val-ring-dhikr');
    if (dhikrVal) dhikrVal.textContent = `${stateDhikr}/${DHIKR_MAX}`;

    const quranVal = document.getElementById('val-ring-quran');
    if (quranVal) quranVal.textContent = `${stateQuran}m`;

    const habitVal = document.getElementById('val-ring-habits');
    if (habitVal) habitVal.textContent = `${stateHabits}/${HABITS_MAX}`;
  }
  syncAllRings();

  // =========================================================================
  // 7. Interactive Daily Habits Checklist (Syncs with Rings)
  // =========================================================================
  const habitChecks = document.querySelectorAll('.daily-habit-checkbox');
  habitChecks.forEach(cb => {
    cb.addEventListener('change', () => {
      const checkedCount = document.querySelectorAll('.daily-habit-checkbox:checked').length;
      stateHabits = checkedCount;
      syncAllRings();

      if (navigator.vibrate) navigator.vibrate(25);
    });
  });

  // =========================================================================
  // 8. Haptic Digital Tasbih Utility
  // =========================================================================
  let tasbihCount = 66;
  const tasbihCountEl = document.getElementById('sanctuary-tasbih-count');
  const tasbihTapBtn = document.getElementById('sanctuary-tasbih-tap');
  const tasbihResetBtn = document.getElementById('sanctuary-tasbih-reset');
  const tasbihDhikrLabel = document.getElementById('sanctuary-tasbih-dhikr-name');

  function playTasbihClick() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  if (tasbihTapBtn) {
    tasbihTapBtn.addEventListener('click', () => {
      tasbihCount++;
      if (tasbihCount > 99) tasbihCount = 1;
      if (tasbihCountEl) tasbihCountEl.textContent = tasbihCount;
      stateDhikr = tasbihCount;
      syncAllRings();
      playTasbihClick();

      if (navigator.vibrate) {
        if (tasbihCount === 33 || tasbihCount === 66 || tasbihCount === 99) {
          navigator.vibrate([60, 40, 60]);
        } else {
          navigator.vibrate(20);
        }
      }
    });
  }

  if (tasbihResetBtn) {
    tasbihResetBtn.addEventListener('click', () => {
      tasbihCount = 0;
      if (tasbihCountEl) tasbihCountEl.textContent = '0';
      stateDhikr = 0;
      syncAllRings();
    });
  }

  // Dhikr preset buttons
  document.querySelectorAll('.dhikr-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dhikr-pill-btn').forEach(b => b.classList.remove('gold-pill-active'));
      btn.classList.add('gold-pill-active');
      if (tasbihDhikrLabel) tasbihDhikrLabel.textContent = btn.getAttribute('data-name');
      tasbihCount = 0;
      if (tasbihCountEl) tasbihCountEl.textContent = '0';
    });
  });

  // =========================================================================
  // 9. Topic Sanctuary Knowledge Quick Filter
  // =========================================================================
  const topicData = {
    patience: {
      title: 'Patience & Steadfastness (الصبر)',
      ayah: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ',
      trans: 'And be patient, [O Muhammad], and your patience is not but through Allah. (16:127)',
      hadith: '"How wonderful is the affair of the believer, for his affair is all good... if hardship befalls him, he is patient, and that is better for him." (Muslim 2999)'
    },
    gratitude: {
      title: 'Gratitude (الشكر)',
      ayah: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
      trans: 'If you are grateful, I will surely increase you [in favor]. (14:7)',
      hadith: '"Look to those who are lower than you, and do not look to those who are higher than you, for that is more likely to prevent you from underestimating the favor of Allah." (Muslim 2963)'
    },
    forgiveness: {
      title: 'Repentance & Mercy (التوبة والمغفرة)',
      ayah: 'إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
      trans: 'Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful. (39:53)',
      hadith: '"Every son of Adam commits sins, and the best of those who commit sins are the repenting." (Tirmidhi 2499)'
    },
    sakinah: {
      title: 'Inner Peace & Serenity (السكينة)',
      ayah: 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ',
      trans: 'It is He who sent down tranquility into the hearts of the believers that they would increase in faith. (48:4)',
      hadith: '"No people gather together in one of the Houses of Allah, reciting the Book of Allah and studying it together, but tranquility descends upon them." (Muslim 2699)'
    }
  };

  const topicContainer = document.getElementById('topic-result-box');
  document.querySelectorAll('.topic-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.topic-pill-btn').forEach(b => b.classList.remove('gold-pill-active', 'text-amber-400'));
      btn.classList.add('gold-pill-active', 'text-amber-400');
      const key = btn.getAttribute('data-topic');
      const d = topicData[key];
      if (d && topicContainer) {
        topicContainer.innerHTML = `
          <div class="space-y-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
            <h4 class="font-bold text-amber-400 text-sm">${d.title}</h4>
            <p class="font-arabic text-base text-emerald-100">${d.ayah}</p>
            <p class="text-xs text-slate-300 italic">${d.trans}</p>
            <div class="pt-2 border-t border-emerald-800/40 text-[11px] text-slate-400">
              <strong class="text-emerald-400">Prophetic Hadith:</strong> ${d.hadith}
            </div>
          </div>
        `;
      }
    });
  });

  // Load initial prayer timetable
  loadPrayerTimes();
});
