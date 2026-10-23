/**
 * SawmMate - Ramadan Companion & Fasting Habit Tracker
 * Fully Functional JavaScript Engine
 */

// ==========================================================================
// 1. Core Data Constants & Curated Datasets
// ==========================================================================

const DUAS_COLLECTION = [
  {
    id: "niyyah",
    title: "Du'a for Keeping the Fast (Niyyah / Intention)",
    timing: "Before Fajr / At Suhoor",
    arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    transliteration: "Wa bi-sawmi ghadin nawaytu min shahri Ramaḍān.",
    english: "I intend to keep the fast tomorrow in the blessed month of Ramadan.",
    reference: "Traditional Intention of the Heart"
  },
  {
    id: "iftar-sunnah",
    title: "Sunnah Du'a for Breaking the Fast (Iftar)",
    timing: "At Maghrib after taking the first sip or date",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    transliteration: "Dhahaba aẓ-ẓama'u wabtallatil-'urūqu wa thabatal-ajru in shā' Allāh.",
    english: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
    reference: "Sunan Abi Dawud (Hadith 2357) - Sahih"
  },
  {
    id: "iftar-traditional",
    title: "Common Iftar Supplication",
    timing: "Before or at breaking the fast",
    arabic: "اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    transliteration: "Allāhumma innī laka ṣumtu wa bika āmantu wa 'alā rizqika afṭart.",
    english: "O Allah, for You I have fasted, in You I have believed, and with Your provision I break my fast.",
    reference: "Abu Dawud (Hadith 2358)"
  },
  {
    id: "laylatul-qadr",
    title: "Du'a for Laylatul Qadr (Night of Power)",
    timing: "Odd nights of the Last 10 Nights",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allāhumma innaka 'Afuwwun Karīmun tuḥibbul-'afwa fa'fu 'annī.",
    english: "O Allah, You are Most Forgiving and Generous; You love forgiveness, so forgive me.",
    reference: "Jami' at-Tirmidhi (Hadith 3513) - Sahih"
  },
  {
    id: "guest-host",
    title: "Du'a When Breaking Fast with a Host / Family",
    timing: "When invited to an Iftar gathering",
    arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ وَأَكَلَ طَعَامَكُمُ الأَبْرَارُ وَصَلَّتْ عَلَيْكُمُ الْمَلاَئِكَةُ",
    transliteration: "Afṭara 'indakumus-ṣā'imūna wa akala ṭa'āmakumul-abrāru wa ṣallat 'alaykumul-malā'ikah.",
    english: "May fasting people break fast with you, may the righteous eat your food, and may the angels pray for you.",
    reference: "Sunan Abi Dawud (Hadith 3854) - Sahih"
  }
];

const SUNNAH_CHALLENGES = [
  "Day 1: Renew your sincere Niyyah (intention) for the entire month and ask forgiveness from parents & family.",
  "Day 2: Provide dates or water to a fasting person at Iftar to earn the equivalent reward of their fast.",
  "Day 3: Send 100 Salawat (blessings) upon the Prophet Muhammad ﷺ with mindful devotion.",
  "Day 4: Make earnest personal Du'a during the final 15 minutes before Iftar when supplications are accepted.",
  "Day 5: Give secret Sadaqah (charity) — even a small amount — where only Allah knows.",
  "Day 6: Wake up 20 minutes before Suhoor to pray at least 2 Rak'ahs of Tahajjud (Night Prayer).",
  "Day 7: Call or visit a relative you haven't spoken to recently to uphold the sacred ties of kinship.",
  "Day 8: Spend 10 distraction-free minutes reciting Istighfar (Astaghfirullah) 100 times.",
  "Day 9: Memorize and contemplate a new Du'a or short Surah from the Quran.",
  "Day 10: Reflect on the completion of the 1st Ashra (Days of Mercy) and make sincere Tawbah (repentance).",
  "Day 11: Practice mindful speech: deliberately avoid complaining, gossiping (Gheebah), or anger all day.",
  "Day 12: Help prepare or clean up after the family Suhoor or Iftar meal with a warm smile.",
  "Day 13: Read the translation and tafsir (meaning) of at least 5 Ayahs you recited today.",
  "Day 14: Send a warm meal or sweet gift to a neighbor, sharing the warmth of Ramadan.",
  "Day 15: Halfway milestone! Evaluate your Quran and prayer goals and reignite your spiritual energy.",
  "Day 16: Learn and recite Sayyid al-Istighfar (The Master Supplication for Forgiveness) with reflection.",
  "Day 17: Remember the Day of Badr — make earnest Du'a for the relief of oppressed people worldwide.",
  "Day 18: Offer your Dhuhr and Asr prayers in congregation (Jama'ah) at the mosque if possible.",
  "Day 19: Cleanse your heart: forgive someone who has wronged or hurt you purely for the sake of Allah.",
  "Day 20: Prepare your schedule and eliminate worldly distractions for the blessed Last 10 Nights.",
  "Day 21 (21st Night): First odd night! Search for Laylatul Qadr; pray Taraweeh and recite Allahumma innaka 'afuwwun.",
  "Day 22: Give automated or daily Sadaqah for the last 10 nights so you catch Laylatul Qadr giving charity.",
  "Day 23 (23rd Night): Second odd night! Stand in night prayer and pour your heart out in intimate Du'a.",
  "Day 24: Spend 15 minutes in silent contemplation (Tafakkur) on Allah's countless gifts and your life purpose.",
  "Day 25 (25th Night): Third odd night! Dedicate extra Quran recitation and seek deliverance from the Fire.",
  "Day 26: Calculate and prepare your Zakat al-Fitr early to ensure it reaches the needy before Eid.",
  "Day 27 (27th Night): The honored 27th night! Stand in Qiyam, weep in repentance, and seek divine pardon.",
  "Day 28: Write down your top 5 life Du'as and repeat them persistently in Sujood and before Iftar.",
  "Day 29 (29th Night): Final odd night! Re-double your devotion; deeds are judged by their conclusions.",
  "Day 30: Express profound gratitude (Shukr) to Allah for allowing you to complete this blessed Ramadan."
];

const QURAN_JUZ_METADATA = [
  { juz: 1, name: "Al-Fatiha - Al-Baqarah 141", pages: "1 - 21" },
  { juz: 2, name: "Al-Baqarah 142 - 252", pages: "22 - 41" },
  { juz: 3, name: "Al-Baqarah 253 - Ali 'Imran 92", pages: "42 - 61" },
  { juz: 4, name: "Ali 'Imran 93 - An-Nisa 23", pages: "62 - 81" },
  { juz: 5, name: "An-Nisa 24 - 147", pages: "82 - 101" },
  { juz: 6, name: "An-Nisa 148 - Al-Ma'idah 81", pages: "102 - 121" },
  { juz: 7, name: "Al-Ma'idah 82 - Al-An'am 110", pages: "122 - 141" },
  { juz: 8, name: "Al-An'am 111 - Al-A'raf 87", pages: "142 - 161" },
  { juz: 9, name: "Al-A'raf 88 - Al-Anfal 40", pages: "162 - 181" },
  { juz: 10, name: "Al-Anfal 41 - At-Tawbah 92", pages: "182 - 201" },
  { juz: 11, name: "At-Tawbah 93 - Hud 5", pages: "202 - 221" },
  { juz: 12, name: "Hud 6 - Yusuf 52", pages: "222 - 241" },
  { juz: 13, name: "Yusuf 53 - Ibrahim 52", pages: "242 - 261" },
  { juz: 14, name: "Al-Hijr 1 - An-Nahl 128", pages: "262 - 281" },
  { juz: 15, name: "Al-Isra 1 - Al-Kahf 74", pages: "282 - 301" },
  { juz: 16, name: "Al-Kahf 75 - Ta-Ha 135", pages: "302 - 321" },
  { juz: 17, name: "Al-Anbiya 1 - Al-Hajj 78", pages: "322 - 341" },
  { juz: 18, name: "Al-Mu'minun 1 - Al-Furqan 20", pages: "342 - 361" },
  { juz: 19, name: "Al-Furqan 21 - An-Naml 55", pages: "362 - 381" },
  { juz: 20, name: "An-Naml 56 - Al-'Ankabut 45", pages: "382 - 401" },
  { juz: 21, name: "Al-'Ankabut 46 - Al-Ahzab 30", pages: "402 - 421" },
  { juz: 22, name: "Al-Ahzab 31 - Ya-Sin 27", pages: "422 - 441" },
  { juz: 23, name: "Ya-Sin 28 - Az-Zumar 31", pages: "442 - 461" },
  { juz: 24, name: "Az-Zumar 32 - Fussilat 46", pages: "462 - 481" },
  { juz: 25, name: "Fussilat 47 - Al-Jathiyah 37", pages: "482 - 501" },
  { juz: 26, name: "Al-Ahqaf 1 - Adh-Dhariyat 30", pages: "502 - 521" },
  { juz: 27, name: "Adh-Dhariyat 31 - Al-Hadid 29", pages: "522 - 541" },
  { juz: 28, name: "Al-Mujadila 1 - At-Tahrim 12", pages: "542 - 561" },
  { juz: 29, name: "Al-Mulk 1 - Al-Mursalat 50", pages: "562 - 581" },
  { juz: 30, name: "An-Naba 1 - An-Nas 6", pages: "582 - 604" }
];

const PRESET_CITIES = [
  { name: "Makkah", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262, tz: 3, method: "Makkah" },
  { name: "Madinah", country: "Saudi Arabia", lat: 24.4672, lng: 39.6111, tz: 3, method: "Makkah" },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, tz: 2, method: "Egypt" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, tz: 0, method: "MWL" },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.0060, tz: -5, method: "ISNA" },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, tz: 4, method: "Makkah" },
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, tz: 3, method: "Diyanet" },
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, tz: 7, method: "MWL" },
  { name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, tz: 5, method: "Karachi" },
  { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, tz: 6, method: "Karachi" },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869, tz: 8, method: "MWL" },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, tz: -5, method: "ISNA" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, tz: 10, method: "MWL" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, tz: 1, method: "MWL" },
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, tz: 1, method: "MWL" }
];

const CALC_METHODS = {
  MWL: { name: "Muslim World League", fajrAngle: 18.0, ishaAngle: 17.0 },
  ISNA: { name: "Islamic Society of North America", fajrAngle: 15.0, ishaAngle: 15.0 },
  Egypt: { name: "Egyptian General Authority of Survey", fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { name: "Umm Al-Qura University, Makkah", fajrAngle: 18.5, ishaMinutes: 90 },
  Karachi: { name: "University of Islamic Sciences, Karachi", fajrAngle: 18.0, ishaAngle: 18.0 },
  Diyanet: { name: "Diyanet İşleri Başkanlığı, Turkey", fajrAngle: 18.0, ishaAngle: 17.0 }
};

const BADGES_DEFINITIONS = [
  { id: "b1", name: "Hilal Sighter", icon: "🌙", desc: "Began your Ramadan journey with your first logged habit.", condition: s => s.totalHabitsLogged >= 1 },
  { id: "b2", name: "Dawn Watcher", icon: "🌅", desc: "Maintained Fajr and Suhoor on 3 distinct days.", condition: s => s.fajrCount >= 3 },
  { id: "b3", name: "Pillar of Fasting", icon: "✨", desc: "Successfully completed 7 full days of fasting.", condition: s => s.fastedDays >= 7 },
  { id: "b4", name: "Taraweeh Devotee", icon: "🕌", desc: "Prayed Taraweeh prayers on at least 7 nights.", condition: s => s.taraweehDays >= 7 },
  { id: "b5", name: "Generous Hand", icon: "🤝", desc: "Distributed Sadaqah (charity) on 10 separate days.", condition: s => s.sadaqahDays >= 10 },
  { id: "b6", name: "Halfway Haven", icon: "⚖️", desc: "Completed 15 blessed days of Ramadan fasting.", condition: s => s.fastedDays >= 15 },
  { id: "b7", name: "Quran Explorer", icon: "📖", desc: "Completed 10 Juz or 200 pages of the Holy Quran.", condition: s => s.juzCompletedCount >= 10 || s.totalQuranPages >= 200 },
  { id: "b8", name: "Night of Power", icon: "🌟", desc: "Engaged in Qiyam & Tahajjud on the 27th night.", condition: s => s.night27Worship },
  { id: "b9", name: "Khatm Al-Quran", icon: "📜", desc: "Accomplished a complete Khatm of the entire Quran (30 Juz).", condition: s => s.juzCompletedCount >= 30 || s.totalQuranPages >= 604 },
  { id: "b10", name: "Ramadan Victor", icon: "🏆", desc: "Steadfast devotion: fasted 28+ days and prayed 100+ prayers.", condition: s => s.fastedDays >= 28 && s.prayerTotal >= 100 }
];

// ==========================================================================
// 2. Solar Astronomical Prayer Times Calculation Engine (Offline-First)
// ==========================================================================

const SolarCalc = {
  degToRad: d => (d * Math.PI) / 180.0,
  radToDeg: r => (r * 180.0) / Math.PI,
  sinDeg: d => Math.sin((d * Math.PI) / 180.0),
  cosDeg: d => Math.cos((d * Math.PI) / 180.0),
  tanDeg: d => Math.tan((d * Math.PI) / 180.0),
  asinDeg: x => (Math.asin(Math.max(-1, Math.min(1, x))) * 180.0) / Math.PI,
  acosDeg: x => (Math.acos(Math.max(-1, Math.min(1, x))) * 180.0) / Math.PI,
  atanDeg: x => (Math.atan(x) * 180.0) / Math.PI,
  atan2Deg: (y, x) => (Math.atan2(y, x) * 180.0) / Math.PI,

  getJulianDate: function(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  },

  getSunCoordinates: function(jd) {
    const d = jd - 2451545.0;
    const g = (357.529 + 0.98560028 * d) % 360;
    const q = (280.459 + 0.98564736 * d) % 360;
    const l = (q + 1.915 * this.sinDeg(g) + 0.020 * this.sinDeg(2 * g)) % 360;
    const e = 23.439 - 0.00000036 * d;
    let ra = this.atan2Deg(this.cosDeg(e) * this.sinDeg(l), this.cosDeg(l));
    ra = (ra + 360) % 360;
    ra = ra / 15.0;
    const dec = this.asinDeg(this.sinDeg(e) * this.sinDeg(l));
    const eqt = (q / 15.0) - ra;
    return { declination: dec, equationOfTime: eqt };
  },

  calculateTimes: function(date, lat, lng, methodKey, offsetFajr = 0, offsetMaghrib = 0, customTz = undefined) {
    const method = CALC_METHODS[methodKey] || CALC_METHODS.MWL;
    const jd = this.getJulianDate(date);
    const sun = this.getSunCoordinates(jd);
    
    // Resolve timezone
    let tz;
    if (customTz !== undefined && customTz !== null) {
      tz = customTz;
    } else if (typeof state !== "undefined" && state.data?.settings?.tz !== undefined) {
      tz = state.data.settings.tz;
    } else {
      tz = -date.getTimezoneOffset() / 60;
    }

    const noon = 12 + tz - (lng / 15.0) - sun.equationOfTime;

    const getHourAngle = (alpha) => {
      const cosH = (this.sinDeg(alpha) - this.sinDeg(lat) * this.sinDeg(sun.declination)) /
                   (this.cosDeg(lat) * this.cosDeg(sun.declination));
      if (cosH > 1) return 0;
      if (cosH < -1) return 180;
      return this.acosDeg(cosH);
    };

    const sunH = getHourAngle(-0.833) / 15.0;
    const sunriseHour = noon - sunH;
    const sunsetHour = noon + sunH;

    const fajrH = getHourAngle(-method.fajrAngle) / 15.0;
    let fajrHour = noon - fajrH + (offsetFajr / 60.0);

    const asrAltitude = this.atanDeg(1.0 / (1.0 + this.tanDeg(Math.abs(lat - sun.declination))));
    const asrH = getHourAngle(asrAltitude) / 15.0;
    const asrHour = noon + asrH;

    let maghribHour = sunsetHour + (offsetMaghrib / 60.0);

    let ishaHour;
    if (method.ishaMinutes) {
      ishaHour = maghribHour + (method.ishaMinutes / 60.0);
    } else {
      const ishaH = getHourAngle(-method.ishaAngle) / 15.0;
      ishaHour = noon + ishaH;
    }

    const imsakHour = fajrHour - (10 / 60.0);

    const hourToDate = (h) => {
      let totalMins = Math.round(h * 60);
      totalMins = (totalMins + 1440) % 1440;
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      const d = new Date(date);
      d.setHours(hrs, mins, 0, 0);
      return d;
    };

    const formatHour = (h) => {
      let totalMins = Math.round(h * 60);
      totalMins = (totalMins + 1440) % 1440;
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      const ampm = hrs >= 12 ? "PM" : "AM";
      const h12 = hrs % 12 || 12;
      return `${String(h12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${ampm}`;
    };

    return {
      imsak: { date: hourToDate(imsakHour), str: formatHour(imsakHour) },
      fajr: { date: hourToDate(fajrHour), str: formatHour(fajrHour) },
      sunrise: { date: hourToDate(sunriseHour), str: formatHour(sunriseHour) },
      dhuhr: { date: hourToDate(noon), str: formatHour(noon) },
      asr: { date: hourToDate(asrHour), str: formatHour(asrHour) },
      maghrib: { date: hourToDate(maghribHour), str: formatHour(maghribHour) },
      isha: { date: hourToDate(ishaHour), str: formatHour(ishaHour) },
      fastingDurationMin: Math.round((maghribHour - fajrHour) * 60)
    };
  }
};

// ==========================================================================
// 3. Audio & Web Audio API Sound Synthesizer
// ==========================================================================

const SoundSynth = {
  ctx: null,
  enabled: true,

  init: function() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  },

  playTone: function(frequency, duration, type = "sine", gainVal = 0.15) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio synthesis issue:", e);
    }
  },

  playCheckChime: function() {
    if (!this.enabled) return;
    this.playTone(523.25, 0.25, "sine", 0.12); // C5
    setTimeout(() => this.playTone(659.25, 0.35, "sine", 0.15), 100); // E5
  },

  playCelebrationChime: function() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.45, "triangle", 0.2);
      }, idx * 110);
    });
  },

  playSpiritualMelody: function() {
    if (!this.enabled) return;
    const melody = [440, 493.88, 554.37, 659.25, 554.37, 493.88, 440];
    melody.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 0.6, "sine", 0.15);
      }, i * 350);
    });
  }
};

// ==========================================================================
// 4. State Management & Storage
// ==========================================================================

const STORAGE_KEY = "sawmmate_v1_store";

class AppState {
  constructor() {
    this.data = this.loadInitialState();
  }

  loadInitialState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error("Failed to parse storage, using defaults", e);
      }
    }

    // Default configuration
    // Default Ramadan start date: March 1st of current year (or previous/next)
    const today = new Date();
    const defaultStartYear = today.getFullYear();
    // Use Feb/March approximation or today if close to Ramadan
    const defaultStartDate = new Date(defaultStartYear, 1, 18); // Example: 18 Feb

    const initialState = {
      settings: {
        city: "Makkah",
        country: "Saudi Arabia",
        lat: 21.4225,
        lng: 39.8262,
        tz: 3,
        method: "Makkah",
        ramadanStartDate: defaultStartDate.toISOString().split("T")[0],
        offsetFajr: 0,
        offsetMaghrib: 0,
        soundEnabled: true
      },
      currentSelectedDay: 1,
      khatmGoal: 1, // 1 Khatm, 2 Khatms, etc.
      quranBookmark: {
        surah: "Al-Baqarah",
        ayah: 183,
        page: 28
      },
      // Array of 30 days of data (1-indexed for ease)
      days: {}
    };

    // Initialize 30 days
    for (let i = 1; i <= 30; i++) {
      initialState.days[i] = {
        dayNum: i,
        fastingStatus: i === 1 ? "fasted" : "upcoming", // 'fasted' | 'excused' | 'missed' | 'upcoming'
        prayers: {
          fajr: i === 1,
          dhuhr: i === 1,
          asr: i === 1,
          maghrib: false,
          isha: false
        },
        prayersJamaah: {
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false
        },
        taraweeh: 0,
        tahajjud: 0,
        adhkarMorning: i === 1,
        adhkarEvening: false,
        sadaqah: false,
        sadaqahNote: "",
        quranPages: i === 1 ? 20 : 0,
        juzRead: i === 1 ? [1] : [],
        challengeCompleted: false,
        reflection: ""
      };
    }

    // Initialize 30 Juz completion flags
    initialState.juzCompleted = new Array(31).fill(false);
    initialState.juzCompleted[1] = true;

    return initialState;
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error("Storage save error", e);
    }
  }

  getDayData(dayNum) {
    if (!this.data.days[dayNum]) {
      this.data.days[dayNum] = {
        dayNum: dayNum,
        fastingStatus: "upcoming",
        prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
        prayersJamaah: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
        taraweeh: 0,
        tahajjud: 0,
        adhkarMorning: false,
        adhkarEvening: false,
        sadaqah: false,
        sadaqahNote: "",
        quranPages: 0,
        juzRead: [],
        challengeCompleted: false,
        reflection: ""
      };
    }
    return this.data.days[dayNum];
  }

  computeStats() {
    let fastedDays = 0;
    let prayerTotal = 0;
    let fajrCount = 0;
    let taraweehDays = 0;
    let sadaqahDays = 0;
    let totalQuranPages = 0;
    let totalHabitsLogged = 0;
    let night27Worship = false;

    for (let i = 1; i <= 30; i++) {
      const d = this.data.days[i];
      if (!d) continue;

      if (d.fastingStatus === "fasted") {
        fastedDays++;
        totalHabitsLogged++;
      }

      if (d.prayers) {
        if (d.prayers.fajr) { prayerTotal++; fajrCount++; totalHabitsLogged++; }
        if (d.prayers.dhuhr) { prayerTotal++; totalHabitsLogged++; }
        if (d.prayers.asr) { prayerTotal++; totalHabitsLogged++; }
        if (d.prayers.maghrib) { prayerTotal++; totalHabitsLogged++; }
        if (d.prayers.isha) { prayerTotal++; totalHabitsLogged++; }
      }

      if (d.taraweeh > 0) {
        taraweehDays++;
        totalHabitsLogged++;
      }
      if (d.sadaqah) {
        sadaqahDays++;
        totalHabitsLogged++;
      }
      if (d.quranPages > 0) {
        totalQuranPages += Number(d.quranPages);
        totalHabitsLogged++;
      }
      if (d.challengeCompleted) {
        totalHabitsLogged++;
      }

      // Check night 27 worship
      if (i === 27 && (d.taraweeh > 0 || d.tahajjud > 0 || d.prayers?.fajr)) {
        night27Worship = true;
      }
    }

    // Count Juz completed
    let juzCompletedCount = 0;
    if (this.data.juzCompleted) {
      for (let j = 1; j <= 30; j++) {
        if (this.data.juzCompleted[j]) juzCompletedCount++;
      }
    }

    return {
      fastedDays,
      prayerTotal,
      fajrCount,
      taraweehDays,
      sadaqahDays,
      totalQuranPages,
      juzCompletedCount,
      totalHabitsLogged,
      night27Worship
    };
  }

  // Calculate current Ramadan day index based on start date
  calculateCurrentRamadanDay() {
    const start = new Date(this.data.settings.ramadanStartDate);
    start.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays >= 1 && diffDays <= 30) {
      return diffDays;
    }
    // If before Ramadan, return 1; if after, return 30
    return diffDays < 1 ? 1 : 30;
  }
}

// Instantiate state
const state = new AppState();

// ==========================================================================
// 5. Starfield & Background Canvas System
// ==========================================================================

function initStarfield() {
  const canvas = document.getElementById("star-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  });

  const stars = [];
  const STAR_COUNT = 140;

  function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.3 ? "#ffffff" : Math.random() > 0.5 ? "#fde68a" : "#c7d2fe"
      });
    }
  }

  // Shooting star
  let shootingStar = null;
  function triggerShootingStar() {
    shootingStar = {
      x: Math.random() * (width * 0.7),
      y: Math.random() * (height * 0.4),
      length: Math.random() * 80 + 70,
      speed: Math.random() * 10 + 12,
      angle: Math.PI / 4,
      alpha: 1.0
    };
  }

  setInterval(() => {
    if (!shootingStar && Math.random() > 0.3) {
      triggerShootingStar();
    }
  }, 7000);

  createStars();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render stars
    for (let star of stars) {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.95 || star.alpha < 0.15) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
      ctx.shadowColor = star.color;
      ctx.fill();
      ctx.restore();
    }

    // Render shooting star
    if (shootingStar) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
      const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
      ctx.lineTo(tailX, tailY);

      const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.5, "rgba(254, 243, 199, 0.6)");
      grad.addColorStop(1, "rgba(254, 243, 199, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = shootingStar.alpha;
      ctx.stroke();
      ctx.restore();

      shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.alpha -= 0.015;

      if (shootingStar.alpha <= 0) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// 6. Confetti & Celebration System
// ==========================================================================

function fireCelebrationConfetti() {
  if (typeof window.confetti === "function") {
    // Canvas-confetti multi-burst
    const count = 160;
    const defaults = {
      origin: { y: 0.65 },
      colors: ["#f59e0b", "#fbbf24", "#10b981", "#34d399", "#8b5cf6", "#ffffff"]
    };

    function fire(particleRatio, opts) {
      window.confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } else {
    // Inline canvas fallback notification
    showToast("🎉 Ramadan Goal Completed! Masha'Allah!");
  }
  SoundSynth.playCelebrationChime();
}

// Toast helper
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 7. Live Fasting Countdown & Progress Ring
// ==========================================================================

function updateLiveCountdown() {
  const now = new Date();

  // Calculate today's prayer times for current settings
  const todayTimes = SolarCalc.calculateTimes(
    now,
    state.data.settings.lat,
    state.data.settings.lng,
    state.data.settings.method,
    state.data.settings.offsetFajr,
    state.data.settings.offsetMaghrib
  );

  const fajrTime = todayTimes.fajr.date;
  const maghribTime = todayTimes.maghrib.date;

  // Tomorrow's Fajr for overnight countdown
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = SolarCalc.calculateTimes(
    tomorrow,
    state.data.settings.lat,
    state.data.settings.lng,
    state.data.settings.method,
    state.data.settings.offsetFajr,
    state.data.settings.offsetMaghrib
  );
  const tomorrowFajr = tomorrowTimes.fajr.date;

  // DOM Elements
  const statePill = document.getElementById("fasting-state-pill");
  const targetSub = document.getElementById("countdown-target-subtitle");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");
  const circleProgress = document.getElementById("fasting-circle-progress");
  const circlePercentText = document.getElementById("fasting-percent-text");
  const startTimeLabel = document.getElementById("dial-start-time");
  const endTimeLabel = document.getElementById("dial-end-time");

  // Determine state:
  // Is it between today's Fajr and Maghrib?
  const isFasting = now >= fajrTime && now < maghribTime;

  let targetDate;
  let elapsedMs, totalMs;

  if (isFasting) {
    // Fasting currently active
    targetDate = maghribTime;
    elapsedMs = now - fajrTime;
    totalMs = maghribTime - fajrTime;

    if (statePill) {
      statePill.className = "fasting-state-pill fasting";
      statePill.innerHTML = `<span class="pulse-dot"></span> Fasting In Progress`;
    }
    if (targetSub) {
      targetSub.innerHTML = `Time Remaining Until Iftar (Maghrib at ${todayTimes.maghrib.str})`;
    }
    if (startTimeLabel) startTimeLabel.textContent = todayTimes.fajr.str;
    if (endTimeLabel) endTimeLabel.textContent = todayTimes.maghrib.str;
  } else {
    // Outside fasting hours (eating & Suhoor window)
    if (statePill) {
      statePill.className = "fasting-state-pill eating";
      statePill.innerHTML = `<span class="pulse-dot"></span> Suhoor & Eating Allowed`;
    }

    if (now < fajrTime) {
      // Early morning before Fajr: countdown to today's Fajr
      targetDate = fajrTime;
      // Previous day Maghrib
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayTimes = SolarCalc.calculateTimes(
        yesterday,
        state.data.settings.lat,
        state.data.settings.lng,
        state.data.settings.method,
        state.data.settings.offsetFajr,
        state.data.settings.offsetMaghrib
      );
      elapsedMs = now - yesterdayTimes.maghrib.date;
      totalMs = fajrTime - yesterdayTimes.maghrib.date;

      if (targetSub) {
        targetSub.innerHTML = `Countdown to Suhoor Ends (Fajr at ${todayTimes.fajr.str})`;
      }
      if (startTimeLabel) startTimeLabel.textContent = yesterdayTimes.maghrib.str;
      if (endTimeLabel) endTimeLabel.textContent = todayTimes.fajr.str;
    } else {
      // Evening after Maghrib: countdown to tomorrow's Fajr
      targetDate = tomorrowFajr;
      elapsedMs = now - maghribTime;
      totalMs = tomorrowFajr - maghribTime;

      if (targetSub) {
        targetSub.innerHTML = `Suhoor Countdown (Tomorrow Fajr at ${tomorrowTimes.fajr.str})`;
      }
      if (startTimeLabel) startTimeLabel.textContent = todayTimes.maghrib.str;
      if (endTimeLabel) endTimeLabel.textContent = tomorrowTimes.fajr.str;
    }
  }

  // Calculate remaining time
  const diffMs = Math.max(0, targetDate - now);
  const diffSec = Math.floor(diffMs / 1000);
  const hrs = Math.floor(diffSec / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  const secs = diffSec % 60;

  if (cdHours) cdHours.textContent = String(hrs).padStart(2, "0");
  if (cdMinutes) cdMinutes.textContent = String(mins).padStart(2, "0");
  if (cdSeconds) cdSeconds.textContent = String(secs).padStart(2, "0");

  // Calculate percentage
  let percentage = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
  if (isNaN(percentage)) percentage = 0;

  if (circlePercentText) {
    circlePercentText.textContent = `${percentage}%`;
  }

  // SVG circular circumference: 2 * PI * r = 2 * PI * 80 ≈ 502.65
  const circumference = 502.65;
  if (circleProgress) {
    const strokeOffset = circumference - (percentage / 100) * circumference;
    circleProgress.style.strokeDashoffset = strokeOffset;
  }

  // Update digital live clock label in hero
  const clockEl = document.getElementById("live-digital-clock");
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  // Update Prayer Times Ribbon
  updatePrayersRibbon(now, todayTimes);

  // Update Eid Countdown
  updateEidCountdown(now);
}

function updatePrayersRibbon(now, times) {
  const ribbonPrayers = [
    { key: "imsak", name: "Imsak", time: times.imsak.str, date: times.imsak.date },
    { key: "fajr", name: "Fajr", time: times.fajr.str, date: times.fajr.date },
    { key: "sunrise", name: "Sunrise", time: times.sunrise.str, date: times.sunrise.date },
    { key: "dhuhr", name: "Dhuhr", time: times.dhuhr.str, date: times.dhuhr.date },
    { key: "asr", name: "Asr", time: times.asr.str, date: times.asr.date },
    { key: "maghrib", name: "Maghrib (Iftar)", time: times.maghrib.str, date: times.maghrib.date },
    { key: "isha", name: "Isha", time: times.isha.str, date: times.isha.date }
  ];

  const container = document.getElementById("prayers-ribbon-container");
  if (!container) return;

  // Find current active prayer
  let activeIndex = -1;
  for (let i = 0; i < ribbonPrayers.length; i++) {
    if (now >= ribbonPrayers[i].date) {
      activeIndex = i;
    }
  }

  container.innerHTML = ribbonPrayers.map((p, idx) => {
    const isActive = idx === activeIndex;
    return `
      <div class="prayer-item ${isActive ? "active" : ""}">
        <span class="prayer-name">${p.name}</span>
        <span class="prayer-time">${p.time}</span>
        ${isActive ? '<span class="prayer-badge">NOW</span>' : ""}
      </div>
    `;
  }).join("");
}

function updateEidCountdown(now) {
  const start = new Date(state.data.settings.ramadanStartDate);
  const eidDate = new Date(start);
  eidDate.setDate(eidDate.getDate() + 30); // 30 days after start = Eid-ul-Fitr
  eidDate.setHours(6, 0, 0, 0);

  const diffMs = eidDate - now;
  const daysEl = document.getElementById("eid-days-count");
  if (!daysEl) return;

  if (diffMs <= 0) {
    daysEl.textContent = "0";
    const subEl = document.getElementById("eid-subtitle");
    if (subEl) subEl.textContent = "Eid Mubarak! 🎊";
  } else {
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    daysEl.textContent = days;
  }
}

// ==========================================================================
// 8. Daily Habit Tracker View
// ==========================================================================

function renderHabitsView() {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  // Update Day Navigator Heading
  const dayHeading = document.getElementById("active-day-heading");
  const ashraBadge = document.getElementById("active-ashra-badge");
  const subDateEl = document.getElementById("active-day-date-sub");

  if (dayHeading) dayHeading.textContent = `Ramadan Day ${activeDay} of 30`;

  // Compute Gregorian date of selected day
  const ramadanStart = new Date(state.data.settings.ramadanStartDate);
  const dayDate = new Date(ramadanStart);
  dayDate.setDate(dayDate.getDate() + (activeDay - 1));
  if (subDateEl) {
    subDateEl.textContent = dayDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  }

  // Ashra status
  if (ashraBadge) {
    if (activeDay <= 10) {
      ashraBadge.className = "ashra-badge ashra-1";
      ashraBadge.textContent = "1st Ashra • Days of Mercy (رَحْمَة)";
    } else if (activeDay <= 20) {
      ashraBadge.className = "ashra-badge ashra-2";
      ashraBadge.textContent = "2nd Ashra • Days of Forgiveness (مَغْفِرَة)";
    } else {
      ashraBadge.className = "ashra-badge ashra-3";
      ashraBadge.textContent = "3rd Ashra • Days of Deliverance (نَجَاة)";
    }
  }

  // Fasting Status Buttons
  const statusButtons = document.querySelectorAll(".status-opt-btn");
  statusButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.status === dayData.fastingStatus) {
      btn.classList.add("active");
    }
  });

  // Calculate day's prayer times for reference
  const dayTimes = SolarCalc.calculateTimes(
    dayDate,
    state.data.settings.lat,
    state.data.settings.lng,
    state.data.settings.method,
    state.data.settings.offsetFajr,
    state.data.settings.offsetMaghrib
  );

  // 5 Prayers Checkboxes
  const prayersList = [
    { key: "fajr", name: "Fajr", time: dayTimes.fajr.str },
    { key: "dhuhr", name: "Dhuhr", time: dayTimes.dhuhr.str },
    { key: "asr", name: "Asr", time: dayTimes.asr.str },
    { key: "maghrib", name: "Maghrib (Iftar)", time: dayTimes.maghrib.str },
    { key: "isha", name: "Isha", time: dayTimes.isha.str }
  ];

  const prayersContainer = document.getElementById("prayers-checklist-rows");
  if (prayersContainer) {
    let completedCount = 0;
    prayersContainer.innerHTML = prayersList.map(p => {
      const isChecked = !!dayData.prayers[p.key];
      const isJamaah = !!dayData.prayersJamaah?.[p.key];
      if (isChecked) completedCount++;

      return `
        <div class="prayer-check-row ${isChecked ? "completed" : ""}" data-prayer="${p.key}">
          <div class="custom-checkbox-wrap" onclick="togglePrayer('${p.key}')">
            <div class="checkbox-custom ${isChecked ? "checked" : ""}">
              ✓
            </div>
            <div>
              <span class="check-label">${p.name}</span>
              <span class="prayer-time-sub">${p.time}</span>
            </div>
          </div>
          <button class="jamaah-toggle-btn ${isJamaah ? "active" : ""}" onclick="toggleJamaah('${p.key}', event)" title="Offered in Congregation">
            🕌 Jama'ah
          </button>
        </div>
      `;
    }).join("");

    const prayerScore = document.getElementById("prayers-score-badge");
    if (prayerScore) prayerScore.textContent = `${completedCount} / 5 Completed`;
  }

  // Taraweeh and Tahajjud Rak'ahs
  const taraweehCount = document.getElementById("taraweeh-rakahs");
  if (taraweehCount) taraweehCount.textContent = `${dayData.taraweeh || 0} Rak'ahs`;

  const tahajjudCount = document.getElementById("tahajjud-rakahs");
  if (tahajjudCount) tahajjudCount.textContent = `${dayData.tahajjud || 0} Rak'ahs`;

  // Quran Daily Inputs
  const quranPagesInput = document.getElementById("daily-quran-pages-input");
  if (quranPagesInput) quranPagesInput.value = dayData.quranPages || 0;

  // Spiritual Adhkar & Sadaqah
  const morningAdhkar = document.getElementById("chk-adhkar-morning");
  if (morningAdhkar) morningAdhkar.checked = !!dayData.adhkarMorning;

  const eveningAdhkar = document.getElementById("chk-adhkar-evening");
  if (eveningAdhkar) eveningAdhkar.checked = !!dayData.adhkarEvening;

  const sadaqahChk = document.getElementById("chk-sadaqah");
  if (sadaqahChk) sadaqahChk.checked = !!dayData.sadaqah;

  const sadaqahNote = document.getElementById("input-sadaqah-note");
  if (sadaqahNote) sadaqahNote.value = dayData.sadaqahNote || "";

  // Sunnah Challenge
  const challengeText = document.getElementById("daily-challenge-text");
  const challengeIndex = (activeDay - 1) % SUNNAH_CHALLENGES.length;
  if (challengeText) challengeText.textContent = SUNNAH_CHALLENGES[challengeIndex];

  const challengeBtn = document.getElementById("btn-complete-challenge");
  if (challengeBtn) {
    if (dayData.challengeCompleted) {
      challengeBtn.textContent = "✓ Challenge Completed!";
      challengeBtn.classList.add("completed");
    } else {
      challengeBtn.textContent = "Mark Challenge Completed ✨";
      challengeBtn.classList.remove("completed");
    }
  }

  // Reflection Note
  const reflectionArea = document.getElementById("daily-reflection-text");
  if (reflectionArea) reflectionArea.value = dayData.reflection || "";

  // Quick Sunnah Banner on Top
  const quickBannerText = document.getElementById("quick-sunnah-banner-text");
  if (quickBannerText) {
    quickBannerText.textContent = SUNNAH_CHALLENGES[challengeIndex];
  }

  // Header active streak badge
  const stats = state.computeStats();
  const streakBadge = document.getElementById("header-streak-badge");
  if (streakBadge) {
    streakBadge.innerHTML = `🔥 ${stats.fastedDays} Days Fasted`;
  }
}

// Interaction Handlers for Habits
window.togglePrayer = function(prayerKey) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  dayData.prayers[prayerKey] = !dayData.prayers[prayerKey];
  state.save();
  SoundSynth.playCheckChime();

  // If all 5 prayers checked, celebrate!
  const allChecked = Object.values(dayData.prayers).every(Boolean);
  if (allChecked) {
    fireCelebrationConfetti();
    showToast("Masha'Allah! All 5 Daily Prayers Completed!");
  }

  renderHabitsView();
  checkBadges();
};

window.toggleJamaah = function(prayerKey, event) {
  event.stopPropagation();
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  if (!dayData.prayersJamaah) dayData.prayersJamaah = {};
  dayData.prayersJamaah[prayerKey] = !dayData.prayersJamaah[prayerKey];
  state.save();
  SoundSynth.playCheckChime();
  renderHabitsView();
};

window.setFastingStatus = function(status) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  dayData.fastingStatus = status;
  state.save();
  SoundSynth.playCheckChime();
  if (status === "fasted") {
    showToast(`Ramadan Day ${activeDay} marked as Fasted! May Allah accept it.`);
  }
  renderHabitsView();
  renderCalendarTimetable();
  checkBadges();
};

window.adjustTaraweeh = function(delta) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  let current = dayData.taraweeh || 0;
  current = Math.max(0, Math.min(36, current + delta));
  dayData.taraweeh = current;
  state.save();
  SoundSynth.playCheckChime();
  renderHabitsView();
  checkBadges();
};

window.setTaraweehPreset = function(count) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  dayData.taraweeh = count;
  state.save();
  SoundSynth.playCheckChime();
  renderHabitsView();
  checkBadges();
};

window.adjustTahajjud = function(delta) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  let current = dayData.tahajjud || 0;
  current = Math.max(0, Math.min(20, current + delta));
  dayData.tahajjud = current;
  state.save();
  SoundSynth.playCheckChime();
  renderHabitsView();
  checkBadges();
};

window.toggleChallengeCompleted = function() {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  dayData.challengeCompleted = !dayData.challengeCompleted;
  state.save();

  if (dayData.challengeCompleted) {
    fireCelebrationConfetti();
    showToast("Alhamdulillah! Sunnah Challenge marked complete!");
  } else {
    SoundSynth.playCheckChime();
  }

  renderHabitsView();
  checkBadges();
};

window.saveDailyQuranPages = function(val) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  dayData.quranPages = Math.max(0, Number(val) || 0);
  state.save();
  renderHabitsView();
  renderQuranPlanner();
  checkBadges();
};

window.saveSadaqah = function() {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  const chk = document.getElementById("chk-sadaqah");
  const note = document.getElementById("input-sadaqah-note");

  dayData.sadaqah = chk ? chk.checked : false;
  dayData.sadaqahNote = note ? note.value : "";
  state.save();
  SoundSynth.playCheckChime();
  renderHabitsView();
  checkBadges();
};

window.saveAdhkar = function(type) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  if (type === "morning") {
    const chk = document.getElementById("chk-adhkar-morning");
    dayData.adhkarMorning = chk ? chk.checked : false;
  } else {
    const chk = document.getElementById("chk-adhkar-evening");
    dayData.adhkarEvening = chk ? chk.checked : false;
  }
  state.save();
  SoundSynth.playCheckChime();
  renderHabitsView();
};

window.saveReflection = function(text) {
  const activeDay = state.data.currentSelectedDay || 1;
  const dayData = state.getDayData(activeDay);

  dayData.reflection = text;
  state.save();
};

// Navigation Days
window.changeSelectedDay = function(direction) {
  let current = state.data.currentSelectedDay || 1;
  current += direction;
  if (current < 1) current = 1;
  if (current > 30) current = 30;

  state.data.currentSelectedDay = current;
  state.save();
  renderHabitsView();
};

window.jumpToToday = function() {
  const todayDay = state.calculateCurrentRamadanDay();
  state.data.currentSelectedDay = todayDay;
  state.save();
  renderHabitsView();
  showToast(`Jumped to Ramadan Day ${todayDay}`);
};

// ==========================================================================
// 9. 30-Day Ramadan Timetable & Calendar View
// ==========================================================================

function renderCalendarTimetable() {
  const tbody = document.getElementById("timetable-body");
  if (!tbody) return;

  const start = new Date(state.data.settings.ramadanStartDate);
  const currentRamadanDay = state.calculateCurrentRamadanDay();

  let rowsHtml = "";

  for (let dayNum = 1; dayNum <= 30; dayNum++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (dayNum - 1));

    const times = SolarCalc.calculateTimes(
      dayDate,
      state.data.settings.lat,
      state.data.settings.lng,
      state.data.settings.method,
      state.data.settings.offsetFajr,
      state.data.settings.offsetMaghrib
    );

    const isToday = dayNum === currentRamadanDay;
    const isOddNight = dayNum >= 21 && dayNum % 2 !== 0;
    const dayData = state.getDayData(dayNum);

    const durationHrs = Math.floor(times.fastingDurationMin / 60);
    const durationMins = times.fastingDurationMin % 60;
    const durationStr = `${durationHrs}h ${durationMins}m`;

    const formattedDate = dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Status badge text
    let statusBadge = "";
    if (dayData.fastingStatus === "fasted") {
      statusBadge = `<span class="status-badge-table fasted">✓ Fasted</span>`;
    } else if (dayData.fastingStatus === "excused") {
      statusBadge = `<span class="status-badge-table excused">Excused</span>`;
    } else if (dayData.fastingStatus === "missed") {
      statusBadge = `<span class="status-badge-table missed">Missed</span>`;
    } else {
      statusBadge = `<span class="status-badge-table upcoming">Upcoming</span>`;
    }

    rowsHtml += `
      <tr class="${isToday ? "row-today" : ""} ${isOddNight ? "row-odd-night" : ""}" onclick="selectDayFromTable(${dayNum})">
        <td>
          <div class="cell-day-col">
            <span>Day ${dayNum}</span>
            ${isOddNight ? '<span class="badge-laylat-mini" title="Odd Night of the Last 10">Qadr 🌟</span>' : ""}
            ${isToday ? '<span class="badge-laylat-mini" style="background:var(--gold-primary);color:#000;">TODAY</span>' : ""}
          </div>
        </td>
        <td>${formattedDate}</td>
        <td>${times.imsak.str}</td>
        <td style="color:var(--gold-light);font-weight:700;">${times.fajr.str}</td>
        <td>${times.sunrise.str}</td>
        <td>${times.dhuhr.str}</td>
        <td>${times.asr.str}</td>
        <td style="color:var(--emerald-light);font-weight:700;">${times.maghrib.str}</td>
        <td>${times.isha.str}</td>
        <td class="cell-fast-duration">${durationStr}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }

  tbody.innerHTML = rowsHtml;
}

window.selectDayFromTable = function(dayNum) {
  state.data.currentSelectedDay = dayNum;
  state.save();
  switchTab("habits");
  renderHabitsView();
  showToast(`Switched to Day ${dayNum} Tracker`);
};

// ==========================================================================
// 10. Quran Khatm Planner View
// ==========================================================================

function renderQuranPlanner() {
  const stats = state.computeStats();

  // Metrics
  const pagesTotalEl = document.getElementById("khatm-pages-total");
  const juzCountEl = document.getElementById("khatm-juz-count");
  const progressFill = document.getElementById("khatm-progress-fill");
  const progressPercent = document.getElementById("khatm-percent-label");
  const pacePagesEl = document.getElementById("khatm-pace-pages");
  const pacePerPrayerEl = document.getElementById("khatm-pace-prayer");

  const totalPagesRead = stats.totalQuranPages;
  const juzCompletedCount = stats.juzCompletedCount;

  // Percentage out of 604 pages (standard Madani Mushaf)
  const percentPages = Math.min(100, Math.round((totalPagesRead / 604) * 100));
  const percentJuz = Math.min(100, Math.round((juzCompletedCount / 30) * 100));
  const displayPercent = Math.max(percentPages, percentJuz);

  if (pagesTotalEl) pagesTotalEl.textContent = `${totalPagesRead} / 604`;
  if (juzCountEl) juzCountEl.textContent = `${juzCompletedCount} / 30`;
  if (progressPercent) progressPercent.textContent = `${displayPercent}%`;
  if (progressFill) progressFill.style.width = `${displayPercent}%`;

  // Daily target based on Khatm goal
  const goal = state.data.khatmGoal || 1;
  const pagesPerDay = goal * 20; // 1 Khatm = 20 pages/day; 2 Khatms = 40 pages/day
  const pagesPerPrayer = Math.ceil(pagesPerDay / 5);

  if (pacePagesEl) pacePagesEl.textContent = `${pagesPerDay} pages / day`;
  if (pacePerPrayerEl) pacePerPrayerEl.textContent = `${pagesPerPrayer} pages after each prayer`;

  // Highlight goal button
  const paceButtons = document.querySelectorAll(".btn-pace-choice");
  paceButtons.forEach(btn => {
    btn.classList.remove("active");
    if (Number(btn.dataset.goal) === goal) {
      btn.classList.add("active");
    }
  });

  // 30-Juz Interactive Grid
  const juzGrid = document.getElementById("juz-interactive-grid");
  if (!juzGrid) return;

  juzGrid.innerHTML = QURAN_JUZ_METADATA.map(item => {
    const isDone = !!state.data.juzCompleted[item.juz];
    return `
      <div class="juz-card ${isDone ? "completed" : ""}" onclick="toggleJuzCompleted(${item.juz})">
        <div class="juz-num-badge">${item.juz}</div>
        <div class="juz-surah-name">${item.name}</div>
        <div class="juz-pages-info">Pages ${item.pages}</div>
        <div class="juz-status-text">${isDone ? "✓ Completed" : "Mark Done"}</div>
      </div>
    `;
  }).join("");
}

window.setKhatmGoal = function(goal) {
  state.data.khatmGoal = Number(goal);
  state.save();
  SoundSynth.playCheckChime();
  renderQuranPlanner();
};

window.toggleJuzCompleted = function(juzNum) {
  if (!state.data.juzCompleted) state.data.juzCompleted = new Array(31).fill(false);
  state.data.juzCompleted[juzNum] = !state.data.juzCompleted[juzNum];

  state.save();

  if (state.data.juzCompleted[juzNum]) {
    fireCelebrationConfetti();
    showToast(`Masha'Allah! Juz ${juzNum} completed!`);
  } else {
    SoundSynth.playCheckChime();
  }

  renderQuranPlanner();
  checkBadges();
};

// ==========================================================================
// 11. Essential Du'as View & Audio Pronunciation
// ==========================================================================

let activeSpeechUtterance = null;

function renderDuasView() {
  const container = document.getElementById("duas-container-list");
  if (!container) return;

  container.innerHTML = DUAS_COLLECTION.map(dua => {
    return `
      <div class="dua-card" id="dua-card-${dua.id}">
        <div class="dua-card-top">
          <div class="dua-badge-title">
            <span>🤲</span>
            <span>${dua.title}</span>
          </div>
          <div class="dua-actions">
            <button class="btn-audio-play" onclick="playDuaAudio('${dua.id}', this)">
              <span class="icon">🔊</span>
              <span>Listen Pronunciation</span>
            </button>
            <button class="btn-icon" onclick="copyDuaText('${dua.id}')" title="Copy Du'a">
              📋
            </button>
          </div>
        </div>
        <div class="dua-arabic-text">${dua.arabic}</div>
        <div class="dua-translit-text">${dua.transliteration}</div>
        <div class="dua-english-text">${dua.english}</div>
        <div class="dua-reference-tag">
          <span>📖</span>
          <span>${dua.reference} • ${dua.timing}</span>
        </div>
      </div>
    `;
  }).join("");
}

window.playDuaAudio = function(duaId, buttonEl) {
  const dua = DUAS_COLLECTION.find(d => d.id === duaId);
  if (!dua) return;

  // Stop previous speech if any
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // Visual state
  const allBtns = document.querySelectorAll(".btn-audio-play");
  allBtns.forEach(b => {
    b.classList.remove("playing");
    b.querySelector("span:last-child").textContent = "Listen Pronunciation";
  });

  if (buttonEl.classList.contains("playing")) {
    buttonEl.classList.remove("playing");
    return;
  }

  buttonEl.classList.add("playing");
  buttonEl.querySelector("span:last-child").textContent = "Playing...";

  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(dua.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85; // Slower, clearer pronunciation for prayer
    utterance.pitch = 1.0;

    // Check if Arabic voices are available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith("ar"));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      buttonEl.classList.remove("playing");
      buttonEl.querySelector("span:last-child").textContent = "Listen Pronunciation";
    };

    utterance.onerror = () => {
      // Fallback melody chime
      SoundSynth.playSpiritualMelody();
      buttonEl.classList.remove("playing");
      buttonEl.querySelector("span:last-child").textContent = "Listen Pronunciation";
    };

    window.speechSynthesis.speak(utterance);
  } else {
    // Web Audio Synthesizer fallback
    SoundSynth.playSpiritualMelody();
    setTimeout(() => {
      buttonEl.classList.remove("playing");
      buttonEl.querySelector("span:last-child").textContent = "Listen Pronunciation";
    }, 2500);
  }
};

window.copyDuaText = function(duaId) {
  const dua = DUAS_COLLECTION.find(d => d.id === duaId);
  if (!dua) return;

  const textToCopy = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.english}"\n\n— ${dua.reference} (SawmMate Ramadan Companion)`;
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast("Du'a copied to clipboard! 📋");
  }).catch(() => {
    showToast("Could not copy automatically.");
  });
};

// ==========================================================================
// 12. Gamification, Badges & Achievements
// ==========================================================================

function checkBadges() {
  const stats = state.computeStats();
  let newlyUnlocked = false;

  BADGES_DEFINITIONS.forEach(b => {
    const isUnlocked = b.condition(stats);
    if (!state.data.badges) state.data.badges = {};

    if (isUnlocked && !state.data.badges[b.id]) {
      state.data.badges[b.id] = true;
      newlyUnlocked = true;
      showToast(`🏆 Badge Unlocked: ${b.name}!`);
    }
  });

  if (newlyUnlocked) {
    fireCelebrationConfetti();
  }

  renderBadgesView();
}

function renderBadgesView() {
  const stats = state.computeStats();

  // Metrics
  const fastsVal = document.getElementById("stat-total-fasts");
  const prayersVal = document.getElementById("stat-total-prayers");
  const taraweehVal = document.getElementById("stat-total-taraweeh");
  const sadaqahVal = document.getElementById("stat-total-sadaqah");

  if (fastsVal) fastsVal.textContent = `${stats.fastedDays} / 30`;
  if (prayersVal) prayersVal.textContent = `${stats.prayerTotal} / 150`;
  if (taraweehVal) taraweehVal.textContent = `${stats.taraweehDays} Nights`;
  if (sadaqahVal) sadaqahVal.textContent = `${stats.sadaqahDays} Days`;

  // Badges grid
  const grid = document.getElementById("badges-grid-container");
  if (!grid) return;

  grid.innerHTML = BADGES_DEFINITIONS.map(badge => {
    const isUnlocked = badge.condition(stats);
    return `
      <div class="badge-item-card ${isUnlocked ? "unlocked" : "locked"}">
        <div class="badge-emblem">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
        <div class="badge-state-tag">${isUnlocked ? "Unlocked ✨" : "Locked"}</div>
      </div>
    `;
  }).join("");
}

// ==========================================================================
// 13. Settings & Data Management Modals
// ==========================================================================

function openSettingsModal() {
  const modal = document.getElementById("settings-modal");
  if (!modal) return;

  // Populate values
  const citySelect = document.getElementById("settings-city-select");
  const methodSelect = document.getElementById("settings-method-select");
  const startInput = document.getElementById("settings-start-date");
  const offsetFajrInput = document.getElementById("settings-offset-fajr");
  const offsetMaghribInput = document.getElementById("settings-offset-maghrib");

  if (citySelect) citySelect.value = state.data.settings.city;
  if (methodSelect) methodSelect.value = state.data.settings.method;
  if (startInput) startInput.value = state.data.settings.ramadanStartDate;
  if (offsetFajrInput) offsetFajrInput.value = state.data.settings.offsetFajr || 0;
  if (offsetMaghribInput) offsetMaghribInput.value = state.data.settings.offsetMaghrib || 0;

  renderPresetCityPills();
  modal.classList.add("open");
}

function renderPresetCityPills() {
  const container = document.getElementById("preset-cities-pills");
  if (!container) return;

  container.innerHTML = PRESET_CITIES.map(c => {
    const isCurrent = c.name === state.data.settings.city;
    return `
      <button type="button" class="city-pill ${isCurrent ? "active" : ""}" onclick="selectPresetCity('${c.name}')">
        ${c.name}
      </button>
    `;
  }).join("");
}

window.selectPresetCity = function(cityName) {
  const city = PRESET_CITIES.find(c => c.name === cityName);
  if (!city) return;

  const citySelect = document.getElementById("settings-city-select");
  const methodSelect = document.getElementById("settings-method-select");

  if (citySelect) citySelect.value = city.name;
  if (methodSelect) methodSelect.value = city.method;

  renderPresetCityPills();
};

function saveSettingsFromModal() {
  const citySelect = document.getElementById("settings-city-select");
  const methodSelect = document.getElementById("settings-method-select");
  const startInput = document.getElementById("settings-start-date");
  const offsetFajrInput = document.getElementById("settings-offset-fajr");
  const offsetMaghribInput = document.getElementById("settings-offset-maghrib");

  const cityName = citySelect ? citySelect.value : "Makkah";
  const city = PRESET_CITIES.find(c => c.name === cityName) || PRESET_CITIES[0];

  state.data.settings.city = city.name;
  state.data.settings.country = city.country;
  state.data.settings.lat = city.lat;
  state.data.settings.lng = city.lng;
  state.data.settings.tz = city.tz !== undefined ? city.tz : (-new Date().getTimezoneOffset() / 60);
  state.data.settings.method = methodSelect ? methodSelect.value : city.method;
  state.data.settings.ramadanStartDate = startInput ? startInput.value : state.data.settings.ramadanStartDate;
  state.data.settings.offsetFajr = Number(offsetFajrInput ? offsetFajrInput.value : 0);
  state.data.settings.offsetMaghrib = Number(offsetMaghribInput ? offsetMaghribInput.value : 0);

  state.save();
  closeModal("settings-modal");
  updateHeaderLocationBadge();
  updateLiveCountdown();
  renderHabitsView();
  renderCalendarTimetable();
  showToast("Settings saved successfully! Timetables updated.");
}

function updateHeaderLocationBadge() {
  const badge = document.getElementById("header-location-badge");
  if (badge) {
    badge.innerHTML = `📍 ${state.data.settings.city} (${state.data.settings.method})`;
  }
}

// Data Export & Import Modal
function openBackupModal() {
  const modal = document.getElementById("backup-modal");
  if (!modal) return;
  modal.classList.add("open");
}

function downloadDataJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.data, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sawmmate_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Backup JSON file downloaded!");
}

function importDataJson() {
  const textarea = document.getElementById("backup-import-textarea");
  if (!textarea || !textarea.value.trim()) {
    showToast("Please paste valid JSON backup data.");
    return;
  }

  try {
    const parsed = JSON.parse(textarea.value.trim());
    if (parsed.settings && parsed.days) {
      state.data = parsed;
      state.save();
      closeModal("backup-modal");
      refreshEntireApp();
      showToast("Data successfully restored from backup! Alhamdulillah.");
    } else {
      showToast("Invalid SawmMate JSON structure.");
    }
  } catch (e) {
    showToast("Failed to parse JSON. Please check formatting.");
  }
}

function resetAllData() {
  if (confirm("Are you sure you want to reset all tracked habits and calendar times? This cannot be undone.")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
}

// ==========================================================================
// 14. Navigation & App Lifecycle
// ==========================================================================

function switchTab(tabKey) {
  // Update Nav buttons
  const navTabs = document.querySelectorAll(".nav-tab");
  navTabs.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.tab === tabKey) btn.classList.add("active");
  });

  // Switch View
  const views = document.querySelectorAll(".tab-view");
  views.forEach(view => {
    view.classList.remove("active");
  });

  const activeView = document.getElementById(`view-${tabKey}`);
  if (activeView) activeView.classList.add("active");

  // Re-render corresponding view content
  if (tabKey === "habits") renderHabitsView();
  if (tabKey === "calendar") renderCalendarTimetable();
  if (tabKey === "quran") renderQuranPlanner();
  if (tabKey === "duas") renderDuasView();
  if (tabKey === "badges") renderBadgesView();
}

function toggleSound() {
  SoundSynth.enabled = !SoundSynth.enabled;
  state.data.settings.soundEnabled = SoundSynth.enabled;
  state.save();

  const soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.classList.toggle("active", SoundSynth.enabled);
    soundBtn.innerHTML = SoundSynth.enabled ? "🔔" : "🔕";
    showToast(SoundSynth.enabled ? "Sound effects enabled 🔔" : "Sound effects muted 🔕");
  }
}

function printTimetable() {
  switchTab("calendar");
  setTimeout(() => window.print(), 250);
}

function refreshEntireApp() {
  updateHeaderLocationBadge();
  updateLiveCountdown();
  renderHabitsView();
  renderCalendarTimetable();
  renderQuranPlanner();
  renderDuasView();
  renderBadgesView();
}

// Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initStarfield();

  // Populate city choices in settings modal
  const citySelect = document.getElementById("settings-city-select");
  if (citySelect) {
    citySelect.innerHTML = PRESET_CITIES.map(c => `
      <option value="${c.name}">${c.name}, ${c.country}</option>
    `).join("");
  }

  // Populate calculation methods
  const methodSelect = document.getElementById("settings-method-select");
  if (methodSelect) {
    methodSelect.innerHTML = Object.keys(CALC_METHODS).map(k => `
      <option value="${k}">${CALC_METHODS[k].name}</option>
    `).join("");
  }

  // Sync sound button
  SoundSynth.enabled = state.data.settings.soundEnabled !== false;
  const soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.classList.toggle("active", SoundSynth.enabled);
    soundBtn.innerHTML = SoundSynth.enabled ? "🔔" : "🔕";
  }

  // Bind top nav tabs
  const navTabs = document.querySelectorAll(".nav-tab");
  navTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Initial rendering
  refreshEntireApp();

  // Start live tick interval (1 second)
  setInterval(updateLiveCountdown, 1000);
  updateLiveCountdown();

  // Setup click-outside modal close
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.remove("open");
    }
  });

  console.log("🌙 SawmMate Ramadan Companion Loaded Successfully.");
});
