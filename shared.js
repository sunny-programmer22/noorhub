/**
 * NoorHub - Shared Global Utilities
 * Theme switching, Location management, Sound/Audio, and Navigation
 */

// Popular global cities presets
const NOORHUB_CITIES = [
  { name: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, tz: 'Asia/Riyadh' },
  { name: 'Madinah', country: 'Saudi Arabia', lat: 24.4672, lng: 39.6111, tz: 'Asia/Riyadh' },
  { name: 'Jerusalem', country: 'Palestine', lat: 31.7683, lng: 35.2137, tz: 'Asia/Jerusalem' },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo' },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul' },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, tz: 'Asia/Dhaka' },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, tz: 'Asia/Jakarta' },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, tz: 'Europe/Berlin' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' }
];

class NoorHubCore {
  constructor() {
    this.city = this.loadCity();
    this.theme = localStorage.getItem('noorhub_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.initTheme();
    this.initMobileNav();
    this.initHeaderElements();
  }

  initHeaderElements() {
    document.addEventListener('DOMContentLoaded', () => {
      const clockEl = document.getElementById('header-clock');
      if (clockEl) {
        const updateClock = () => {
          clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
        };
        setInterval(updateClock, 1000);
        updateClock();
      }

      const hijriEl = document.getElementById('header-hijri-date');
      if (hijriEl) {
        try {
          const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          hijriEl.textContent = hijriFormatter.format(new Date()) + ' AH';
        } catch (e) {
          hijriEl.textContent = '1448 AH';
        }
      }

      const cityLabel = document.getElementById('current-city-label');
      if (cityLabel && this.city) {
        cityLabel.textContent = this.city.name;
      }
    });
  }

  loadCity() {
    try {
      const saved = localStorage.getItem('noorhub_location');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default to Makkah
    return NOORHUB_CITIES[0];
  }

  saveCity(cityObj) {
    this.city = cityObj;
    localStorage.setItem('noorhub_location', JSON.stringify(cityObj));
    window.dispatchEvent(new CustomEvent('noorhub-location-changed', { detail: cityObj }));
  }

  initTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('noorhub_theme', this.theme);
    this.initTheme();
    return this.theme;
  }

  initMobileNav() {
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('mobile-nav-menu');
      if (btn && menu) {
        btn.addEventListener('click', () => {
          menu.classList.toggle('hidden');
        });
      }

      const themeBtns = document.querySelectorAll('.theme-toggle-btn');
      themeBtns.forEach(b => {
        b.addEventListener('click', () => {
          this.toggleTheme();
        });
      });
    });
  }

  requestGPSLocation(callback) {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const cityObj = {
          name: 'Current Location',
          country: 'GPS Detected',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isGPS: true
        };
        this.saveCity(cityObj);
        if (callback) callback(cityObj);
      },
      (err) => {
        console.warn('GPS location access denied or error:', err.message);
        alert('Could not retrieve your GPS location. Please choose a city from the list.');
      },
      { timeout: 10000 }
    );
  }
}

window.NoorHub = new NoorHubCore();
