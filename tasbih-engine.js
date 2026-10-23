/**
 * ZikrPulse - Digital Tasbih & Morning/Evening Adhkar (Hisn al-Muslim)
 * Main Application Logic & Web Audio Synthesizer
 */

// ==========================================================================
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// ==========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.preset = 'bead'; // 'bead' | 'droplet' | 'click' | 'chime' | 'mute'
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setPreset(preset) {
    this.preset = preset;
  }

  toggleSound(forceState) {
    this.enabled = typeof forceState === 'boolean' ? forceState : !this.enabled;
    return this.enabled;
  }

  // Play normal count click
  playClick() {
    if (!this.enabled || this.preset === 'mute') return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (this.preset) {
      case 'bead':
        this.playWoodBead(now);
        break;
      case 'droplet':
        this.playWaterDrop(now);
        break;
      case 'click':
        this.playTactileClick(now);
        break;
      case 'chime':
        this.playSoftChime(now);
        break;
      default:
        this.playWoodBead(now);
    }
  }

  // Olive Wood Bead acoustic click sound
  playWoodBead(now) {
    // Resonant impulse
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Wood body resonance frequency sweep
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);

    // Subtle filtered snap for texture
    const bufferSize = this.ctx.sampleRate * 0.02;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.025);
  }

  // Droplet pitch sweep
  playWaterDrop(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.06);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  }

  // Crisp mechanical click
  playTactileClick(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.015);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  // Soft bell chime
  playSoftChime(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Celebratory Target Harmonious Chime
  playCelebration() {
    if (!this.enabled || this.preset === 'mute') return;
    this.init();
    if (!this.ctx) return;

    // Harmonic pentatonic arpeggio: C5, E5, G5, C6 (Solfeggio harmony)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const baseTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = baseTime + idx * 0.09;
      const duration = 0.45;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }
}

// ==========================================================================
// 2. HAPTIC VIBRATION HELPER
// ==========================================================================
const Haptics = {
  enabled: true,

  toggle(forceState) {
    this.enabled = typeof forceState === 'boolean' ? forceState : !this.enabled;
    return this.enabled;
  },

  tick() {
    if (!this.enabled || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate(18);
    } catch (e) {
      // Ignore security policy or non-supported issues
    }
  },

  celebrate() {
    if (!this.enabled || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate([40, 50, 60, 50, 100]);
    } catch (e) {
      // Ignore
    }
  }
};

// ==========================================================================
// 3. AUTHENTIC MORNING & EVENING ADHKAR DATA (HISN AL-MUSLIM)
// ==========================================================================
const ADHKAR_DATA = {
  morning: [
    {
      id: 'm1',
      category: 'Quranic Shield',
      title: 'Ayat al-Kursi (The Throne Verse)',
      arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      transliteration: "Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm, lā ta'khudhuhū sinatuw-wa lā nawm, lahū mā fis-samāwāti wa mā fil-arḍ, man dhal-ladhī yashfa'u 'indahū illā bi-idhnih, ya'lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay'im-min 'ilmihī illā bi-mā shā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa Huwal-'Aliyyul-'Aẓīm.",
      translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
      reference: 'Surah Al-Baqarah (2:255) | Authenticated by Al-Hakim (1/562)',
      virtue: 'Whoever recites this when he wakes in the morning will be shielded from jinns until the evening.',
      targetCount: 1
    },
    {
      id: 'm2',
      category: 'Daily Surahs',
      title: 'Al-Mu’awwidhat (Surah Al-Ikhlas, Al-Falaq, An-Nas)',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ\n(ثم سورة الفلق وسورة الناس)',
      transliteration: "Qul Huwallāhu Aḥad... Qul a'ūdhu bi-Rabbil-Falaq... Qul a'ūdhu bi-Rabbin-Nās.",
      translation: "Recite Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas completely three times each in the morning.",
      reference: 'Abu Dawood (5082), At-Tirmidhi (3575)',
      virtue: 'The Prophet ﷺ said: "Recite them three times in the morning and evening, and they will suffice you against everything."',
      targetCount: 3
    },
    {
      id: 'm3',
      category: 'Master Forgiveness',
      title: 'Sayyid al-Istighfar (The Master of Supplications)',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      transliteration: "Allāhumma Anta Rabbī lā ilāha illā Anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastaṭa'tu, a'ūdhu bika min sharri mā ṣana'tu, abū'u laka bi-ni'matika 'alayya, wa abū'u bi-dhanbī faghfir lī fa-innahū lā yaghfirudh-dhunūba illā Anta.",
      translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, and I uphold Your covenant and promise as much as I am able. I seek refuge in You from the evil I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.",
      reference: 'Sahih al-Bukhari (6306)',
      virtue: 'Whoever recites it in the morning with conviction and dies that day before evening will be of the people of Paradise.',
      targetCount: 1
    },
    {
      id: 'm4',
      category: 'Morning Entrance',
      title: 'Asbahna wa Asbahal Mulku Lillah',
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      transliteration: "Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa 'alā kulli shay'in Qadīr. Rabbi as'aluka khayra mā fī hādhal-yawmi wa khayra mā ba'dah, wa a'ūdhu bika min sharri mā fī hādhal-yawmi wa sharri mā ba'dah, Rabbi a'ūdhu bika minal-kasali wa sū'il-kibar, Rabbi a'ūdhu bika min 'adhābin fin-nāri wa 'adhābin fil-qabr.",
      translation: "We have reached the morning and the dominion belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone, without partner...",
      reference: 'Sahih Muslim (2723)',
      virtue: 'Affirms absolute reliance on Allah, seeking good of the day, protection from laziness, hardships of old age, and the torment of fire and grave.',
      targetCount: 1
    },
    {
      id: 'm5',
      category: 'Comprehensive Shield',
      title: 'Bismillahilladhi la yadurru',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: "Bismillāhilladhī lā yaḍurru ma'asmihī shay'un fil-arḍi wa lā fis-samā'i wa Huwas-Samī'ul-'Alīm.",
      translation: "In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
      reference: 'Abu Dawood (5088), At-Tirmidhi (3388)',
      virtue: 'Whoever recites it three times in the morning will not be afflicted by any calamity or harm until the evening.',
      targetCount: 3
    },
    {
      id: 'm6',
      category: 'Gratitude & Contentment',
      title: 'Raditu Billahi Rabba',
      arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
      transliteration: "Raḍītu billāhi Rabbā, wa bil-Islāmi dīnā, wa bi-Muḥammadin ṣallallāhu 'alayhi wa sallama Nabiyyā.",
      translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.",
      reference: 'Abu Dawood (5072), Ahmad (18967)',
      virtue: 'Allah has taken upon Himself to please whoever recites this three times in the morning on the Day of Resurrection.',
      targetCount: 3
    },
    {
      id: 'm7',
      category: 'Supplication for Well-Being',
      title: "Du'a for Health & Freedom from Debt & Kufr",
      arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلٰهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلٰهَ إِلَّا أَنْتَ',
      transliteration: "Allāhumma 'āfinī fī badanī, Allāhumma 'āfinī fī sam'ī, Allāhumma 'āfinī fī baṣarī, lā ilāha illā Anta. Allāhumma innī a'ūdhu bika minal-kufri wal-faqr, wa a'ūdhu bika min 'adhābil-qabr, lā ilāha illā Anta.",
      translation: "O Allah, grant soundness to my body; O Allah, grant soundness to my hearing; O Allah, grant soundness to my sight. There is no deity except You...",
      reference: 'Abu Dawood (5090), Ahmad (20430)',
      virtue: 'Supplication for holistic preservation of physical faculties and protection against poverty and the torment of the grave.',
      targetCount: 3
    },
    {
      id: 'm8',
      category: 'Divine Sufficiency',
      title: 'Hasbiyallahu la ilaha illa Huwa',
      arabic: 'حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      transliteration: "Ḥasbiyallāhu lā ilāha illā Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Aẓīm.",
      translation: "Allah is sufficient for me; there is no deity except Him. Upon Him I have relied, and He is the Lord of the Great Throne.",
      reference: 'Abu Dawood (5081)',
      virtue: 'Whoever recites it 7 times in the morning and evening, Allah will suffice him for whatever concerns him in this life and the Hereafter.',
      targetCount: 7
    },
    {
      id: 'm9',
      category: 'Reliance & Vitality',
      title: 'Ya Hayyu Ya Qayyum',
      arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ',
      transliteration: "Yā Ḥayyu yā Qayyūm, bi-raḥmatika astaghīth, aṣliḥ lī sha'nī kullah, wa lā takilnī ilā nafsī ṭarfata 'ayn.",
      translation: "O Ever-Living, O Sustainer, by Your mercy I seek assistance; rectify for me all of my affairs and do not leave me to myself even for the blink of an eye.",
      reference: 'Al-Hakim (1/545), Sahih at-Targhib (661)',
      virtue: 'A powerful sunnah supplication ensuring divine guidance and protection against self-reliance and despair.',
      targetCount: 1
    },
    {
      id: 'm10',
      category: 'Supreme Weight',
      title: "Dhikr of Juwayriyyah (Immense Reward)",
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
      transliteration: "Subḥān Allāhi wa bi-ḥamdih, 'adada khalqih, wa riḍā nafsih, wa zinata 'arshih, wa midāda kalimātih.",
      translation: "Glory be to Allah and His is the praise, according to the number of His creation, according to the satisfaction of His self, according to the weight of His Throne, and according to the ink of His words.",
      reference: 'Sahih Muslim (2726)',
      virtue: 'The Prophet ﷺ stated that reciting this three times outweighs hours of continuous remembrance done since Fajr.',
      targetCount: 3
    },
    {
      id: 'm11',
      category: 'Sin Eraser',
      title: 'SubhanAllahi wa bihamdihi (100x)',
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      transliteration: "Subḥān Allāhi wa bi-ḥamdih.",
      translation: "Glory be to Allah and His is the praise.",
      reference: 'Sahih al-Bukhari (6405), Sahih Muslim (2692)',
      virtue: 'Whoever recites this one hundred times a day, his sins will be wiped away even if they were like the foam of the sea.',
      targetCount: 100
    },
    {
      id: 'm12',
      category: 'Tawheed Fortress',
      title: 'La ilaha illallah wahdahu la shareeka lah',
      arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: "Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa 'alā kulli shay'in Qadīr.",
      translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs all dominion and praise, and He is over all things capable.",
      reference: 'Sahih al-Bukhari (3293), Sahih Muslim (2691)',
      virtue: 'Whoever recites it 10 or 100 times will have the reward of freeing ten slaves, 100 good deeds written, 100 sins erased, and a shield against Satan all day.',
      targetCount: 10
    }
  ],

  evening: [
    {
      id: 'e1',
      category: 'Quranic Shield',
      title: 'Ayat al-Kursi (The Throne Verse)',
      arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      transliteration: "Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm, lā ta'khudhuhū sinatuw-wa lā nawm, lahū mā fis-samāwāti wa mā fil-arḍ, man dhal-ladhī yashfa'u 'indahū illā bi-idhnih...",
      translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep...",
      reference: 'Surah Al-Baqarah (2:255) | Authenticated by Al-Hakim (1/562)',
      virtue: 'Whoever recites this when evening arrives will be protected from jinns and harm until the morning.',
      targetCount: 1
    },
    {
      id: 'e2',
      category: 'Night Sufficiency',
      title: 'Last Two Verses of Surat al-Baqarah',
      arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      transliteration: "Āmanar-Rasūlu bi-mā unzila ilayhi mir-Rabbihī wal-mu'minūn, kullun āmana billāhi wa malā'ikatihī wa kutubihī wa rusulih... Rabbanā lā tu'ākhidhnā in nasīnā aw akhṭa'nā...",
      translation: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers... Our Lord, do not impose blame upon us if we have forgotten or erred...",
      reference: 'Sahih al-Bukhari (5009), Sahih Muslim (808)',
      virtue: 'The Prophet ﷺ said: "Whoever recites the last two verses of Surat al-Baqarah at night, they will suffice him (from all evil)."',
      targetCount: 1
    },
    {
      id: 'e3',
      category: 'Daily Surahs',
      title: 'Al-Mu’awwidhat (Surah Al-Ikhlas, Al-Falaq, An-Nas)',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ\n(تقرأ ثلاث مرات في المساء)',
      transliteration: "Surat Al-Ikhlāṣ, Al-Falaq, and An-Nās (3 times each).",
      translation: "Say: He is Allah, [who is] One... Say: I seek refuge in the Lord of daybreak... Say: I seek refuge in the Lord of mankind...",
      reference: 'Abu Dawood (5082), At-Tirmidhi (3575)',
      virtue: 'Reciting them three times at night suffices against all harm, sorcery, and envy.',
      targetCount: 3
    },
    {
      id: 'e4',
      category: 'Master Forgiveness',
      title: 'Sayyid al-Istighfar',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      transliteration: "Allāhumma Anta Rabbī lā ilāha illā Anta, khalaqtanī wa anā 'abduka, wa anā 'alā 'ahdika wa wa'dika mastaṭa'tu, a'ūdhu bika min sharri mā ṣana'tu, abū'u laka bi-ni'matika 'alayya, wa abū'u bi-dhanbī faghfir lī fa-innahū lā yaghfirudh-dhunūba illā Anta.",
      translation: "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant...",
      reference: 'Sahih al-Bukhari (6306)',
      virtue: 'Whoever recites it in the evening with conviction and dies during that night will enter Paradise.',
      targetCount: 1
    },
    {
      id: 'e5',
      category: 'Evening Entrance',
      title: 'Amsayna wa Amsal Mulku Lillah',
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      transliteration: "Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa 'alā kulli shay'in Qadīr. Rabbi as'aluka khayra mā fī hādhihil-laylati wa khayra mā ba'dahā, wa a'ūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā ba'dahā...",
      translation: "We have reached the evening and the dominion belongs to Allah, and all praise is for Allah...",
      reference: 'Sahih Muslim (2723)',
      virtue: 'Supplication for protection, security, and purity throughout the night.',
      targetCount: 1
    },
    {
      id: 'e6',
      category: 'Venom & Harm Shield',
      title: "A'oodhu bi-kalimatil-lahit-tammati",
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: "A'ūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq.",
      translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      reference: 'Sahih Muslim (2709)',
      virtue: 'Whoever recites this three times in the evening, no poisonous sting or harmful creature will harm him that night.',
      targetCount: 3
    },
    {
      id: 'e7',
      category: 'Comprehensive Shield',
      title: 'Bismillahilladhi la yadurru',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: "Bismillāhilladhī lā yaḍurru ma'asmihī shay'un fil-arḍi wa lā fis-samā'i wa Huwas-Samī'ul-'Alīm.",
      translation: "In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
      reference: 'Abu Dawood (5088), At-Tirmidhi (3388)',
      virtue: 'Nothing will harm the one who recites it 3 times until dawn.',
      targetCount: 3
    },
    {
      id: 'e8',
      category: 'Gratitude & Contentment',
      title: 'Raditu Billahi Rabba',
      arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
      transliteration: "Raḍītu billāhi Rabbā, wa bil-Islāmi dīnā, wa bi-Muḥammadin ṣallallāhu 'alayhi wa sallama Nabiyyā.",
      translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.",
      reference: 'Abu Dawood (5072)',
      virtue: 'Allah promises to grant content and pleasure on the Day of Resurrection to the reciter.',
      targetCount: 3
    },
    {
      id: 'e9',
      category: 'Well-being & Safety',
      title: "Du'a for Health & Freedom from Affliction",
      arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلٰهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلٰهَ إِلَّا أَنْتَ',
      transliteration: "Allāhumma 'āfinī fī badanī, Allāhumma 'āfinī fī sam'ī, Allāhumma 'āfinī fī baṣarī, lā ilāha illā Anta...",
      translation: "O Allah, grant soundness to my body; O Allah, grant soundness to my hearing; O Allah, grant soundness to my sight...",
      reference: 'Abu Dawood (5090)',
      virtue: 'Protection of vital faculties and safety from the punishment of the grave.',
      targetCount: 3
    },
    {
      id: 'e10',
      category: 'Divine Sufficiency',
      title: 'Hasbiyallahu la ilaha illa Huwa',
      arabic: 'حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      transliteration: "Ḥasbiyallāhu lā ilāha illā Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Aẓīm.",
      translation: "Allah is sufficient for me; there is no deity except Him. Upon Him I have relied, and He is the Lord of the Great Throne.",
      reference: 'Abu Dawood (5081)',
      virtue: 'Recite 7 times in the evening: Allah will take care of all worries in this life and the next.',
      targetCount: 7
    },
    {
      id: 'e11',
      category: 'Sin Eraser',
      title: 'SubhanAllahi wa bihamdihi (100x)',
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      transliteration: "Subḥān Allāhi wa bi-ḥamdih.",
      translation: "Glory be to Allah and His is the praise.",
      reference: 'Sahih Muslim (2692)',
      virtue: 'Whoever recites it 100 times in the evening, no one will come on the Day of Resurrection with better than what he has brought, except someone who said the same or more.',
      targetCount: 100
    },
    {
      id: 'e12',
      category: 'Tawheed Fortress',
      title: 'La ilaha illallah wahdahu la shareeka lah',
      arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: "Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa 'alā kulli shay'in Qadīr.",
      translation: "There is no deity worthy of worship except Allah alone, without partner. To Him belongs all dominion and praise, and He is over all things capable.",
      reference: 'Sahih al-Bukhari (3293)',
      virtue: 'Provides security, immense reward, and cleansing of errors before sleep.',
      targetCount: 10
    }
  ]
};

// ==========================================================================
// 4. TASBIH PRESETS
// ==========================================================================
const TASBIH_PRESETS = [
  {
    id: 'subhanallah',
    label: 'SubhanAllah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥān Allāh',
    translation: 'Glory be to Allah',
    target: 33
  },
  {
    id: 'alhamdulillah',
    label: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    target: 33
  },
  {
    id: 'allahuakbar',
    label: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    target: 34
  },
  {
    id: 'astaghfirullah',
    label: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I seek the forgiveness of Allah',
    target: 100
  },
  {
    id: 'lailahaillallah',
    label: 'La ilaha illallah',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illallāh',
    translation: 'There is no deity worthy of worship except Allah',
    target: 100
  },
  {
    id: 'subhanallahi-wabihamdihi',
    label: 'SubhanAllahi wa bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥān Allāhi wa bi-ḥamdih',
    translation: 'Glory be to Allah and His is the praise',
    target: 100
  },
  {
    id: 'custom',
    label: 'Custom / Free',
    arabic: 'ذِكْرٌ مُخَصَّصٌ',
    transliteration: 'Dhikr Mukhaṣṣaṣ',
    translation: 'Custom Target / Free Counting Mode',
    target: 100
  }
];

// ==========================================================================
// 5. STORAGE & ANALYTICS MANAGER
// ==========================================================================
const Storage = {
  getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  getData() {
    try {
      const raw = localStorage.getItem('zikrpulse_data');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return {
      dailyCounts: {}, // { 'YYYY-MM-DD': number }
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: '',
      allTimeCount: 0,
      soundEnabled: true,
      soundPreset: 'bead',
      hapticEnabled: true,
      theme: 'emerald',
      adhkarProgress: {} // { 'YYYY-MM-DD': { 'm1': 1, 'm2': 3 } }
    };
  },

  saveData(data) {
    try {
      localStorage.setItem('zikrpulse_data', JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  recordDhikrCount(amount = 1) {
    const data = this.getData();
    const today = this.getTodayKey();

    if (!data.dailyCounts[today]) {
      data.dailyCounts[today] = 0;
    }
    data.dailyCounts[today] += amount;
    data.allTimeCount = (data.allTimeCount || 0) + amount;

    // Update streak logic
    this.updateStreak(data, today);

    this.saveData(data);
    return data;
  },

  updateStreak(data, today) {
    const last = data.lastActiveDate;
    if (!last) {
      data.currentStreak = 1;
      data.bestStreak = Math.max(data.bestStreak || 1, 1);
      data.lastActiveDate = today;
      return;
    }

    if (last === today) {
      // Already active today, streak intact
      return;
    }

    const lastDate = new Date(last);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day!
      data.currentStreak = (data.currentStreak || 0) + 1;
    } else if (diffDays > 1) {
      // Streak broken
      data.currentStreak = 1;
    }

    data.bestStreak = Math.max(data.bestStreak || 1, data.currentStreak);
    data.lastActiveDate = today;
  },

  getAdhkarCount(id) {
    const data = this.getData();
    const today = this.getTodayKey();
    if (!data.adhkarProgress[today]) return 0;
    return data.adhkarProgress[today][id] || 0;
  },

  setAdhkarCount(id, count) {
    const data = this.getData();
    const today = this.getTodayKey();
    if (!data.adhkarProgress[today]) {
      data.adhkarProgress[today] = {};
    }
    data.adhkarProgress[today][id] = count;
    this.saveData(data);
    return data;
  }
};

// ==========================================================================
// 6. MAIN APPLICATION CONTROLLER
// ==========================================================================
class ZikrPulseApp {
  constructor() {
    this.sound = new SoundEngine();
    this.state = {
      activeTab: 'tasbih', // 'tasbih' | 'morning' | 'evening' | 'analytics'
      currentPresetIndex: 0,
      tasbihCount: 0,
      tasbihTarget: 33,
      lapCount: 1,
      todayTotalCount: 0,
      currentStreak: 1,
      bestStreak: 1,
      adhkarSearch: '',
      adhkarFilter: 'all', // 'all' | 'pending' | 'completed'
      adhkarTimeTab: 'morning', // 'morning' | 'evening'
      isFullscreen: false
    };

    // SVG Ring Constants
    this.RING_RADIUS = 135;
    this.RING_CIRCUMFERENCE = 2 * Math.PI * this.RING_RADIUS; // ~848.23
  }

  init() {
    this.loadPersistedState();
    this.cacheDOMElements();
    this.bindEvents();
    this.renderPresets();
    this.renderActiveDhikr();
    this.updateRingDisplay();
    this.renderAdhkarCards();
    this.updateAdhkarProgress();
    this.renderAnalytics();
    this.setupTheme();
    this.setupAutoGreetingTime();
    this.checkHashNavigation();
    window.addEventListener('hashchange', () => this.checkHashNavigation());
  }

  checkHashNavigation() {
    if (window.location.hash) {
      const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (['tasbih', 'adhkar', 'analytics'].includes(rawHash)) {
        this.switchTab(rawHash);
      }
    }
  }

  loadPersistedState() {
    const data = Storage.getData();
    const today = Storage.getTodayKey();

    this.sound.enabled = data.soundEnabled !== false;
    this.sound.preset = data.soundPreset || 'bead';
    Haptics.enabled = data.hapticEnabled !== false;

    this.state.todayTotalCount = data.dailyCounts[today] || 0;
    this.state.currentStreak = data.currentStreak || 1;
    this.state.bestStreak = data.bestStreak || 1;
    this.theme = data.theme || 'emerald';

    // Set initial preset
    const currentPreset = TASBIH_PRESETS[this.state.currentPresetIndex];
    this.state.tasbihTarget = currentPreset.target;
  }

  cacheDOMElements() {
    // Header & Badges
    this.todayBadge = document.getElementById('todayCountBadge');
    this.streakBadge = document.getElementById('streakCountBadge');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.hapticToggleBtn = document.getElementById('hapticToggleBtn');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');

    // Navigation Tabs
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabPanels = document.querySelectorAll('.tab-panel');

    // Tasbih Section
    this.presetChipsContainer = document.getElementById('presetChipsList');
    this.dhikrArabic = document.getElementById('dhikrArabic');
    this.dhikrTranslit = document.getElementById('dhikrTranslit');
    this.dhikrTranslation = document.getElementById('dhikrTranslation');
    this.ringTouchZone = document.getElementById('ringTouchZone');
    this.counterNumber = document.getElementById('counterNumber');
    this.ringProgressCircle = document.getElementById('ringProgressCircle');
    this.counterLapBadge = document.getElementById('counterLapBadge');
    this.counterTargetLabel = document.getElementById('counterTargetLabel');
    this.soundSelect = document.getElementById('soundSelect');
    this.resetBtn = document.getElementById('resetBtn');
    this.decrementBtn = document.getElementById('decrementBtn');
    this.customTargetBtn = document.getElementById('customTargetBtn');

    // Adhkar Section
    this.adhkarTimeMorningBtn = document.getElementById('adhkarTimeMorningBtn');
    this.adhkarTimeEveningBtn = document.getElementById('adhkarTimeEveningBtn');
    this.adhkarCardsList = document.getElementById('adhkarCardsList');
    this.adhkarProgressBarFill = document.getElementById('adhkarProgressBarFill');
    this.adhkarProgressLabel = document.getElementById('adhkarProgressLabel');
    this.adhkarProgressPercent = document.getElementById('adhkarProgressPercent');
    this.adhkarSearchInput = document.getElementById('adhkarSearchInput');
    this.adhkarFilterPills = document.querySelectorAll('.filter-pill');
    this.resetAdhkarBtn = document.getElementById('resetAdhkarBtn');

    // Modals & Toasts
    this.resetModalOverlay = document.getElementById('resetModalOverlay');
    this.confirmResetBtn = document.getElementById('confirmResetBtn');
    this.cancelResetBtn = document.getElementById('cancelResetBtn');

    this.customTargetModalOverlay = document.getElementById('customTargetModalOverlay');
    this.customTargetInput = document.getElementById('customTargetInput');
    this.saveCustomTargetBtn = document.getElementById('saveCustomTargetBtn');
    this.cancelCustomTargetBtn = document.getElementById('cancelCustomTargetBtn');

    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Sound & Haptic Toggles
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const isNowOn = this.sound.toggleSound();
        this.updateSoundBtnUI(isNowOn);
        const data = Storage.getData();
        data.soundEnabled = isNowOn;
        Storage.saveData(data);
        this.showToast(isNowOn ? '🔊 Sound enabled' : '🔇 Muted');
      });
    }

    if (this.hapticToggleBtn) {
      this.hapticToggleBtn.addEventListener('click', () => {
        const isNowOn = Haptics.toggle();
        this.updateHapticBtnUI(isNowOn);
        const data = Storage.getData();
        data.hapticEnabled = isNowOn;
        Storage.saveData(data);
        if (isNowOn) Haptics.tick();
        this.showToast(isNowOn ? '📳 Haptic feedback enabled' : '📳 Haptic disabled');
      });
    }

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.cycleTheme());
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    if (this.soundSelect) {
      this.soundSelect.value = this.sound.preset;
      this.soundSelect.addEventListener('change', (e) => {
        this.sound.setPreset(e.target.value);
        this.sound.playClick();
        const data = Storage.getData();
        data.soundPreset = e.target.value;
        Storage.saveData(data);
      });
    }

    // Navigation Tabs
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.dataset.tab;
        this.switchTab(tabTarget);
      });
    });

    // Tasbih Touch Ring Event (Tap anywhere on the ring)
    if (this.ringTouchZone) {
      this.ringTouchZone.addEventListener('pointerdown', (e) => {
        // Prevent default double-tap zoom
        e.preventDefault();
        this.incrementTasbih(e);
      });
    }

    // Decrement & Reset Buttons
    if (this.decrementBtn) {
      this.decrementBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.decrementTasbih();
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openResetModal();
      });
    }

    if (this.customTargetBtn) {
      this.customTargetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCustomTargetModal();
      });
    }

    // Modal Action Bindings
    if (this.confirmResetBtn) {
      this.confirmResetBtn.addEventListener('click', () => {
        this.resetTasbih();
        this.closeResetModal();
      });
    }
    if (this.cancelResetBtn) {
      this.cancelResetBtn.addEventListener('click', () => this.closeResetModal());
    }

    if (this.saveCustomTargetBtn) {
      this.saveCustomTargetBtn.addEventListener('click', () => this.saveCustomTarget());
    }
    if (this.cancelCustomTargetBtn) {
      this.cancelCustomTargetBtn.addEventListener('click', () => this.closeCustomTargetModal());
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.incrementTasbih();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.decrementTasbih();
      } else if (e.key === 'r' || e.key === 'R') {
        this.openResetModal();
      } else if (e.key === 'm' || e.key === 'M') {
        if (this.soundToggleBtn) this.soundToggleBtn.click();
      } else if (e.key === 'f' || e.key === 'F') {
        this.toggleFullscreen();
      }
    });

    // Adhkar Time Switch (Morning / Evening)
    if (this.adhkarTimeMorningBtn) {
      this.adhkarTimeMorningBtn.addEventListener('click', () => {
        this.setAdhkarTimeTab('morning');
      });
    }
    if (this.adhkarTimeEveningBtn) {
      this.adhkarTimeEveningBtn.addEventListener('click', () => {
        this.setAdhkarTimeTab('evening');
      });
    }

    // Adhkar Search & Filter
    if (this.adhkarSearchInput) {
      this.adhkarSearchInput.addEventListener('input', (e) => {
        this.state.adhkarSearch = e.target.value.trim().toLowerCase();
        this.renderAdhkarCards();
      });
    }

    this.adhkarFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.adhkarFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.state.adhkarFilter = pill.dataset.filter;
        this.renderAdhkarCards();
      });
    });

    // Reset All Adhkar for session
    if (this.resetAdhkarBtn) {
      this.resetAdhkarBtn.addEventListener('click', () => this.resetAdhkarSession());
    }

    // Analytics Actions
    const shareProgressBtn = document.getElementById('shareProgressBtn');
    if (shareProgressBtn) {
      shareProgressBtn.addEventListener('click', () => this.shareProgress());
    }

    const resetAllDataBtn = document.getElementById('resetAllDataBtn');
    if (resetAllDataBtn) {
      resetAllDataBtn.addEventListener('click', () => this.resetAllStorageData());
    }
  }

  // Determine morning / evening by current hour (Fajr to Asr = Morning; Asr to Fajr = Evening)
  setupAutoGreetingTime() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 15) {
      this.state.adhkarTimeTab = 'morning';
    } else {
      this.state.adhkarTimeTab = 'evening';
    }
    this.updateAdhkarTimeButtons();
  }

  // ==========================================================================
  // TASBIH LOGIC
  // ==========================================================================
  incrementTasbih(pointerEvent) {
    this.sound.playClick();
    Haptics.tick();

    this.state.tasbihCount++;
    this.state.todayTotalCount++;

    // Record in storage
    const updatedData = Storage.recordDhikrCount(1);
    this.state.currentStreak = updatedData.currentStreak;
    this.state.bestStreak = updatedData.bestStreak;

    // Visual ripple effect inside ring
    if (pointerEvent && this.ringTouchZone) {
      this.createRipple(pointerEvent);
    }

    // Bounce digit animation
    if (this.counterNumber) {
      this.counterNumber.classList.remove('scale-bounce');
      // trigger reflow
      void this.counterNumber.offsetWidth;
      this.counterNumber.classList.add('scale-bounce');
    }

    // Check if target count reached
    if (this.state.tasbihTarget > 0 && this.state.tasbihCount >= this.state.tasbihTarget) {
      this.onTargetReached();
    } else {
      this.updateRingDisplay();
    }

    this.updateHeaderBadges();
  }

  decrementTasbih() {
    if (this.state.tasbihCount > 0) {
      this.state.tasbihCount--;
      if (this.state.todayTotalCount > 0) {
        this.state.todayTotalCount--;
        Storage.recordDhikrCount(-1);
      }
      this.sound.playClick();
      this.updateRingDisplay();
      this.updateHeaderBadges();
    }
  }

  onTargetReached() {
    this.sound.playCelebration();
    Haptics.celebrate();

    // Visual celebrating glow
    const wrapper = document.querySelector('.counter-ring-wrapper');
    if (wrapper) {
      wrapper.classList.add('ring-celebrating');
      setTimeout(() => wrapper.classList.remove('ring-celebrating'), 1000);
    }

    const currentPreset = TASBIH_PRESETS[this.state.currentPresetIndex];
    this.showToast(`✨ Target Reached! Completed Lap ${this.state.lapCount} of ${currentPreset.label}`, 'toast-gold');

    // Increment lap and reset counter for next round
    this.state.lapCount++;
    this.state.tasbihCount = 0;
    this.updateRingDisplay();
    this.renderAnalytics(); // Refresh analytics & milestones
  }

  updateRingDisplay() {
    if (this.counterNumber) {
      this.counterNumber.textContent = this.state.tasbihCount;
    }

    if (this.counterLapBadge) {
      this.counterLapBadge.textContent = `Lap ${this.state.lapCount}`;
    }

    if (this.counterTargetLabel) {
      if (this.state.tasbihTarget > 0) {
        this.counterTargetLabel.innerHTML = `Target: <span>${this.state.tasbihTarget}</span>`;
      } else {
        this.counterTargetLabel.innerHTML = `<span>Free Mode (∞)</span>`;
      }
    }

    // SVG Circular Progress calculation
    if (this.ringProgressCircle) {
      if (this.state.tasbihTarget > 0) {
        const ratio = Math.min(this.state.tasbihCount / this.state.tasbihTarget, 1);
        const offset = this.RING_CIRCUMFERENCE - (ratio * this.RING_CIRCUMFERENCE);
        this.ringProgressCircle.style.strokeDashoffset = offset;
      } else {
        // Free mode: cycles every 33 counts for visual rhythm
        const freeRatio = (this.state.tasbihCount % 33) / 33;
        const offset = this.RING_CIRCUMFERENCE - (freeRatio * this.RING_CIRCUMFERENCE);
        this.ringProgressCircle.style.strokeDashoffset = offset;
      }
    }
  }

  createRipple(e) {
    const rect = this.ringTouchZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-circle';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    this.ringTouchZone.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  renderPresets() {
    if (!this.presetChipsContainer) return;
    this.presetChipsContainer.innerHTML = '';

    TASBIH_PRESETS.forEach((preset, idx) => {
      const chip = document.createElement('button');
      chip.className = `preset-chip ${idx === this.state.currentPresetIndex ? 'active' : ''}`;
      chip.innerHTML = `
        <span>${preset.label}</span>
        <span class="preset-target">${preset.target > 0 ? preset.target : '∞'}</span>
      `;
      chip.addEventListener('click', () => {
        this.selectPreset(idx);
      });
      this.presetChipsContainer.appendChild(chip);
    });
  }

  selectPreset(index) {
    this.state.currentPresetIndex = index;
    const preset = TASBIH_PRESETS[index];

    if (preset.id === 'custom') {
      this.openCustomTargetModal();
    } else {
      this.state.tasbihTarget = preset.target;
    }

    this.state.tasbihCount = 0;
    this.state.lapCount = 1;

    this.renderPresets();
    this.renderActiveDhikr();
    this.updateRingDisplay();
  }

  renderActiveDhikr() {
    const preset = TASBIH_PRESETS[this.state.currentPresetIndex];
    if (this.dhikrArabic) this.dhikrArabic.textContent = preset.arabic;
    if (this.dhikrTranslit) this.dhikrTranslit.textContent = preset.transliteration;
    if (this.dhikrTranslation) this.dhikrTranslation.textContent = preset.translation;
  }

  resetTasbih() {
    this.state.tasbihCount = 0;
    this.state.lapCount = 1;
    this.updateRingDisplay();
    this.showToast('Tasbih counter reset');
  }

  openResetModal() {
    if (this.resetModalOverlay) this.resetModalOverlay.classList.add('open');
  }

  closeResetModal() {
    if (this.resetModalOverlay) this.resetModalOverlay.classList.remove('open');
  }

  openCustomTargetModal() {
    if (this.customTargetModalOverlay) {
      this.customTargetInput.value = this.state.tasbihTarget || 100;
      this.customTargetModalOverlay.classList.add('open');
      setTimeout(() => this.customTargetInput.focus(), 100);
    }
  }

  closeCustomTargetModal() {
    if (this.customTargetModalOverlay) this.customTargetModalOverlay.classList.remove('open');
  }

  saveCustomTarget() {
    const val = parseInt(this.customTargetInput.value, 10);
    if (!isNaN(val) && val >= 0) {
      this.state.tasbihTarget = val;
      const customPreset = TASBIH_PRESETS.find(p => p.id === 'custom');
      if (customPreset) {
        customPreset.target = val;
      }
      this.renderPresets();
      this.updateRingDisplay();
      this.showToast(val === 0 ? 'Free Count Mode (No limit)' : `Custom target set to ${val}`);
    }
    this.closeCustomTargetModal();
  }

  // ==========================================================================
  // ADHKAR SECTION LOGIC
  // ==========================================================================
  setAdhkarTimeTab(timeTab) {
    this.state.adhkarTimeTab = timeTab;
    this.updateAdhkarTimeButtons();
    this.renderAdhkarCards();
    this.updateAdhkarProgress();
  }

  updateAdhkarTimeButtons() {
    if (this.adhkarTimeMorningBtn && this.adhkarTimeEveningBtn) {
      if (this.state.adhkarTimeTab === 'morning') {
        this.adhkarTimeMorningBtn.classList.add('active');
        this.adhkarTimeEveningBtn.classList.remove('active');
      } else {
        this.adhkarTimeEveningBtn.classList.add('active');
        this.adhkarTimeMorningBtn.classList.remove('active');
      }
    }
  }

  renderAdhkarCards() {
    if (!this.adhkarCardsList) return;
    this.adhkarCardsList.innerHTML = '';

    const list = ADHKAR_DATA[this.state.adhkarTimeTab] || [];
    const search = this.state.adhkarSearch;
    const filter = this.state.adhkarFilter;

    const filtered = list.filter(item => {
      const current = Storage.getAdhkarCount(item.id);
      const isCompleted = current >= item.targetCount;

      if (filter === 'pending' && isCompleted) return false;
      if (filter === 'completed' && !isCompleted) return false;

      if (search) {
        const hay = `${item.title} ${item.arabic} ${item.transliteration} ${item.translation} ${item.category}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.adhkarCardsList.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-dim);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No supplications match your filter.</p>
          <span style="font-size: 0.85rem;">Try adjusting your search terms or filter pills.</span>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = this.createAdhkarCardElement(item);
      this.adhkarCardsList.appendChild(card);
    });
  }

  createAdhkarCardElement(item) {
    const currentCount = Storage.getAdhkarCount(item.id);
    const isCompleted = currentCount >= item.targetCount;
    const remaining = Math.max(0, item.targetCount - currentCount);

    const card = document.createElement('div');
    card.className = `adhkar-item-card ${isCompleted ? 'completed' : ''}`;
    card.id = `card-${item.id}`;

    card.innerHTML = `
      <div class="card-top-row">
        <span class="card-category-tag">${item.category}</span>
        <span class="card-count-badge">${item.targetCount}x Required</span>
      </div>

      <div class="card-arabic-box">
        <div class="card-arabic-text">${item.arabic}</div>
      </div>

      <div class="card-translit-text">${item.transliteration}</div>
      <div class="card-translation-text">${item.translation}</div>

      <div>
        <button class="card-details-toggle" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Virtue & Authentic Reference</span>
        </button>
        <div class="card-details-content">
          <div class="card-virtue"><strong>Virtue:</strong> ${item.virtue}</div>
          <div class="card-ref"><strong>Source:</strong> ${item.reference}</div>
        </div>
      </div>

      <div class="card-action-row">
        <div class="card-progress-indicator">
          <span class="card-progress-text">${currentCount} / ${item.targetCount}</span>
        </div>
        <button class="adhkar-tap-btn ${isCompleted ? 'btn-done' : ''}" type="button">
          ${isCompleted ? '✓ Completed' : `Tap to Count (${remaining} left)`}
        </button>
      </div>
    `;

    // Toggle Details Accordion
    const toggleBtn = card.querySelector('.card-details-toggle');
    const detailsContent = card.querySelector('.card-details-content');
    toggleBtn.addEventListener('click', () => {
      detailsContent.classList.toggle('open');
    });

    // Tap to Count Button
    const tapBtn = card.querySelector('.adhkar-tap-btn');
    tapBtn.addEventListener('click', () => {
      this.incrementAdhkar(item, card);
    });

    return card;
  }

  incrementAdhkar(item, cardElement) {
    let current = Storage.getAdhkarCount(item.id);
    if (current < item.targetCount) {
      current++;
      Storage.setAdhkarCount(item.id, current);

      // Increment overall daily counters
      this.state.todayTotalCount++;
      const updatedData = Storage.recordDhikrCount(1);
      this.state.currentStreak = updatedData.currentStreak;
      this.state.bestStreak = updatedData.bestStreak;

      this.sound.playClick();
      Haptics.tick();

      const remaining = item.targetCount - current;
      const tapBtn = cardElement.querySelector('.adhkar-tap-btn');
      const progText = cardElement.querySelector('.card-progress-text');

      progText.textContent = `${current} / ${item.targetCount}`;

      if (current >= item.targetCount) {
        cardElement.classList.add('completed');
        tapBtn.className = 'adhkar-tap-btn btn-done';
        tapBtn.textContent = '✓ Completed';
        this.sound.playCelebration();
        Haptics.celebrate();
        this.showToast(`✓ Completed: ${item.title}`);
      } else {
        tapBtn.textContent = `Tap to Count (${remaining} left)`;
      }

      this.updateAdhkarProgress();
      this.updateHeaderBadges();
      this.renderAnalytics();
    }
  }

  updateAdhkarProgress() {
    const list = ADHKAR_DATA[this.state.adhkarTimeTab] || [];
    let completedCount = 0;

    list.forEach(item => {
      const c = Storage.getAdhkarCount(item.id);
      if (c >= item.targetCount) completedCount++;
    });

    const total = list.length;
    const percent = Math.round((completedCount / total) * 100);

    if (this.adhkarProgressBarFill) {
      this.adhkarProgressBarFill.style.width = `${percent}%`;
    }
    if (this.adhkarProgressLabel) {
      this.adhkarProgressLabel.textContent = `${completedCount} of ${total} Completed`;
    }
    if (this.adhkarProgressPercent) {
      this.adhkarProgressPercent.textContent = `${percent}%`;
    }

    if (completedCount === total && total > 0) {
      const sessionName = this.state.adhkarTimeTab === 'morning' ? 'Morning Adhkar' : 'Evening Adhkar';
      this.showToast(`🎉 Alhamdulillah! You have completed all ${sessionName}!`, 'toast-gold');
    }
  }

  resetAdhkarSession() {
    const list = ADHKAR_DATA[this.state.adhkarTimeTab] || [];
    list.forEach(item => {
      Storage.setAdhkarCount(item.id, 0);
    });
    this.renderAdhkarCards();
    this.updateAdhkarProgress();
    this.showToast(`Reset ${this.state.adhkarTimeTab} adhkar progress`);
  }

  // ==========================================================================
  // ANALYTICS & STREAKS
  // ==========================================================================
  renderAnalytics() {
    const data = Storage.getData();
    const today = Storage.getTodayKey();

    const todayCountEl = document.getElementById('analyticTodayCount');
    const streakCountEl = document.getElementById('analyticStreakCount');
    const bestStreakEl = document.getElementById('analyticBestStreak');
    const allTimeCountEl = document.getElementById('analyticAllTimeCount');

    if (todayCountEl) todayCountEl.textContent = (data.dailyCounts[today] || 0).toLocaleString();
    if (streakCountEl) streakCountEl.textContent = `${data.currentStreak || 1} d`;
    if (bestStreakEl) bestStreakEl.textContent = `${data.bestStreak || 1} d`;
    if (allTimeCountEl) allTimeCountEl.textContent = (data.allTimeCount || 0).toLocaleString();

    this.renderWeeklyChart(data);
    this.renderMilestones(data);
  }

  renderWeeklyChart(data) {
    const chartContainer = document.getElementById('weeklyChartBars');
    if (!chartContainer) return;
    chartContainer.innerHTML = '';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const past7Days = [];

    // Collect last 7 dates
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      const dayName = i === 0 ? 'Today' : days[d.getDay()];
      past7Days.push({ key, label: dayName, count: data.dailyCounts[key] || 0, isToday: i === 0 });
    }

    // Determine max for proportional scaling
    const maxCount = Math.max(...past7Days.map(d => d.count), 50);

    past7Days.forEach(day => {
      const heightPercent = Math.min(Math.round((day.count / maxCount) * 100), 100);

      const col = document.createElement('div');
      col.className = 'chart-col';
      col.innerHTML = `
        <span class="chart-count-label">${day.count}</span>
        <div class="chart-bar-wrapper">
          <div class="chart-bar-fill ${day.isToday ? 'today' : ''}" style="height: ${Math.max(heightPercent, 5)}%"></div>
        </div>
        <span class="chart-day-label">${day.label}</span>
      `;
      chartContainer.appendChild(col);
    });
  }

  renderMilestones(data) {
    const total = data.allTimeCount || 0;
    const streak = data.currentStreak || 1;

    // Check adhkar completed today
    const today = Storage.getTodayKey();
    const todayAdhkar = data.adhkarProgress[today] || {};
    const morningAll = ADHKAR_DATA.morning.every(i => (todayAdhkar[i.id] || 0) >= i.targetCount);
    const eveningAll = ADHKAR_DATA.evening.every(i => (todayAdhkar[i.id] || 0) >= i.targetCount);

    const badges = [
      { id: 'b1', name: 'First Bead', desc: '1st Dhikr recited', icon: '🌱', unlocked: total >= 1 },
      { id: 'b2', name: 'Centurion', desc: '100 total dhikr', icon: '💯', unlocked: total >= 100 },
      { id: 'b3', name: 'Tasbih Devotee', desc: '1,000 total dhikr', icon: '📿', unlocked: total >= 1000 },
      { id: 'b4', name: 'Morning Light', desc: 'All Morning Adhkar', icon: '🌅', unlocked: morningAll },
      { id: 'b5', name: 'Evening Peace', desc: 'All Evening Adhkar', icon: '🌇', unlocked: eveningAll },
      { id: 'b6', name: 'Steadfast', desc: '3-Day streak', icon: '🔥', unlocked: streak >= 3 },
      { id: 'b7', name: 'Iron Will', desc: '7-Day streak', icon: '👑', unlocked: streak >= 7 }
    ];

    const milestonesGrid = document.getElementById('milestonesGrid');
    if (!milestonesGrid) return;
    milestonesGrid.innerHTML = '';

    badges.forEach(b => {
      const item = document.createElement('div');
      item.className = `badge-item ${b.unlocked ? 'unlocked' : ''}`;
      item.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      `;
      milestonesGrid.appendChild(item);
    });
  }

  shareProgress() {
    const data = Storage.getData();
    const todayCount = data.dailyCounts[Storage.getTodayKey()] || 0;
    const streak = data.currentStreak || 1;
    const total = data.allTimeCount || 0;

    const shareText = `📿 ZikrPulse Daily Remembrance\n\n✨ Today's Count: ${todayCount} Dhikr\n🔥 Current Streak: ${streak} Days\n🌟 All-Time Dhikr: ${total.toLocaleString()}\n\n"Verily, in the remembrance of Allah do hearts find rest." (Ar-Ra'd 13:28)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showToast('📋 Progress copied to clipboard! Ready to share.', 'toast-gold');
      }).catch(() => {
        this.showToast('Please copy your progress manually.');
      });
    } else {
      this.showToast('Clipboard not available on this browser.');
    }
  }

  resetAllStorageData() {
    if (confirm('Are you sure you want to reset all your ZikrPulse streaks, counts, and history? This cannot be undone.')) {
      localStorage.removeItem('zikrpulse_data');
      this.loadPersistedState();
      this.state.tasbihCount = 0;
      this.state.lapCount = 1;
      this.updateRingDisplay();
      this.updateHeaderBadges();
      this.renderAdhkarCards();
      this.updateAdhkarProgress();
      this.renderAnalytics();
      this.showToast('All progress has been reset.');
    }
  }

  // ==========================================================================
  // UI & NAVIGATION HELPERS
  // ==========================================================================
  switchTab(tabId) {
    this.state.activeTab = tabId;

    this.tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (tabId === 'analytics') {
      this.renderAnalytics();
    }
  }

  updateHeaderBadges() {
    if (this.todayBadge) {
      this.todayBadge.textContent = `${this.state.todayTotalCount} today`;
    }
    if (this.streakBadge) {
      this.streakBadge.textContent = `${this.state.currentStreak} d`;
    }
  }

  updateSoundBtnUI(isOn) {
    if (!this.soundToggleBtn) return;
    if (isOn) {
      this.soundToggleBtn.classList.add('active');
      this.soundToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    } else {
      this.soundToggleBtn.classList.remove('active');
      this.soundToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    }
  }

  updateHapticBtnUI(isOn) {
    if (!this.hapticToggleBtn) return;
    if (isOn) {
      this.hapticToggleBtn.classList.add('active');
    } else {
      this.hapticToggleBtn.classList.remove('active');
    }
  }

  setupTheme() {
    document.body.setAttribute('data-theme', this.theme);
  }

  cycleTheme() {
    const themes = ['emerald', 'midnight', 'amber'];
    const currentIdx = themes.indexOf(this.theme);
    const nextTheme = themes[(currentIdx + 1) % themes.length];
    this.theme = nextTheme;
    document.body.setAttribute('data-theme', nextTheme);

    const data = Storage.getData();
    data.theme = nextTheme;
    Storage.saveData(data);

    const labels = { emerald: 'Emerald Slate', midnight: 'Midnight OLED', amber: 'Amber Glow' };
    this.showToast(`Theme: ${labels[nextTheme]}`);
  }

  toggleFullscreen() {
    const tasbihPanel = document.getElementById('tab-tasbih');
    if (!this.state.isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      this.state.isFullscreen = true;
      if (this.fullscreenBtn) this.fullscreenBtn.classList.add('active');
      this.showToast('Fullscreen Mode (Press Esc or tap Fullscreen to exit)');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      this.state.isFullscreen = false;
      if (this.fullscreenBtn) this.fullscreenBtn.classList.remove('active');
    }
  }

  showToast(message, extraClass = '') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${extraClass}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4m0 4h.01"></path>
      </svg>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ZikrPulseApp();
  window.app.init();
});
