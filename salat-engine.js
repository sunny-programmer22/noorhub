/**
 * SalatNow - Minimalist Prayer Times & Qibla Compass
 * Complete Client-Side Application Logic
 * Features:
 * - High-precision offline astronomical prayer calculation engine
 * - Aladhan REST API integration with graceful automatic offline fallback
 * - Real-time countdown timer & active prayer progress bar
 * - 2D Interactive Qibla Compass using forward azimuth spherical trigonometry
 * - Mobile DeviceOrientation sensor support with real-time geomagnetic orientation
 * - Web Audio API synthesized Adhan & spiritual prayer chime
 * - Browser Web Notifications API integration
 * - Monthly prayer calendar schedule generator & CSV exporter
 * - Dynamic Hijri & Gregorian date synchronization
 */

// ==========================================
// 1. CONSTANTS & DEFAULT CONFIGURATION
// ==========================================

const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
  altitude: 304 // meters
};

// Global City Presets for Quick Selection & Autocomplete
const POPULAR_CITIES = [
  { name: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, tz: 'Asia/Riyadh' },
  { name: 'Madinah', country: 'Saudi Arabia', lat: 24.4672, lng: 39.6111, tz: 'Asia/Riyadh' },
  { name: 'Jerusalem', country: 'Palestine', lat: 31.7683, lng: 35.2137, tz: 'Asia/Jerusalem' },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo' },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul' },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto' },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, tz: 'Asia/Jakarta' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi' },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, tz: 'Asia/Dhaka' },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, tz: 'Europe/Berlin' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Rabat', country: 'Morocco', lat: 34.0209, lng: -6.8416, tz: 'Africa/Casablanca' },
  { name: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.5310, tz: 'Asia/Qatar' }
];

// Calculation Method Configurations (Fajr Angle, Isha Angle / Minutes)
const CALCULATION_METHODS = {
  1: { id: 1, name: 'University of Islamic Sciences, Karachi', fajr: 18.0, isha: 18.0, ishaMinutes: null },
  2: { id: 2, name: 'Islamic Society of North America (ISNA)', fajr: 15.0, isha: 15.0, ishaMinutes: null },
  3: { id: 3, name: 'Muslim World League (MWL)', fajr: 18.0, isha: 17.0, ishaMinutes: null },
  4: { id: 4, name: 'Umm al-Qura University, Makkah', fajr: 18.5, isha: null, ishaMinutes: 90 },
  5: { id: 5, name: 'Egyptian General Authority of Survey', fajr: 19.5, isha: 17.5, ishaMinutes: null },
  7: { id: 7, name: 'Institute of Geophysics, University of Tehran', fajr: 17.7, isha: 14.0, ishaMinutes: null },
  8: { id: 8, name: 'Gulf Region', fajr: 19.5, isha: null, ishaMinutes: 90 },
  11: { id: 11, name: 'Majlis Ugama Islam Singapura (MUIS)', fajr: 20.0, isha: 18.0, ishaMinutes: null },
  13: { id: 13, name: 'Diyanet İşleri Başkanlığı (Turkey)', fajr: 18.0, isha: 17.0, ishaMinutes: null }
};

// Application State
const state = {
  location: {
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    tz: 'Europe/London',
    isCustom: false
  },
  timings: null,
  rawTimings: null,
  qibla: {
    bearing: 118.99,
    distanceKm: 4788,
    cardinal: 'ESE'
  },
  settings: {
    method: 2, // ISNA default
    school: 0, // 0 = Standard (Shafi/Maliki/Hanbali), 1 = Hanafi
    timeFormat24: false,
    soundEnabled: true,
    soundType: 'synth-chime', // 'synth-chime', 'traditional-adhan', 'makkah-adhan'
    volume: 0.8,
    highLatitudeRule: 'night-middle', // 'night-middle', 'one-seventh', 'angle-based'
    notificationsEnabled: false
  },
  compass: {
    deviceHeading: 0,
    calibrated: false,
    sensorActive: false,
    manualOffset: 0,
    isAligned: false
  },
  dataSource: 'live', // 'live' or 'offline-engine'
  activePrayerKey: null,
  nextPrayerKey: null,
  activeTab: 'prayers',
  notifiedPrayers: new Set()
};

// ==========================================
// 2. HIGH ACCURACY ASTRONOMICAL CALCULATOR
// ==========================================

class AstronomicalPrayerCalculator {
  static degToRad(deg) {
    return (deg * Math.PI) / 180.0;
  }

  static radToDeg(rad) {
    return (rad * 180.0) / Math.PI;
  }

  static fixAngle(a) {
    a = a - 360.0 * Math.floor(a / 360.0);
    return a < 0 ? a + 360.0 : a;
  }

  static fixHour(b) {
    b = b - 24.0 * Math.floor(b / 24.0);
    return b < 0 ? b + 24.0 : b;
  }

  static getJulianDate(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  }

  static getSunPosition(julianDate) {
    const d = julianDate - 2451545.0;
    const t = d / 36525.0;

    const meanLon = this.fixAngle(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
    const meanAnomaly = this.fixAngle(357.52911 + 35999.05029 * t - 0.0001537 * t * t);

    // Equation of Center
    const mRad = this.degToRad(meanAnomaly);
    const center = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mRad)
                 + (0.019993 - 0.000101 * t) * Math.sin(2 * mRad)
                 + 0.000289 * Math.sin(3 * mRad);

    const trueLon = this.fixAngle(meanLon + center);
    const obliquity = 23.439291 - 0.0130042 * t;

    // Declination
    const sinDec = Math.sin(this.degToRad(obliquity)) * Math.sin(this.degToRad(trueLon));
    const declination = this.radToDeg(Math.asin(sinDec));

    // Equation of Time (EoT in minutes)
    const y = Math.pow(Math.tan(this.degToRad(obliquity / 2)), 2);
    const e = 0.016708634 - 0.000042037 * t;
    const eot = 4 * this.radToDeg(
      y * Math.sin(2 * this.degToRad(meanLon))
      - 2 * e * Math.sin(mRad)
      + 4 * e * y * Math.sin(mRad) * Math.cos(2 * this.degToRad(meanLon))
      - 0.5 * y * y * Math.sin(4 * this.degToRad(meanLon))
      - 1.25 * e * e * Math.sin(2 * mRad)
    );

    return { declination, equationOfTime: eot };
  }

  static getHourAngle(zenithAngle, latitude, declination) {
    const latRad = this.degToRad(latitude);
    const decRad = this.degToRad(declination);
    const zRad = this.degToRad(zenithAngle);

    const cosH = (Math.cos(zRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1.0 || cosH < -1.0) {
      return null; // Sun never reaches this angle at this latitude (midnight sun or polar night)
    }
    return this.radToDeg(Math.acos(cosH)) / 15.0; // returns hours
  }

  static getTimezoneOffset(timeZone, date = new Date()) {
    try {
      if (!timeZone) return -date.getTimezoneOffset() / 60.0;
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
      return (tzDate.getTime() - utcDate.getTime()) / 3600000.0;
    } catch (e) {
      return -date.getTimezoneOffset() / 60.0;
    }
  }

  /**
   * Calculate prayer times for a specified date, coordinates, method, and school
   */
  static calculate(date, latitude, longitude, methodId = 2, school = 0, highLatRule = 'night-middle', timeZone = null) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Local timezone offset in hours (including DST)
    let tzOffset;
    if (typeof timeZone === 'number') {
      tzOffset = timeZone;
    } else if (timeZone) {
      tzOffset = this.getTimezoneOffset(timeZone, date);
    } else {
      tzOffset = -date.getTimezoneOffset() / 60.0;
    }

    const jd = this.getJulianDate(year, month, day);
    const sun = this.getSunPosition(jd);

    // Solar Transit (Dhuhr)
    // Add 1 minute safety buffer after true solar noon
    const solarNoon = 12.0 + tzOffset - (longitude / 15.0) - (sun.equationOfTime / 60.0);
    const dhuhr = solarNoon + (2.0 / 60.0);

    // Sunrise and Sunset (zenith 90.833° to account for 34' refraction + 16' solar radius)
    const hSun = this.getHourAngle(90.8333, latitude, sun.declination);
    let sunrise = hSun !== null ? solarNoon - hSun : null;
    let sunset = hSun !== null ? solarNoon + hSun : null;
    let maghrib = sunset;

    // Asr calculation
    // Shadow factor: 1 for Shafi/Maliki/Hanbali, 2 for Hanafi
    const shadowFactor = school === 1 ? 2.0 : 1.0;
    const latRad = this.degToRad(latitude);
    const decRad = this.degToRad(sun.declination);
    const diff = Math.abs(latRad - decRad);
    const arccot = Math.atan(1.0 / (shadowFactor + Math.tan(diff)));
    const asrZenith = 90.0 - this.radToDeg(arccot);
    const hAsr = this.getHourAngle(asrZenith, latitude, sun.declination);
    const asr = hAsr !== null ? solarNoon + hAsr : null;

    // Fajr and Isha angles based on method
    const config = CALCULATION_METHODS[methodId] || CALCULATION_METHODS[2];
    const fajrZenith = 90.0 + (config.fajr || 15.0);
    let hFajr = this.getHourAngle(fajrZenith, latitude, sun.declination);
    let fajr = hFajr !== null ? solarNoon - hFajr : null;

    let isha;
    if (config.ishaMinutes) {
      // e.g. Umm al-Qura fixed 90 min after Maghrib
      isha = maghrib !== null ? maghrib + (config.ishaMinutes / 60.0) : null;
    } else {
      const ishaZenith = 90.0 + (config.isha || 15.0);
      let hIsha = this.getHourAngle(ishaZenith, latitude, sun.declination);
      isha = hIsha !== null ? solarNoon + hIsha : null;
    }

    // High Latitude Adjustments if Fajr/Isha are undefined (polar summer/winter)
    if (sunrise !== null && sunset !== null) {
      const nightDuration = 24.0 - (sunset - sunrise);
      if (fajr === null || fajr > sunrise) {
        if (highLatRule === 'one-seventh') {
          fajr = sunrise - (nightDuration / 7.0);
        } else if (highLatRule === 'angle-based') {
          fajr = sunrise - (nightDuration * ((config.fajr || 15.0) / 60.0));
        } else {
          // night-middle
          fajr = sunrise - (nightDuration / 2.0);
        }
      }
      if (isha === null || isha < sunset) {
        if (highLatRule === 'one-seventh') {
          isha = sunset + (nightDuration / 7.0);
        } else if (highLatRule === 'angle-based') {
          isha = sunset + (nightDuration * ((config.isha || 15.0) / 60.0));
        } else {
          // night-middle
          isha = sunset + (nightDuration / 2.0);
        }
      }
    }

    // Midnight (halfway between Sunset and next Fajr)
    let midnight = null;
    let lastThird = null;
    if (sunset !== null && fajr !== null) {
      const nextFajr = fajr + 24.0;
      const nightSpan = nextFajr - sunset;
      midnight = this.fixHour(sunset + nightSpan / 2.0);
      lastThird = this.fixHour(sunset + (nightSpan * 2.0 / 3.0));
    }

    return {
      Fajr: this.formatTimeDecimal(fajr),
      Sunrise: this.formatTimeDecimal(sunrise),
      Dhuhr: this.formatTimeDecimal(dhuhr),
      Asr: this.formatTimeDecimal(asr),
      Sunset: this.formatTimeDecimal(sunset),
      Maghrib: this.formatTimeDecimal(maghrib),
      Isha: this.formatTimeDecimal(isha),
      Midnight: this.formatTimeDecimal(midnight),
      Lastthird: this.formatTimeDecimal(lastThird)
    };
  }

  static formatTimeDecimal(decimalHours) {
    if (decimalHours === null || isNaN(decimalHours)) return '--:--';
    decimalHours = this.fixHour(decimalHours);
    let hours = Math.floor(decimalHours);
    let minutes = Math.round((decimalHours - hours) * 60);
    if (minutes === 60) {
      hours = (hours + 1) % 24;
      minutes = 0;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}

// ==========================================
// 3. QIBLA SPHERICAL TRIGONOMETRY ENGINE
// ==========================================

class QiblaCalculator {
  /**
   * Forward Azimuth formula on a spherical earth
   * Formula:
   * Δλ = λ_kaaba - λ_user
   * y = sin(Δλ)
   * x = cos(φ_user)*tan(φ_kaaba) - sin(φ_user)*cos(Δλ)
   * bearing = atan2(y, x) converted to [0, 360)
   */
  static calculateBearing(userLat, userLng) {
    const phi1 = (userLat * Math.PI) / 180.0;
    const phi2 = (KAABA_COORDS.latitude * Math.PI) / 180.0;
    const deltaLambda = ((KAABA_COORDS.longitude - userLng) * Math.PI) / 180.0;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

    let bearing = (Math.atan2(y, x) * 180.0) / Math.PI;
    bearing = (bearing + 360.0) % 360.0;
    return parseFloat(bearing.toFixed(2));
  }

  /**
   * Haversine formula for great circle distance in kilometers
   */
  static calculateDistance(userLat, userLng) {
    const R = 6371.0; // Earth radius in km
    const dLat = ((KAABA_COORDS.latitude - userLat) * Math.PI) / 180.0;
    const dLon = ((KAABA_COORDS.longitude - userLng) * Math.PI) / 180.0;
    const lat1 = (userLat * Math.PI) / 180.0;
    const lat2 = (KAABA_COORDS.latitude * Math.PI) / 180.0;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  static getCardinal(bearing) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  }
}

// ==========================================
// 4. WEB AUDIO API SYNTHESIZER
// ==========================================

class SpiritualAudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.htmlAudio = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Synthesize a soothing Islamic chime / harmonic call
   * Uses harmonic series (Frequencies based on Bayati maqam motif: D4, F4, G4, A4, D5)
   */
  playMelodicChime(volume = 0.8) {
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.7, now);
    masterGain.connect(this.audioCtx.destination);

    // Chime notes: D4 (293.66Hz), F4 (349.23Hz), A4 (440.00Hz), D5 (587.33Hz)
    const notes = [
      { freq: 293.66, time: 0.0, dur: 1.8 },
      { freq: 349.23, time: 0.45, dur: 1.6 },
      { freq: 440.00, time: 0.9, dur: 2.2 },
      { freq: 587.33, time: 1.4, dur: 3.5 }
    ];

    notes.forEach(note => {
      const osc = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now + note.time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      // Warm octave overtone
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(note.freq * 2, now + note.time);

      noteGain.gain.setValueAtTime(0.001, now + note.time);
      noteGain.gain.exponentialRampToValueAtTime(0.4, now + note.time + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + note.time);
      osc2.start(now + note.time);
      osc.stop(now + note.time + note.dur + 0.1);
      osc2.stop(now + note.time + note.dur + 0.1);
    });
  }

  /**
   * Gentle compass alignment click / ding
   */
  playAlignClick() {
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.09);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Play full adhan or preview sound based on settings
   */
  playAdhanSound(soundType, volume = 0.8) {
    if (soundType === 'synth-chime') {
      this.playMelodicChime(volume);
      return;
    }

    // If external audio is selected, attempt to play with graceful fallback to synth
    const audioUrl = soundType === 'traditional-adhan' 
      ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
      : 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

    try {
      if (this.htmlAudio) {
        this.htmlAudio.pause();
      }
      this.htmlAudio = new Audio(audioUrl);
      this.htmlAudio.volume = volume;
      this.htmlAudio.play().catch(err => {
        console.warn('HTML5 Audio play prevented or network error, falling back to Web Audio synth:', err);
        this.playMelodicChime(volume);
      });
    } catch (e) {
      this.playMelodicChime(volume);
    }
  }

  stopAll() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
    }
  }
}

const audioSynth = new SpiritualAudioSynthesizer();

// ==========================================
// 5. DATA FETCHING & SYNCHRONIZATION
// ==========================================

async function fetchPrayerTimes() {
  showLoadingSpinner(true);
  const { latitude, longitude } = state.location;
  const { method, school } = state.settings;

  // Update Qibla math immediately
  updateQiblaState();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;

  try {
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (json.code === 200 && json.data && json.data.timings) {
      state.rawTimings = json.data.timings;
      state.timings = cleanTimings(json.data.timings);
      state.dataSource = 'live';

      // Update Hijri date from API
      if (json.data.date && json.data.date.hijri) {
        renderHijriDate(json.data.date.hijri);
      }
      updateStatusBadge('live');
      renderPrayerCards();
      generateMonthlyCalendar();
      showLoadingSpinner(false);
      return;
    }
    throw new Error('Invalid JSON format');
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Aladhan API unavailable, switching to high-accuracy offline astronomical engine:', err);
    useAstronomicalFallback();
  }
}

function useAstronomicalFallback() {
  const { latitude, longitude, tz } = state.location;
  const { method, school, highLatitudeRule } = state.settings;
  const now = new Date();

  const offlineTimings = AstronomicalPrayerCalculator.calculate(
    now,
    latitude,
    longitude,
    method,
    school,
    highLatitudeRule,
    tz
  );

  state.rawTimings = offlineTimings;
  state.timings = offlineTimings;
  state.dataSource = 'offline-engine';

  renderNativeHijriDate(now);
  updateStatusBadge('offline');
  renderPrayerCards();
  generateMonthlyCalendar();
  showLoadingSpinner(false);
}

function cleanTimings(apiTimings) {
  const result = {};
  for (const [key, value] of Object.entries(apiTimings)) {
    // Trim extra timezone strings like "(BST)"
    result[key] = value.split(' ')[0];
  }
  return result;
}

function updateQiblaState() {
  const { latitude, longitude } = state.location;
  const bearing = QiblaCalculator.calculateBearing(latitude, longitude);
  const distance = QiblaCalculator.calculateDistance(latitude, longitude);
  const cardinal = QiblaCalculator.getCardinal(bearing);

  state.qibla = { bearing, distanceKm: distance, cardinal };

  // Update DOM elements for Qibla
  const qiblaDegEl = document.getElementById('qibla-bearing-deg');
  const qiblaCardEl = document.getElementById('qibla-cardinal');
  const qiblaDistEl = document.getElementById('qibla-distance');
  const needleEl = document.getElementById('qibla-needle');

  if (qiblaDegEl) qiblaDegEl.textContent = `${bearing.toFixed(1)}°`;
  if (qiblaCardEl) qiblaCardEl.textContent = cardinal;
  if (qiblaDistEl) qiblaDistEl.textContent = `${distance.toLocaleString()} km`;

  // Update needle base orientation
  updateCompassRotation();
}

// ==========================================
// 6. REAL-TIME COUNTDOWN & PROGRESS BAR LOOP
// ==========================================

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function startTickLoop() {
  setInterval(() => {
    updateClock();
    updatePrayerCountdown();
  }, 1000);

  updateClock();
  updatePrayerCountdown();
}

function updateClock() {
  const now = new Date();
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-gregorian-date');

  if (clockEl) {
    const hours = state.settings.timeFormat24 ? now.getHours() : (now.getHours() % 12 || 12);
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ampm = state.settings.timeFormat24 ? '' : (now.getHours() >= 12 ? ' PM' : ' AM');
    clockEl.textContent = `${String(hours).padStart(2, '0')}:${mins}:${secs}${ampm}`;
  }

  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString(undefined, options);
  }
}

function parseTimeToDate(timeStr, baseDate = new Date()) {
  if (!timeStr || timeStr === '--:--') return null;
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function updatePrayerCountdown() {
  if (!state.timings) return;

  const now = new Date();
  const prayerTimesToday = [];

  for (const key of PRAYER_KEYS) {
    if (state.timings[key]) {
      const pDate = parseTimeToDate(state.timings[key], now);
      prayerTimesToday.push({ key, date: pDate });
    }
  }

  if (prayerTimesToday.length === 0) return;

  // Determine current active prayer window & next upcoming prayer
  let currentPrayer = null;
  let nextPrayer = null;

  // Fajr date tomorrow for wrapping Isha -> Fajr
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fajrTomorrowDate = parseTimeToDate(state.timings['Fajr'], tomorrow);

  // Yesterday date for wrapping before Fajr today
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const ishaYesterdayDate = parseTimeToDate(state.timings['Isha'], yesterday);

  for (let i = 0; i < prayerTimesToday.length; i++) {
    const cur = prayerTimesToday[i];
    const nxt = (i < prayerTimesToday.length - 1) 
      ? prayerTimesToday[i + 1] 
      : { key: 'Fajr', date: fajrTomorrowDate };

    if (now >= cur.date && now < nxt.date) {
      currentPrayer = cur;
      nextPrayer = nxt;
      break;
    }
  }

  // If before today's Fajr
  if (!currentPrayer && now < prayerTimesToday[0].date) {
    currentPrayer = { key: 'Isha', date: ishaYesterdayDate };
    nextPrayer = prayerTimesToday[0];
  }

  state.activePrayerKey = currentPrayer ? currentPrayer.key : null;
  state.nextPrayerKey = nextPrayer ? nextPrayer.key : null;

  // Check and trigger prayer time alert if exact minute matches
  checkPrayerAlerts(now);

  // Update Hero Section Countdown & Progress Bar
  renderHeroCountdown(currentPrayer, nextPrayer, now);
  highlightActivePrayerCard(state.activePrayerKey);
}

function renderHeroCountdown(currentPrayer, nextPrayer, now) {
  const heroNextNameEl = document.getElementById('hero-next-prayer-name');
  const heroNextArabicEl = document.getElementById('hero-next-prayer-arabic');
  const heroCountdownEl = document.getElementById('hero-countdown-digits');
  const heroCurrentNameEl = document.getElementById('hero-current-prayer-name');
  const heroProgressBarEl = document.getElementById('hero-progress-bar');
  const heroProgressPercentEl = document.getElementById('hero-progress-percent');
  const heroStartTimeEl = document.getElementById('hero-window-start');
  const heroEndTimeEl = document.getElementById('hero-window-end');

  if (!nextPrayer || !currentPrayer) return;

  const prayerNamesArabic = {
    Fajr: 'الفَجْر',
    Sunrise: 'الشُّرُوق',
    Dhuhr: 'الظُّهْر',
    Asr: 'العَصْر',
    Maghrib: 'المَغْرِب',
    Isha: 'العِشَاء'
  };

  if (heroNextNameEl) heroNextNameEl.textContent = nextPrayer.key;
  if (heroNextArabicEl) heroNextArabicEl.textContent = prayerNamesArabic[nextPrayer.key] || '';
  if (heroCurrentNameEl) heroCurrentNameEl.textContent = currentPrayer.key;

  // Countdown math
  const diffMs = nextPrayer.date.getTime() - now.getTime();
  const totalSecs = Math.max(0, Math.floor(diffMs / 1000));

  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  if (heroCountdownEl) {
    heroCountdownEl.textContent = `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
  }

  // Progress Bar percentage
  const totalWindowMs = nextPrayer.date.getTime() - currentPrayer.date.getTime();
  const elapsedWindowMs = now.getTime() - currentPrayer.date.getTime();
  const percent = Math.min(100, Math.max(0, (elapsedWindowMs / totalWindowMs) * 100));

  if (heroProgressBarEl) {
    heroProgressBarEl.style.width = `${percent.toFixed(1)}%`;
  }
  if (heroProgressPercentEl) {
    heroProgressPercentEl.textContent = `${Math.round(percent)}% elapsed`;
  }

  if (heroStartTimeEl) {
    heroStartTimeEl.textContent = formatDisplayTime(format24ToFormatted(currentPrayer.date));
  }
  if (heroEndTimeEl) {
    heroEndTimeEl.textContent = formatDisplayTime(format24ToFormatted(nextPrayer.date));
  }
}

function format24ToFormatted(dateObj) {
  const h = String(dateObj.getHours()).padStart(2, '0');
  const m = String(dateObj.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function checkPrayerAlerts(now) {
  if (!state.settings.soundEnabled && !state.settings.notificationsEnabled) return;
  if (!state.timings) return;

  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const todayKey = `${now.toISOString().slice(0, 10)}`;

  for (const pKey of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const timeStr = state.timings[pKey];
    if (timeStr === currentHHMM) {
      const alertId = `${todayKey}-${pKey}`;
      if (!state.notifiedPrayers.has(alertId)) {
        state.notifiedPrayers.add(alertId);
        triggerPrayerAlert(pKey);
      }
    }
  }
}

function triggerPrayerAlert(prayerName) {
  // 1. Play Sound
  if (state.settings.soundEnabled) {
    audioSynth.playAdhanSound(state.settings.soundType, state.settings.volume);
  }

  // 2. Trigger Web Notification
  if (state.settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
    const title = `🕌 Time for ${prayerName} Prayer`;
    const body = `It is now time for ${prayerName} prayer in ${state.location.name}. Hayya 'alas-Salah!`;
    new Notification(title, {
      body,
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"%3E%3Cpath d="M12 2L2 22h20L12 2z"/%3E%3C/svg%3E',
      tag: `salatnow-${prayerName}`
    });
  }

  // 3. Show Toast inside application
  showToast(`🕌 It is now time for ${prayerName} prayer!`);
}

// ==========================================
// 7. COMPASS & DEVICE SENSOR LOGIC
// ==========================================

function initCompass() {
  const dialEl = document.getElementById('compass-dial-svg');
  const sliderEl = document.getElementById('compass-heading-slider');
  const enableSensorBtn = document.getElementById('enable-compass-sensor-btn');
  const dialContainer = document.getElementById('compass-container');

  if (sliderEl) {
    sliderEl.addEventListener('input', (e) => {
      state.compass.deviceHeading = parseFloat(e.target.value);
      updateCompassRotation();
    });
  }

  if (enableSensorBtn) {
    enableSensorBtn.addEventListener('click', () => {
      requestDeviceOrientationPermission();
    });
  }

  // Mouse & Touch Dragging interaction for testing/desktop
  let isDragging = false;
  let startAngle = 0;
  let currentRotation = 0;

  function getAngleFromCenter(e, rect) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    return (rad * 180 / Math.PI + 90 + 360) % 360;
  }

  if (dialContainer) {
    dialContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = dialContainer.getBoundingClientRect();
      startAngle = getAngleFromCenter(e, rect) - state.compass.deviceHeading;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = dialContainer.getBoundingClientRect();
      const angle = getAngleFromCenter(e, rect);
      state.compass.deviceHeading = (angle - startAngle + 360) % 360;
      if (sliderEl) sliderEl.value = Math.round(state.compass.deviceHeading);
      updateCompassRotation();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for dragging dial
    dialContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      const rect = dialContainer.getBoundingClientRect();
      startAngle = getAngleFromCenter(e, rect) - state.compass.deviceHeading;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const rect = dialContainer.getBoundingClientRect();
      const angle = getAngleFromCenter(e, rect);
      state.compass.deviceHeading = (angle - startAngle + 360) % 360;
      if (sliderEl) sliderEl.value = Math.round(state.compass.deviceHeading);
      updateCompassRotation();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Check if device orientation is supported automatically
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    startListeningToOrientation();
  }
}

function requestDeviceOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          startListeningToOrientation();
          showToast('Compass sensor activated!');
        } else {
          showToast('Orientation permission denied. Use slider/drag to rotate.');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Sensor permission error.');
      });
  } else {
    startListeningToOrientation();
    showToast('Compass sensor enabled!');
  }
}

function startListeningToOrientation() {
  window.addEventListener('deviceorientation', handleOrientationEvent, true);
  state.compass.sensorActive = true;
  const statusBadge = document.getElementById('compass-sensor-badge');
  if (statusBadge) {
    statusBadge.textContent = 'Sensor: Active (Move Phone)';
    statusBadge.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30';
  }
}

function handleOrientationEvent(event) {
  let heading = null;

  // iOS webkitCompassHeading provides true North heading
  if (typeof event.webkitCompassHeading !== 'undefined') {
    heading = event.webkitCompassHeading;
  } else if (event.alpha !== null) {
    // Android device orientation alpha
    heading = (360 - event.alpha) % 360;
  }

  if (heading !== null) {
    state.compass.deviceHeading = heading;
    const sliderEl = document.getElementById('compass-heading-slider');
    if (sliderEl) sliderEl.value = Math.round(heading);
    updateCompassRotation();
  }
}

function updateCompassRotation() {
  const dialEl = document.getElementById('compass-dial-svg');
  const needleEl = document.getElementById('qibla-needle');
  const currentHeadingEl = document.getElementById('current-heading-val');
  const alignedBadge = document.getElementById('qibla-aligned-banner');
  const dialContainer = document.getElementById('compass-container');

  const heading = state.compass.deviceHeading;
  const qiblaBearing = state.qibla.bearing;

  if (currentHeadingEl) {
    currentHeadingEl.textContent = `${Math.round(heading)}°`;
  }

  // Rotate the dial opposite to heading so North aligns correctly with phone top
  if (dialEl) {
    dialEl.style.transform = `rotate(${-heading}deg)`;
  }

  // The Qibla needle points to (qiblaBearing - heading)
  const relativeQiblaAngle = (qiblaBearing - heading + 360) % 360;
  if (needleEl) {
    needleEl.style.transform = `rotate(${relativeQiblaAngle}deg)`;
  }

  // Check alignment within ±3 degrees
  const angleDiff = Math.min(relativeQiblaAngle, 360 - relativeQiblaAngle);
  const isAligned = angleDiff <= 3.0;

  if (isAligned && !state.compass.isAligned) {
    // User just aligned!
    state.compass.isAligned = true;
    if (dialContainer) dialContainer.classList.add('compass-aligned');
    if (alignedBadge) alignedBadge.classList.remove('hidden');

    // Haptic feedback if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
    audioSynth.playAlignClick();
  } else if (!isAligned && state.compass.isAligned) {
    state.compass.isAligned = false;
    if (dialContainer) dialContainer.classList.remove('compass-aligned');
    if (alignedBadge) alignedBadge.classList.add('hidden');
  }
}

// ==========================================
// 8. UI RENDERING & COMPONENT BUILDERS
// ==========================================

const PRAYER_METADATA = {
  Fajr: { name: 'Fajr', arabic: 'الفَجْر', icon: 'fa-cloud-sun', desc: 'Dawn / Pre-sunrise prayer' },
  Sunrise: { name: 'Sunrise', arabic: 'الشُّرُوق', icon: 'fa-sun', desc: 'Solar sunrise (prohibited to pray)' },
  Dhuhr: { name: 'Dhuhr', arabic: 'الظُّهْر', icon: 'fa-sun-plant-wilt', desc: 'Midday solar noon prayer' },
  Asr: { name: 'Asr', arabic: 'العَصْر', icon: 'fa-cloud-sun', desc: 'Late afternoon prayer' },
  Maghrib: { name: 'Maghrib', arabic: 'المَغْرِب', icon: 'fa-mountain-sun', desc: 'Sunset prayer' },
  Isha: { name: 'Isha', arabic: 'العِشَاء', icon: 'fa-moon', desc: 'Night prayer' }
};

function renderPrayerCards() {
  const container = document.getElementById('prayer-cards-grid');
  if (!container || !state.timings) return;

  container.innerHTML = '';

  for (const key of PRAYER_KEYS) {
    const meta = PRAYER_METADATA[key];
    const rawTime = state.timings[key] || '--:--';
    const displayTime = formatDisplayTime(rawTime);
    const isActive = state.activePrayerKey === key;

    const card = document.createElement('div');
    card.id = `prayer-card-${key}`;
    card.className = `glass-card rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
      isActive ? 'active-prayer-card' : 'hover:border-emerald-500/40'
    }`;

    card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }">
            <i class="fa-solid ${meta.icon} text-lg"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              ${meta.name}
              ${isActive ? '<span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 pulse-emerald">Active</span>' : ''}
            </h3>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-arabic text-sm">${meta.arabic}</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="playPrayerAudioPreview('${key}')" title="Preview Adhan Sound" class="p-2 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 transition">
            <i class="fa-solid fa-volume-high text-sm"></i>
          </button>
        </div>
      </div>
      <div class="mt-2 flex items-baseline justify-between">
        <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          ${displayTime}
        </span>
        <span class="text-xs text-slate-400 dark:text-slate-500">
          ${meta.desc}
        </span>
      </div>
    `;

    container.appendChild(card);
  }

  // Render secondary times (Midnight & Last Third)
  const midnightEl = document.getElementById('stat-midnight-time');
  const lastThirdEl = document.getElementById('stat-last-third-time');

  if (midnightEl && state.timings.Midnight) {
    midnightEl.textContent = formatDisplayTime(state.timings.Midnight);
  }
  if (lastThirdEl && state.timings.Lastthird) {
    lastThirdEl.textContent = formatDisplayTime(state.timings.Lastthird);
  }
}

function highlightActivePrayerCard(activeKey) {
  for (const key of PRAYER_KEYS) {
    const card = document.getElementById(`prayer-card-${key}`);
    if (!card) continue;
    if (key === activeKey) {
      if (!card.classList.contains('active-prayer-card')) {
        card.classList.add('active-prayer-card');
      }
    } else {
      card.classList.remove('active-prayer-card');
    }
  }
}

function formatDisplayTime(timeStr) {
  if (!timeStr || timeStr === '--:--') return '--:--';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;

  if (state.settings.timeFormat24) {
    return `${String(h).padStart(2, '0')}:${m}`;
  }

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function renderHijriDate(hijriObj) {
  const hijriEl = document.getElementById('live-hijri-date');
  if (!hijriEl || !hijriObj) return;

  const day = hijriObj.day;
  const monthName = hijriObj.month.en;
  const year = hijriObj.year;
  const monthArabic = hijriObj.month.ar || '';

  hijriEl.innerHTML = `
    <span>${day} ${monthName} ${year} AH</span>
    <span class="font-arabic text-sm text-emerald-600 dark:text-emerald-400">(${monthArabic})</span>
  `;
}

function renderNativeHijriDate(dateObj) {
  const hijriEl = document.getElementById('live-hijri-date');
  if (!hijriEl) return;

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formatted = formatter.format(dateObj);
    hijriEl.innerHTML = `<span>${formatted}</span>`;
  } catch (e) {
    hijriEl.textContent = 'Islamic Calendar (Umm al-Qura)';
  }
}

function updateStatusBadge(source) {
  const badgeEl = document.getElementById('data-source-status-badge');
  if (!badgeEl) return;

  if (source === 'live') {
    badgeEl.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="text-slate-600 dark:text-slate-300">Live Aladhan API</span>
    `;
    badgeEl.title = 'Timings fetched from Aladhan Cloud API';
  } else {
    badgeEl.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
      <span class="text-slate-600 dark:text-slate-300">Offline Astro Engine</span>
    `;
    badgeEl.title = 'High accuracy celestial calculation running locally';
  }
}

function showLoadingSpinner(show) {
  const spinner = document.getElementById('global-loading-indicator');
  if (spinner) {
    spinner.style.opacity = show ? '1' : '0';
    spinner.style.pointerEvents = show ? 'all' : 'none';
  }
}

// ==========================================
// 9. MONTHLY SCHEDULE GENERATOR
// ==========================================

function generateMonthlyCalendar() {
  const tableBody = document.getElementById('monthly-schedule-body');
  const monthTitle = document.getElementById('monthly-schedule-month-title');
  if (!tableBody) return;

  tableBody.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  if (monthTitle) {
    monthTitle.textContent = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateIter = new Date(year, month, day);
    const timings = AstronomicalPrayerCalculator.calculate(
      dateIter,
      state.location.latitude,
      state.location.longitude,
      state.settings.method,
      state.settings.school,
      state.settings.highLatitudeRule,
      state.location.tz
    );

    const isToday = day === todayDate;
    const row = document.createElement('tr');
    row.className = isToday 
      ? 'bg-emerald-500/10 font-bold border-l-4 border-emerald-500 dark:text-emerald-300' 
      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/60';

    row.innerHTML = `
      <td class="py-2.5 px-3 whitespace-nowrap text-xs sm:text-sm">
        ${day} ${dateIter.toLocaleDateString(undefined, { weekday: 'short' })}
        ${isToday ? '<span class="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">Today</span>' : ''}
      </td>
      <td class="py-2.5 px-3 text-xs sm:text-sm font-mono">${formatDisplayTime(timings.Fajr)}</td>
      <td class="py-2.5 px-3 text-xs sm:text-sm font-mono text-slate-400">${formatDisplayTime(timings.Sunrise)}</td>
      <td class="py-2.5 px-3 text-xs sm:text-sm font-mono">${formatDisplayTime(timings.Dhuhr)}</td>
      <td class="py-2.5 px-3 text-xs sm:text-sm font-mono">${formatDisplayTime(timings.Asr)}</td>
      <td class="py-2.5 px-3 text-xs sm:text-sm font-mono">${formatDisplayTime(timings.Maghrib)}</td>
      <td class="py-2.5 px-3 text-xs sm:text-sm font-mono">${formatDisplayTime(timings.Isha)}</td>
    `;

    tableBody.appendChild(row);
  }
}

function exportMonthlyCSV() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let csv = 'Date,Day,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha\n';

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const timings = AstronomicalPrayerCalculator.calculate(
      d,
      state.location.latitude,
      state.location.longitude,
      state.settings.method,
      state.settings.school,
      state.settings.highLatitudeRule,
      state.location.tz
    );
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    csv += `${year}-${month + 1}-${day},${dayName},${timings.Fajr},${timings.Sunrise},${timings.Dhuhr},${timings.Asr},${timings.Maghrib},${timings.Isha}\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SalatNow-Prayer-Times-${state.location.name}-${year}-${month + 1}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// 10. LOCATION & CITY SEARCH
// ==========================================

function initLocationControls() {
  const detectBtn = document.getElementById('btn-detect-gps');
  const searchInput = document.getElementById('city-search-input');
  const searchDropdown = document.getElementById('city-search-dropdown');
  const currentLocationLabel = document.getElementById('current-city-label');

  if (detectBtn) {
    detectBtn.addEventListener('click', detectUserGPS);
  }

  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.classList.add('hidden');
        return;
      }

      const matches = POPULAR_CITIES.filter(c => 
        c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      );

      searchDropdown.innerHTML = '';
      if (matches.length > 0) {
        matches.slice(0, 6).forEach(city => {
          const item = document.createElement('div');
          item.className = 'px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm';
          item.innerHTML = `
            <div>
              <span class="font-bold text-slate-800 dark:text-slate-100">${city.name}</span>,
              <span class="text-xs text-slate-400">${city.country}</span>
            </div>
            <span class="text-[10px] text-emerald-500 font-mono">${city.lat.toFixed(2)}°, ${city.lng.toFixed(2)}°</span>
          `;
          item.addEventListener('click', () => {
            selectCity(city);
            searchInput.value = '';
            searchDropdown.classList.add('hidden');
          });
          searchDropdown.appendChild(item);
        });
        searchDropdown.classList.remove('hidden');
      } else {
        // Offer custom search query
        const customItem = document.createElement('div');
        customItem.className = 'px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-emerald-600 dark:text-emerald-400';
        customItem.innerHTML = `<i class="fa-solid fa-magnifying-glass mr-2"></i> Search online for "${e.target.value}"`;
        customItem.addEventListener('click', () => {
          searchOnlineGeocode(e.target.value);
          searchDropdown.classList.add('hidden');
        });
        searchDropdown.appendChild(customItem);
        searchDropdown.classList.remove('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.add('hidden');
      }
    });
  }

  // Populate popular city quick pills
  renderCityPills();
}

function renderCityPills() {
  const container = document.getElementById('popular-cities-pills');
  if (!container) return;

  const quickPillCities = [
    { name: 'Makkah', country: 'Saudi Arabia', emoji: '🕋' },
    { name: 'Madinah', country: 'Saudi Arabia', emoji: '🕌' },
    { name: 'Jerusalem', country: 'Palestine', emoji: '🇵🇸' },
    { name: 'Cairo', country: 'Egypt', emoji: '🇪🇬' },
    { name: 'Istanbul', country: 'Turkey', emoji: '🇹🇷' },
    { name: 'London', country: 'United Kingdom', emoji: '🇬🇧' },
    { name: 'New York', country: 'United States', emoji: '🇺🇸' },
    { name: 'Jakarta', country: 'Indonesia', emoji: '🇮🇩' },
    { name: 'Karachi', country: 'Pakistan', emoji: '🇵🇰' }
  ];

  container.innerHTML = '';
  quickPillCities.forEach(item => {
    const fullCity = POPULAR_CITIES.find(c => c.name === item.name);
    if (!fullCity) return;

    const btn = document.createElement('button');
    btn.className = `px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
      state.location.name === item.name 
        ? 'bg-emerald-500 text-white shadow-sm' 
        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;
    btn.innerHTML = `<span>${item.emoji}</span><span>${item.name}</span>`;
    btn.addEventListener('click', () => {
      selectCity(fullCity);
    });
    container.appendChild(btn);
  });
}

function selectCity(city) {
  state.location.name = city.name;
  state.location.country = city.country;
  state.location.latitude = city.lat;
  state.location.longitude = city.lng;
  state.location.tz = city.tz || null;
  state.location.isCustom = false;

  saveStateToStorage();
  updateLocationUI();
  fetchPrayerTimes();
  renderCityPills();
}

function detectUserGPS() {
  if (!('geolocation' in navigator)) {
    showToast('Geolocation is not supported by your browser.');
    return;
  }

  showToast('Detecting current GPS coordinates...');
  const detectBtn = document.getElementById('btn-detect-gps');
  if (detectBtn) detectBtn.classList.add('animate-spin');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      if (detectBtn) detectBtn.classList.remove('animate-spin');
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      state.location.latitude = lat;
      state.location.longitude = lng;
      state.location.name = 'Current Location';
      state.location.country = `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      state.location.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
      state.location.isCustom = true;

      // Reverse geocode via OpenStreetMap Nominatim
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.state || 'My Location';
            const country = data.address.country || '';
            state.location.name = city;
            state.location.country = country;
          }
        }
      } catch (e) {
        console.warn('Reverse geocoding error:', e);
      }

      saveStateToStorage();
      updateLocationUI();
      fetchPrayerTimes();
      showToast(`📍 Location detected: ${state.location.name}`);
    },
    (err) => {
      if (detectBtn) detectBtn.classList.remove('animate-spin');
      console.warn('Geolocation error:', err);
      showToast('Location permission denied or unavailable. Please choose from city list.');
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

async function searchOnlineGeocode(query) {
  showLoadingSpinner(true);
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        const parts = first.display_name.split(',');
        const cityName = parts[0];
        const countryName = parts[parts.length - 1];

        selectCity({
          name: cityName.trim(),
          country: countryName.trim(),
          lat: parseFloat(first.lat),
          lng: parseFloat(first.lon)
        });
        showToast(`Found: ${cityName}`);
        showLoadingSpinner(false);
        return;
      }
    }
    showToast('City not found. Please try another search term.');
  } catch (e) {
    showToast('Search request failed. Check internet connection.');
  }
  showLoadingSpinner(false);
}

function updateLocationUI() {
  const currentCityLabel = document.getElementById('current-city-label');
  const currentCountryLabel = document.getElementById('current-country-label');
  const coordDisplay = document.getElementById('current-coords-display');

  if (currentCityLabel) currentCityLabel.textContent = state.location.name;
  if (currentCountryLabel) currentCountryLabel.textContent = state.location.country;
  if (coordDisplay) {
    coordDisplay.textContent = `${state.location.latitude.toFixed(3)}°N, ${state.location.longitude.toFixed(3)}°E`;
  }
}

// ==========================================
// 11. AUDIO PREVIEWS & SETTINGS MODAL
// ==========================================

function playPrayerAudioPreview(prayerKey) {
  showToast(`Playing Adhan chime preview for ${prayerKey}...`);
  audioSynth.playAdhanSound(state.settings.soundType, state.settings.volume);
}

function initSettings() {
  const modal = document.getElementById('settings-modal');
  const openBtn = document.getElementById('open-settings-btn');
  const closeBtn = document.getElementById('close-settings-btn');
  const methodSelect = document.getElementById('setting-method');
  const schoolSelect = document.getElementById('setting-school');
  const formatToggle = document.getElementById('setting-timeformat');
  const soundToggle = document.getElementById('setting-sound-enabled');
  const soundTypeSelect = document.getElementById('setting-sound-type');
  const volumeSlider = document.getElementById('setting-volume');
  const notifToggle = document.getElementById('setting-notif-enabled');
  const testSoundBtn = document.getElementById('btn-test-sound');
  const darkToggleBtn = document.getElementById('theme-toggle-btn');

  // Load saved values
  loadStateFromStorage();

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  if (methodSelect) {
    methodSelect.value = state.settings.method;
    methodSelect.addEventListener('change', (e) => {
      state.settings.method = parseInt(e.target.value, 10);
      saveStateToStorage();
      fetchPrayerTimes();
    });
  }

  if (schoolSelect) {
    schoolSelect.value = state.settings.school;
    schoolSelect.addEventListener('change', (e) => {
      state.settings.school = parseInt(e.target.value, 10);
      saveStateToStorage();
      fetchPrayerTimes();
    });
  }

  if (formatToggle) {
    formatToggle.checked = state.settings.timeFormat24;
    formatToggle.addEventListener('change', (e) => {
      state.settings.timeFormat24 = e.target.checked;
      saveStateToStorage();
      renderPrayerCards();
      generateMonthlyCalendar();
    });
  }

  if (soundToggle) {
    soundToggle.checked = state.settings.soundEnabled;
    soundToggle.addEventListener('change', (e) => {
      state.settings.soundEnabled = e.target.checked;
      saveStateToStorage();
    });
  }

  if (soundTypeSelect) {
    soundTypeSelect.value = state.settings.soundType;
    soundTypeSelect.addEventListener('change', (e) => {
      state.settings.soundType = e.target.value;
      saveStateToStorage();
    });
  }

  if (volumeSlider) {
    volumeSlider.value = state.settings.volume * 100;
    volumeSlider.addEventListener('input', (e) => {
      state.settings.volume = parseInt(e.target.value, 10) / 100;
      saveStateToStorage();
    });
  }

  if (testSoundBtn) {
    testSoundBtn.addEventListener('click', () => {
      audioSynth.playAdhanSound(state.settings.soundType, state.settings.volume);
      showToast('Testing Adhan sound audio...');
    });
  }

  if (notifToggle) {
    notifToggle.checked = state.settings.notificationsEnabled;
    notifToggle.addEventListener('change', async (e) => {
      if (e.target.checked) {
        if ('Notification' in window) {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            state.settings.notificationsEnabled = true;
            showToast('Prayer notifications enabled!');
          } else {
            e.target.checked = false;
            state.settings.notificationsEnabled = false;
            showToast('Browser notification permission was denied.');
          }
        } else {
          e.target.checked = false;
          showToast('Notifications not supported by this browser.');
        }
      } else {
        state.settings.notificationsEnabled = false;
      }
      saveStateToStorage();
    });
  }

  if (darkToggleBtn) {
    darkToggleBtn.addEventListener('click', toggleTheme);
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('noorhub_theme') || localStorage.getItem('salatnow_theme');

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('salatnow_theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-toggle-icon');
  if (!icon) return;
  const isDark = document.documentElement.classList.contains('dark');
  icon.className = isDark ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-slate-600';
}

function initTabs() {
  const tabs = document.querySelectorAll('[data-tab-target]');
  const contents = document.querySelectorAll('.tab-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab-target');
      state.activeTab = target;

      tabs.forEach(t => {
        t.classList.remove('active-tab', 'text-emerald-600', 'dark:text-emerald-400', 'border-emerald-500');
        t.classList.add('text-slate-500', 'dark:text-slate-400', 'border-transparent');
      });

      tab.classList.add('active-tab', 'text-emerald-600', 'dark:text-emerald-400', 'border-emerald-500');
      tab.classList.remove('text-slate-500', 'dark:text-slate-400', 'border-transparent');

      contents.forEach(c => {
        if (c.id === `tab-panel-${target}`) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });

      // Special action on tab switch
      if (target === 'qibla') {
        updateCompassRotation();
      } else if (target === 'schedule') {
        generateMonthlyCalendar();
      }
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('notification-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

function saveStateToStorage() {
  try {
    localStorage.setItem('salatnow_location', JSON.stringify(state.location));
    localStorage.setItem('salatnow_settings', JSON.stringify(state.settings));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function loadStateFromStorage() {
  try {
    const savedLoc = localStorage.getItem('salatnow_location');
    if (savedLoc) {
      state.location = JSON.parse(savedLoc);
    }
    const savedSettings = localStorage.getItem('salatnow_settings');
    if (savedSettings) {
      state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
}

// ==========================================
// 12. INITIALIZATION ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadStateFromStorage();
  updateLocationUI();
  initLocationControls();
  initSettings();
  initTabs();
  initCompass();
  startTickLoop();

  // Initial fetch
  fetchPrayerTimes();

  // Export CSV button listener
  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportMonthlyCSV);
  }

  // Refresh timings button
  const refreshBtn = document.getElementById('btn-refresh-timings');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      showToast('Refreshing prayer times...');
      fetchPrayerTimes();
    });
  }
});
