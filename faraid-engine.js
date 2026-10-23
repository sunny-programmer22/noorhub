/**
 * FaraidCalc - Simplified Islamic Inheritance Calculator
 * Complete Calculation Engine, Chart.js Integration, and UI Controller
 */

// ==========================================
// 1. MATHEMATICAL FRACTION HELPER
// ==========================================

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

class Fraction {
  constructor(num, den = 1) {
    if (den === 0) throw new Error("Denominator cannot be zero");
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const g = gcd(Math.abs(num), Math.abs(den)) || 1;
    this.num = num / g;
    this.den = den / g;
  }

  add(other) {
    const den = lcm(this.den, other.den);
    const num = this.num * (den / this.den) + other.num * (den / other.den);
    return new Fraction(num, den);
  }

  sub(other) {
    const den = lcm(this.den, other.den);
    const num = this.num * (den / this.den) - other.num * (den / other.den);
    return new Fraction(num, den);
  }

  mul(other) {
    if (typeof other === 'number') other = new Fraction(other, 1);
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other) {
    if (typeof other === 'number') other = new Fraction(other, 1);
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  toNumber() {
    return this.num / this.den;
  }

  toString() {
    if (this.num === 0) return "0";
    if (this.den === 1) return `${this.num}`;
    return `${this.num}/${this.den}`;
  }
}

// ==========================================
// 2. CURRENCY CONFIGURATION & FORMATTING
// ==========================================

const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar', locale: 'en-US' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound', locale: 'en-GB' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', locale: 'de-DE' },
  SAR: { symbol: '﷼', code: 'SAR', name: 'Saudi Riyal', locale: 'ar-SA' },
  AED: { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  BDT: { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka', locale: 'bn-BD' },
  PKR: { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee', locale: 'ur-PK' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee', locale: 'en-IN' },
  MYR: { symbol: 'RM', code: 'MYR', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  IDR: { symbol: 'Rp', code: 'IDR', name: 'Indonesian Rupiah', locale: 'id-ID' },
  TRY: { symbol: '₺', code: 'TRY', name: 'Turkish Lira', locale: 'tr-TR' },
  CAD: { symbol: '$', code: 'CAD', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { symbol: '$', code: 'AUD', name: 'Australian Dollar', locale: 'en-AU' },
  QAR: { symbol: '﷼', code: 'QAR', name: 'Qatari Riyal', locale: 'ar-QA' },
  KWD: { symbol: 'KD', code: 'KWD', name: 'Kuwaiti Dinar', locale: 'ar-KW' }
};

let currentCurrency = 'USD';

function formatMoney(amount, currencyCode = currentCurrency) {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const formatted = Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${curr.symbol} ${formatted}`;
}

// ==========================================
// 3. QURANIC VERSES & REFERENCES
// ==========================================

const QURANIC_REFERENCES = {
  'Surah An-Nisa 4:11': {
    surah: 'Surah An-Nisa (4:11)',
    arabic: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ۚ فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ ۚ وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ ۚ فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ ۚ فَإِن كَانَ لَهُ إِخْوَةٌ فَلِأُمِّهِ السُّدُسُ ۚ مِن بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ ۗ آبَاؤُكُمْ وَأَبْنَاؤُكُمْ لَا تَدْرُونَ أَيُّهُمْ أَقْرَبُ لَكُمْ نَفْعًا ۚ فَرِيضَةً مِّنَ اللَّهِ ۗ إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا',
    translation: 'Allah instructs you concerning your children: for the male, what is equal to the share of two females. But if there are only daughters, two or more, for them is two thirds of one\'s estate. And if there is only one, for her is half. And for one\'s parents, to each one of them is a sixth of his estate if he left children. But if he had no children and the parents [alone] inherit him, then for his mother is one third. And if he had brothers [or sisters], for his mother is a sixth, after any bequest he [may have] made or debt. Your parents or your children - you know not which of them are nearest to you in benefit. [These shares are] an obligation [imposed] by Allah. Indeed, Allah is ever Knowing and Wise.',
    explanation: 'Defines the fundamental inheritance shares for children (sons and daughters) and parents (father and mother), establishing the 2:1 ratio for male over female agnatic descendants, and sets precedence of debts and bequests.'
  },
  'Surah An-Nisa 4:12': {
    surah: 'Surah An-Nisa (4:12)',
    arabic: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ ۚ فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ ۚ مِن بَعْدِ وَصِيَّةٍ يُوصِينَ بِهَا أَوْ دَيْنٍ ۚ وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ ۚ فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُم ۚ مِن بَعْدِ وَصِيَّةٍ تُوصُونَ بِهَا أَوْ دَيْنٍ',
    translation: 'And for you is half of what your wives leave if they have no child. But if they have a child, for you is one fourth of what they leave, after any bequest they [may have] made or debt. And for the wives is one fourth if you leave no child. But if you leave a child, then for them is an eighth of what you leave, after any bequest you [may have] made or debt.',
    explanation: 'Defines the precise fractional shares of the spouses: Husband receives 1/2 without children or 1/4 with children; Wife/wives receive 1/4 without children or 1/8 with children.'
  },
  'Surah An-Nisa 4:176': {
    surah: 'Surah An-Nisa (4:176)',
    arabic: 'يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلَالَةِ ۚ إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ ۚ وَهُوَ يَرِثُهَا إِن لَّمْ يَكُن لَّهَا وَلَدٌ ۚ فَإِن كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ ۚ وَإِن كَانُوا إِخْوَةً رِّجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ ۗ يُبَيِّنُ اللَّهُ لَكُمْ أَن تَضِلُّوا ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ',
    translation: 'They request from you a [legal] ruling. Say, "Allah gives you a ruling concerning one having neither descendants nor ascendants [as heirs] (Kalalah)." If a man dies, leaving no child but [only] a sister, she will have half of what he leaves. And he would inherit from her if she [died and] had no child. But if there are two sisters, they\'ll have two thirds of what he leaves. If there are brothers and sisters, the male will have twice the share of the female. Allah makes clear to you [His law], lest you go astray. And Allah is Knowing of all things.',
    explanation: 'Governs the Kalalah condition (when the deceased leaves no parent and no child), specifying the rights of brothers and sisters.'
  },
  'Sahih al-Bukhari 6732': {
    surah: 'Hadith: Sahih al-Bukhari 6732',
    arabic: 'أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِأَوْلَى رَجُلٍ ذَكَرٍ',
    translation: 'The Prophet (ﷺ) said: "Give the shares of inheritance to those who are entitled to them, and whatever remains goes to the closest male relative (Al-Asabah)."',
    explanation: 'Foundational legal principle establishing the priority of Zawil-Furud (fixed sharers) followed by the distribution of the residue to the Asabah.'
  },
  'Sahih al-Bukhari 6736': {
    surah: 'Hadith: Sahih al-Bukhari 6736',
    arabic: 'اجْعَلُوا الْأَخَوَاتِ مَعَ الْبَنَاتِ عَصَبَةً',
    translation: 'Judgement of Abdullah ibn Mas\'ud (RA): "Make sisters residuaries when they are alongside daughters."',
    explanation: 'Establishes the Asabah ma\'a ghayriha rule where full sisters inherit the remainder of the estate after daughters receive their Quranic shares.'
  },
  'Sunnah (Abu Dawud, Tirmidhi)': {
    surah: 'Sunnah: Abu Dawud & Tirmidhi',
    arabic: 'قَضَى رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ لِلْجَدَّةِ بِالسُّدُسِ',
    translation: 'The Messenger of Allah (ﷺ) decreed for the grandmother a share of one-sixth.',
    explanation: 'Grandmothers inherit a collective 1/6 when not blocked by the mother (or father in case of paternal grandmother).'
  },
  'Surah An-Nisa 4:11 & Ijma (Al-Gharrawiyyan)': {
    surah: 'Ijma of Sahaba: Al-Gharrawiyyan (Umariyyatan)',
    arabic: 'قَضَاءُ عُمَرَ وَعُثْمَانَ وَعَلِيٍّ وَزَيْدِ بْنِ ثَابِتٍ رَضِيَ اللَّهُ عَنْهُمْ',
    translation: 'Decreed by Umar ibn al-Khattab, Uthman, Ali, and Zayd ibn Thabit (RA): In the presence of spouse and both parents with no children, Mother takes 1/3 of the remainder after spouse so Father maintains double the Mother\'s share.',
    explanation: 'Celebrated consensus (Ijma) case preserving the Quranic ratio (2:1) between father and mother when inheriting alongside a spouse.'
  }
};

// ==========================================
// 4. RIGOROUS FARAID CALCULATION ENGINE
// ==========================================

function calculateFaraid(input) {
  // 1. Estate deductions
  const gross = Math.max(0, input.grossEstate || 0);
  const funeral = Math.max(0, input.funeral || 0);
  const debts = Math.max(0, input.debts || 0);

  const netAfterDebts = Math.max(0, gross - funeral - debts);
  const maxWasiyyahAllowed = netAfterDebts / 3;
  let wasiyyah = Math.max(0, input.wasiyyah || 0);
  let wasiyyahExceeded = false;
  if (wasiyyah > maxWasiyyahAllowed) {
    wasiyyahExceeded = true;
    wasiyyah = maxWasiyyahAllowed; // Sunnah cap
  }

  const distributable = Math.max(0, netAfterDebts - wasiyyah);

  if (distributable <= 0) {
    return {
      status: 'exhausted',
      gross,
      funeral,
      debts,
      netAfterDebts,
      wasiyyah,
      wasiyyahExceeded,
      maxWasiyyahAllowed,
      distributable: 0,
      heirs: [],
      blocked: [],
      specialCase: null
    };
  }

  // Parse heirs
  const isMaleDeceased = input.gender === 'male';
  const wivesCount = isMaleDeceased ? Math.min(4, Math.max(0, input.wivesCount || 0)) : 0;
  const hasHusband = !isMaleDeceased && Boolean(input.husband);
  const sons = Math.max(0, input.sons || 0);
  const daughters = Math.max(0, input.daughters || 0);
  const hasChildren = (sons + daughters) > 0;
  const father = Boolean(input.father);
  const mother = Boolean(input.mother);
  const paternalGrandfather = Boolean(input.paternalGrandfather);
  const paternalGrandmother = Boolean(input.paternalGrandmother);
  const maternalGrandmother = Boolean(input.maternalGrandmother);
  const fullBrothers = Math.max(0, input.fullBrothers || 0);
  const fullSisters = Math.max(0, input.fullSisters || 0);
  const paternalBrothers = Math.max(0, input.paternalBrothers || 0);
  const paternalSisters = Math.max(0, input.paternalSisters || 0);
  const uterineBrothers = Math.max(0, input.uterineBrothers || 0);
  const uterineSisters = Math.max(0, input.uterineSisters || 0);
  const totalSiblings = fullBrothers + fullSisters + paternalBrothers + paternalSisters + uterineBrothers + uterineSisters;

  // Track blocked heirs and reasons
  const blocked = [];

  // Paternal Grandfather blocked by Father
  let effectivePaternalGrandfather = false;
  if (paternalGrandfather) {
    if (father) {
      blocked.push({ heir: 'Paternal Grandfather', arabic: 'الجد الصحيح', reason: 'Blocked by Father (Al-Ab yajhub al-Jadd)' });
    } else {
      effectivePaternalGrandfather = true;
    }
  }

  // Grandmothers blocked by Mother
  // Paternal Grandmother also blocked by Father
  let effectivePaternalGrandmother = false;
  let effectiveMaternalGrandmother = false;

  if (paternalGrandmother) {
    if (mother) {
      blocked.push({ heir: 'Paternal Grandmother', arabic: 'الجدة لأب', reason: 'Blocked by Mother (Al-Umm tajhub al-Jaddah)' });
    } else if (father) {
      blocked.push({ heir: 'Paternal Grandmother', arabic: 'الجدة لأب', reason: 'Blocked by Father (as she connects through him)' });
    } else {
      effectivePaternalGrandmother = true;
    }
  }

  if (maternalGrandmother) {
    if (mother) {
      blocked.push({ heir: 'Maternal Grandmother', arabic: 'الجدة لأم', reason: 'Blocked by Mother (Al-Umm tajhub al-Jaddah)' });
    } else {
      effectiveMaternalGrandmother = true;
    }
  }

  // Full Brothers & Full Sisters blocked by: Father or Son (or Grandfather under simplified rule)
  let effectiveBrothers = fullBrothers;
  let effectiveSisters = fullSisters;
  if ((fullBrothers + fullSisters) > 0) {
    if (father) {
      blocked.push({ heir: 'Full Siblings', arabic: 'الإخوة الأشقاء', reason: 'Blocked by Father (Al-Ab yajhub al-Ikhwah)' });
      effectiveBrothers = 0;
      effectiveSisters = 0;
    } else if (sons > 0) {
      blocked.push({ heir: 'Full Siblings', arabic: 'الإخوة الأشقاء', reason: 'Blocked by Son (Al-Ibn yajhub al-Ikhwah)' });
      effectiveBrothers = 0;
      effectiveSisters = 0;
    } else if (effectivePaternalGrandfather) {
      blocked.push({ heir: 'Full Siblings', arabic: 'الإخوة الأشقاء', reason: 'Blocked by Grandfather (Jadd yajhub al-Ikhwah in Hanafi consensus)' });
      effectiveBrothers = 0;
      effectiveSisters = 0;
    }
  }

  // Paternal Siblings blocked by: Father, Son, Grandfather, Full Brother, or Full Sisters with daughters (Asabah)
  let effectivePaternalBrothers = paternalBrothers;
  let effectivePaternalSisters = paternalSisters;
  if ((paternalBrothers + paternalSisters) > 0) {
    if (father) {
      blocked.push({ heir: 'Paternal Siblings', arabic: 'الإخوة لأب', reason: 'Blocked by Father' });
      effectivePaternalBrothers = 0;
      effectivePaternalSisters = 0;
    } else if (sons > 0) {
      blocked.push({ heir: 'Paternal Siblings', arabic: 'الإخوة لأب', reason: 'Blocked by Son' });
      effectivePaternalBrothers = 0;
      effectivePaternalSisters = 0;
    } else if (effectivePaternalGrandfather) {
      blocked.push({ heir: 'Paternal Siblings', arabic: 'الإخوة لأب', reason: 'Blocked by Grandfather' });
      effectivePaternalBrothers = 0;
      effectivePaternalSisters = 0;
    } else if (effectiveBrothers > 0) {
      blocked.push({ heir: 'Paternal Siblings', arabic: 'الإخوة لأب', reason: 'Blocked by Full Brother (Al-Shaqiq yajhub al-Akh li-Ab)' });
      effectivePaternalBrothers = 0;
      effectivePaternalSisters = 0;
    } else if (daughters > 0 && effectiveSisters > 0) {
      blocked.push({ heir: 'Paternal Siblings', arabic: 'الإخوة لأب', reason: 'Blocked by Full Sister inheriting as Residuary with daughters' });
      effectivePaternalBrothers = 0;
      effectivePaternalSisters = 0;
    }
  }

  // Uterine Siblings blocked by: Children (descendants) or Male Ascendants (Father, Grandfather)
  let effectiveUterineBrothers = uterineBrothers;
  let effectiveUterineSisters = uterineSisters;
  const totalUterine = uterineBrothers + uterineSisters;
  if (totalUterine > 0) {
    if (hasChildren) {
      blocked.push({ heir: 'Uterine Siblings', arabic: 'الإخوة لأم', reason: 'Blocked by Children (Descendants)' });
      effectiveUterineBrothers = 0;
      effectiveUterineSisters = 0;
    } else if (father) {
      blocked.push({ heir: 'Uterine Siblings', arabic: 'الإخوة لأم', reason: 'Blocked by Father (Ascendant)' });
      effectiveUterineBrothers = 0;
      effectiveUterineSisters = 0;
    } else if (effectivePaternalGrandfather) {
      blocked.push({ heir: 'Uterine Siblings', arabic: 'الإخوة لأم', reason: 'Blocked by Paternal Grandfather' });
      effectiveUterineBrothers = 0;
      effectiveUterineSisters = 0;
    }
  }

  // Check Gharrawiyyan / Umariyyatan case:
  // Spouse + Father + Mother, NO children, NO effective siblings
  let isUmariyyatan = false;
  if (!hasChildren && effectiveBrothers === 0 && effectiveSisters === 0 && father && mother && (wivesCount > 0 || hasHusband)) {
    isUmariyyatan = true;
  }

  const heirs = [];

  // 1. Spouse
  if (wivesCount > 0) {
    const totalWifeShare = hasChildren ? new Fraction(1, 8) : new Fraction(1, 4);
    const eachWifeShare = totalWifeShare.div(wivesCount);
    heirs.push({
      id: 'wives',
      title: wivesCount === 1 ? 'Wife' : `Wives (${wivesCount})`,
      arabic: wivesCount === 1 ? 'الزوجة' : `الزوجات (${wivesCount})`,
      count: wivesCount,
      category: 'Zawil-Furud',
      isSpouse: true,
      rawFraction: totalWifeShare,
      eachRawFraction: eachWifeShare,
      verseCitation: 'Surah An-Nisa 4:12',
      rationale: hasChildren ? '1/8 due to existence of children (divided equally)' : '1/4 due to no children (divided equally)'
    });
  } else if (hasHusband) {
    const husbandShare = hasChildren ? new Fraction(1, 4) : new Fraction(1, 2);
    heirs.push({
      id: 'husband',
      title: 'Husband',
      arabic: 'الزوج',
      count: 1,
      category: 'Zawil-Furud',
      isSpouse: true,
      rawFraction: husbandShare,
      eachRawFraction: husbandShare,
      verseCitation: 'Surah An-Nisa 4:12',
      rationale: hasChildren ? '1/4 due to existence of children' : '1/2 due to no children'
    });
  }

  // 2. Mother
  if (mother) {
    if (isUmariyyatan) {
      const spouseFraction = hasHusband ? new Fraction(1, 2) : new Fraction(1, 4);
      const remainderAfterSpouse = new Fraction(1, 1).sub(spouseFraction);
      const motherShare = remainderAfterSpouse.mul(new Fraction(1, 3));
      heirs.push({
        id: 'mother',
        title: 'Mother',
        arabic: 'الأم',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: motherShare,
        eachRawFraction: motherShare,
        verseCitation: 'Surah An-Nisa 4:11 & Ijma (Al-Gharrawiyyan)',
        rationale: '1/3 of the remainder after spouse (Al-Umariyyatan consensus)'
      });
    } else {
      const motherShare = (hasChildren || totalSiblings >= 2) ? new Fraction(1, 6) : new Fraction(1, 3);
      heirs.push({
        id: 'mother',
        title: 'Mother',
        arabic: 'الأم',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: motherShare,
        eachRawFraction: motherShare,
        verseCitation: 'Surah An-Nisa 4:11',
        rationale: (hasChildren || totalSiblings >= 2)
          ? '1/6 due to presence of children or multiple siblings'
          : '1/3 due to absence of children and multiple siblings'
      });
    }
  }

  // 3. Grandmothers (if Mother is deceased)
  if (!mother && (effectivePaternalGrandmother || effectiveMaternalGrandmother)) {
    const grandmothersCount = (effectivePaternalGrandmother ? 1 : 0) + (effectiveMaternalGrandmother ? 1 : 0);
    const totalGrandmotherShare = new Fraction(1, 6);
    const eachGrandmotherShare = totalGrandmotherShare.div(grandmothersCount);

    if (effectiveMaternalGrandmother) {
      heirs.push({
        id: 'maternal_grandmother',
        title: 'Maternal Grandmother',
        arabic: 'الجدة لأم',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: eachGrandmotherShare,
        eachRawFraction: eachGrandmotherShare,
        verseCitation: 'Sunnah (Abu Dawud, Tirmidhi)',
        rationale: grandmothersCount === 2 ? '1/12 (shares 1/6 equally with Paternal Grandmother)' : '1/6 fixed share in absence of Mother'
      });
    }
    if (effectivePaternalGrandmother) {
      heirs.push({
        id: 'paternal_grandmother',
        title: 'Paternal Grandmother',
        arabic: 'الجدة لأب',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: eachGrandmotherShare,
        eachRawFraction: eachGrandmotherShare,
        verseCitation: 'Sunnah (Abu Dawud, Tirmidhi)',
        rationale: grandmothersCount === 2 ? '1/12 (shares 1/6 equally with Maternal Grandmother)' : '1/6 fixed share in absence of Mother & Father'
      });
    }
  }

  // 4. Daughters (when no sons)
  if (daughters > 0 && sons === 0) {
    const daughtersShare = daughters === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
    const eachDaughterShare = daughtersShare.div(daughters);
    heirs.push({
      id: 'daughters',
      title: daughters === 1 ? 'Daughter' : `Daughters (${daughters})`,
      arabic: daughters === 1 ? 'البنت' : `البنات (${daughters})`,
      count: daughters,
      category: 'Zawil-Furud',
      isSpouse: false,
      rawFraction: daughtersShare,
      eachRawFraction: eachDaughterShare,
      verseCitation: 'Surah An-Nisa 4:11',
      rationale: daughters === 1 ? '1/2 as single daughter without sons' : '2/3 shared equally among multiple daughters without sons'
    });
  }

  // 5. Father Fixed Share (1/6 if children exist)
  if (father) {
    if (sons > 0) {
      heirs.push({
        id: 'father',
        title: 'Father',
        arabic: 'الأب',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: new Fraction(1, 6),
        eachRawFraction: new Fraction(1, 6),
        verseCitation: 'Surah An-Nisa 4:11',
        rationale: '1/6 fixed share due to presence of male child (Son)'
      });
    } else if (daughters > 0) {
      heirs.push({
        id: 'father_fixed',
        title: 'Father (Fixed Share)',
        arabic: 'الأب (فرضاً)',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: new Fraction(1, 6),
        eachRawFraction: new Fraction(1, 6),
        verseCitation: 'Surah An-Nisa 4:11',
        rationale: '1/6 fixed share due to presence of female descendant'
      });
    }
  }

  // 6. Paternal Grandfather Fixed Share (if father deceased)
  if (effectivePaternalGrandfather) {
    if (sons > 0) {
      heirs.push({
        id: 'grandfather',
        title: 'Paternal Grandfather',
        arabic: 'الجد الصحيح',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: new Fraction(1, 6),
        eachRawFraction: new Fraction(1, 6),
        verseCitation: 'Sunnah & Qiyas on Father',
        rationale: '1/6 fixed share in absence of Father with male child'
      });
    } else if (daughters > 0) {
      heirs.push({
        id: 'grandfather_fixed',
        title: 'Paternal Grandfather (Fixed Share)',
        arabic: 'الجد (فرضاً)',
        count: 1,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: new Fraction(1, 6),
        eachRawFraction: new Fraction(1, 6),
        verseCitation: 'Sunnah & Qiyas on Father',
        rationale: '1/6 fixed share in absence of Father with female descendant'
      });
    }
  }

  // 7. Full Sisters Fixed Share (Kalalah: no children, no father, no grandfather, no brothers)
  if (!hasChildren && !father && !effectivePaternalGrandfather && effectiveBrothers === 0 && effectiveSisters > 0) {
    const sistersShare = effectiveSisters === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
    const eachSisterShare = sistersShare.div(effectiveSisters);
    heirs.push({
      id: 'sisters',
      title: effectiveSisters === 1 ? 'Full Sister' : `Full Sisters (${effectiveSisters})`,
      arabic: effectiveSisters === 1 ? 'الأخت الشقيقة' : `الأخوات الشقيقات (${effectiveSisters})`,
      count: effectiveSisters,
      category: 'Zawil-Furud',
      isSpouse: false,
      rawFraction: sistersShare,
      eachRawFraction: eachSisterShare,
      verseCitation: 'Surah An-Nisa 4:176',
      rationale: effectiveSisters === 1 ? '1/2 for single sister (Kalalah)' : '2/3 shared equally for multiple sisters (Kalalah)'
    });
  }

  // 8. Paternal Sisters Fixed Share (Kalalah: no children, no father, no grandfather, no full brother, no paternal brother)
  if (!hasChildren && !father && !effectivePaternalGrandfather && effectiveBrothers === 0 && effectivePaternalBrothers === 0 && effectivePaternalSisters > 0) {
    if (effectiveSisters === 0) {
      const pSistersShare = effectivePaternalSisters === 1 ? new Fraction(1, 2) : new Fraction(2, 3);
      const eachPSisterShare = pSistersShare.div(effectivePaternalSisters);
      heirs.push({
        id: 'paternal_sisters',
        title: effectivePaternalSisters === 1 ? 'Paternal Sister' : `Paternal Sisters (${effectivePaternalSisters})`,
        arabic: effectivePaternalSisters === 1 ? 'الأخت لأب' : `الأخوات لأب (${effectivePaternalSisters})`,
        count: effectivePaternalSisters,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: pSistersShare,
        eachRawFraction: eachPSisterShare,
        verseCitation: 'Surah An-Nisa 4:176',
        rationale: effectivePaternalSisters === 1 ? '1/2 for single paternal sister in absence of full siblings' : '2/3 shared equally for multiple paternal sisters'
      });
    } else if (effectiveSisters === 1) {
      // 1 Full Sister took 1/2 -> Paternal sister(s) take 1/6 (takmilatan li-thuluthayn)
      const pSistersShare = new Fraction(1, 6);
      const eachPSisterShare = pSistersShare.div(effectivePaternalSisters);
      heirs.push({
        id: 'paternal_sisters_takmilah',
        title: effectivePaternalSisters === 1 ? 'Paternal Sister' : `Paternal Sisters (${effectivePaternalSisters})`,
        arabic: effectivePaternalSisters === 1 ? 'الأخت لأب' : `الأخوات لأب (${effectivePaternalSisters})`,
        count: effectivePaternalSisters,
        category: 'Zawil-Furud',
        isSpouse: false,
        rawFraction: pSistersShare,
        eachRawFraction: eachPSisterShare,
        verseCitation: 'Surah An-Nisa 4:176 & Sunnah',
        rationale: '1/6 to complete two-thirds alongside single full sister (Takmilatan li-thuluthayn)'
      });
    }
  }

  // 9. Uterine Siblings (Ashab al-Furud: Kalalah without children or male ascendants)
  const effectiveTotalUterine = effectiveUterineBrothers + effectiveUterineSisters;
  if (effectiveTotalUterine > 0 && !hasChildren && !father && !effectivePaternalGrandfather) {
    const uterineShare = effectiveTotalUterine === 1 ? new Fraction(1, 6) : new Fraction(1, 3);
    const eachUterineShare = uterineShare.div(effectiveTotalUterine);
    heirs.push({
      id: 'uterine_siblings',
      title: effectiveTotalUterine === 1 ? 'Uterine Sibling' : `Uterine Siblings (${effectiveTotalUterine})`,
      arabic: effectiveTotalUterine === 1 ? 'الأخ / الأخت لأم' : `الإخوة لأم (${effectiveTotalUterine})`,
      count: effectiveTotalUterine,
      category: 'Zawil-Furud',
      isSpouse: false,
      rawFraction: uterineShare,
      eachRawFraction: eachUterineShare,
      verseCitation: 'Surah An-Nisa 4:12',
      rationale: effectiveTotalUterine === 1 ? '1/6 for a single uterine sibling (male or female)' : '1/3 shared equally between males and females (Quran 4:12)'
    });
  }

  // Sum of fixed shares
  let sumFixed = new Fraction(0, 1);
  for (const h of heirs) {
    sumFixed = sumFixed.add(h.rawFraction);
  }

  // Determine Asabah (Residuaries)
  let asabahType = null;
  if (sons > 0) {
    asabahType = 'sons_and_daughters';
  } else if (father) {
    asabahType = 'father';
  } else if (effectivePaternalGrandfather) {
    asabahType = 'grandfather';
  } else if (daughters > 0 && effectiveSisters > 0 && effectiveBrothers === 0) {
    asabahType = 'sisters_with_daughters';
  } else if (!hasChildren && !father && !effectivePaternalGrandfather && effectiveBrothers > 0) {
    asabahType = 'brothers_and_sisters';
  } else if (!hasChildren && !father && !effectivePaternalGrandfather && effectiveBrothers === 0 && effectiveSisters === 0 && effectivePaternalBrothers > 0) {
    asabahType = 'paternal_brothers_and_sisters';
  } else if (daughters > 0 && effectiveSisters === 0 && effectiveBrothers === 0 && effectivePaternalSisters > 0 && effectivePaternalBrothers === 0) {
    asabahType = 'paternal_sisters_with_daughters';
  }

  let state = 'exact'; // 'exact' | 'awl' | 'radd' | 'asabah_distribution'
  let aslAlMasalah = 0;
  let awlRoot = null;

  // Classical Asl al-Mas'alah (Base LCM)
  let baseLcm = 1;
  for (const h of heirs) {
    baseLcm = lcm(baseLcm, h.rawFraction.den);
  }
  aslAlMasalah = baseLcm;

  const one = new Fraction(1, 1);

  if (asabahType) {
    if (sumFixed.toNumber() < 1) {
      const residue = one.sub(sumFixed);
      state = 'asabah_distribution';

      if (asabahType === 'sons_and_daughters') {
        const totalUnits = (sons * 2) + daughters;
        const unitFraction = residue.div(totalUnits);
        const sonShare = unitFraction.mul(2);
        const totalSonsShare = sonShare.mul(sons);

        heirs.push({
          id: 'sons',
          title: sons === 1 ? 'Son' : `Sons (${sons})`,
          arabic: sons === 1 ? 'الابن' : `الأبناء (${sons})`,
          count: sons,
          category: 'Asabah (Residuary)',
          isSpouse: false,
          rawFraction: totalSonsShare,
          eachRawFraction: sonShare,
          verseCitation: 'Surah An-Nisa 4:11 & Bukhari 6732',
          rationale: 'Residuary (Asabah bi-nafsihi), takes remainder with 2:1 ratio over daughters'
        });

        if (daughters > 0) {
          const daughterShare = unitFraction;
          const totalDaughtersShare = daughterShare.mul(daughters);
          heirs.push({
            id: 'daughters_asabah',
            title: daughters === 1 ? 'Daughter' : `Daughters (${daughters})`,
            arabic: daughters === 1 ? 'البنت' : `البنات (${daughters})`,
            count: daughters,
            category: 'Asabah bi-ghayriha',
            isSpouse: false,
            rawFraction: totalDaughtersShare,
            eachRawFraction: daughterShare,
            verseCitation: 'Surah An-Nisa 4:11',
            rationale: 'Residuary through brother (2:1 ratio: male takes share of two females)'
          });
        }
      } else if (asabahType === 'father') {
        if (daughters > 0) {
          heirs.push({
            id: 'father_residue',
            title: 'Father (Residue / Ta\'seeb)',
            arabic: 'الأب (تعصيباً)',
            count: 1,
            category: 'Asabah (Residuary)',
            isSpouse: false,
            rawFraction: residue,
            eachRawFraction: residue,
            verseCitation: 'Surah An-Nisa 4:11 & Bukhari 6732',
            rationale: 'Takes remainder as Asabah in addition to 1/6 fixed share because only female descendants exist'
          });
        } else {
          heirs.push({
            id: 'father',
            title: 'Father',
            arabic: 'الأب',
            count: 1,
            category: 'Asabah (Residuary)',
            isSpouse: false,
            rawFraction: residue,
            eachRawFraction: residue,
            verseCitation: 'Surah An-Nisa 4:11 & Bukhari 6732',
            rationale: isUmariyyatan ? 'Remaining 2/3 of remainder after spouse' : 'Residuary (Asabah bi-nafsihi) taking all remaining estate'
          });
        }
      } else if (asabahType === 'grandfather') {
        if (daughters > 0) {
          heirs.push({
            id: 'grandfather_residue',
            title: 'Paternal Grandfather (Residue / Ta\'seeb)',
            arabic: 'الجد (تعصيباً)',
            count: 1,
            category: 'Asabah (Residuary)',
            isSpouse: false,
            rawFraction: residue,
            eachRawFraction: residue,
            verseCitation: 'Sunnah & Qiyas on Father',
            rationale: 'Takes remainder as Asabah in addition to 1/6 fixed share'
          });
        } else {
          heirs.push({
            id: 'grandfather',
            title: 'Paternal Grandfather',
            arabic: 'الجد الصحيح',
            count: 1,
            category: 'Asabah (Residuary)',
            isSpouse: false,
            rawFraction: residue,
            eachRawFraction: residue,
            verseCitation: 'Sunnah & Qiyas on Father',
            rationale: 'Residuary taking all remaining estate in absence of Father'
          });
        }
      } else if (asabahType === 'sisters_with_daughters') {
        const eachSisterShare = residue.div(effectiveSisters);
        heirs.push({
          id: 'sisters_asabah',
          title: effectiveSisters === 1 ? 'Full Sister' : `Full Sisters (${effectiveSisters})`,
          arabic: effectiveSisters === 1 ? 'الأخت الشقيقة' : `الأخوات الشقيقات (${effectiveSisters})`,
          count: effectiveSisters,
          category: 'Asabah ma\'a ghayriha',
          isSpouse: false,
          rawFraction: residue,
          eachRawFraction: eachSisterShare,
          verseCitation: 'Sahih al-Bukhari 6736',
          rationale: 'Residuary with daughters ("Make sisters residuaries with daughters")'
        });
      } else if (asabahType === 'brothers_and_sisters') {
        const totalUnits = (effectiveBrothers * 2) + effectiveSisters;
        const unitFraction = residue.div(totalUnits);
        const brotherShare = unitFraction.mul(2);
        const totalBrothersShare = brotherShare.mul(effectiveBrothers);

        heirs.push({
          id: 'brothers',
          title: effectiveBrothers === 1 ? 'Full Brother' : `Full Brothers (${effectiveBrothers})`,
          arabic: effectiveBrothers === 1 ? 'الأخ الشقيق' : `الإخوة الأشقاء (${effectiveBrothers})`,
          count: effectiveBrothers,
          category: 'Asabah (Residuary)',
          isSpouse: false,
          rawFraction: totalBrothersShare,
          eachRawFraction: brotherShare,
          verseCitation: 'Surah An-Nisa 4:176',
          rationale: 'Residuary (Asabah bi-nafsihi) taking remainder (Kalalah)'
        });

        if (effectiveSisters > 0) {
          const sisterShare = unitFraction;
          const totalSistersShare = sisterShare.mul(effectiveSisters);
          heirs.push({
            id: 'sisters_with_brothers',
            title: effectiveSisters === 1 ? 'Full Sister' : `Full Sisters (${effectiveSisters})`,
            arabic: effectiveSisters === 1 ? 'الأخت الشقيقة' : `الأخوات الشقيقات (${effectiveSisters})`,
            count: effectiveSisters,
            category: 'Asabah bi-ghayriha',
            isSpouse: false,
            rawFraction: totalSistersShare,
            eachRawFraction: sisterShare,
            verseCitation: 'Surah An-Nisa 4:176',
            rationale: 'Residuary through brother (2:1 ratio for male over female)'
          });
        }
      } else if (asabahType === 'paternal_brothers_and_sisters') {
        const totalUnits = (effectivePaternalBrothers * 2) + effectivePaternalSisters;
        const unitFraction = residue.div(totalUnits);
        const brotherShare = unitFraction.mul(2);
        const totalPBrothersShare = brotherShare.mul(effectivePaternalBrothers);

        heirs.push({
          id: 'paternal_brothers',
          title: effectivePaternalBrothers === 1 ? 'Paternal Brother' : `Paternal Brothers (${effectivePaternalBrothers})`,
          arabic: effectivePaternalBrothers === 1 ? 'الأخ لأب' : `الإخوة لأب (${effectivePaternalBrothers})`,
          count: effectivePaternalBrothers,
          category: 'Asabah (Residuary)',
          isSpouse: false,
          rawFraction: totalPBrothersShare,
          eachRawFraction: brotherShare,
          verseCitation: 'Surah An-Nisa 4:176 & Bukhari 6732',
          rationale: 'Residuary (Asabah bi-nafsihi) in absence of full siblings'
        });

        if (effectivePaternalSisters > 0) {
          const sisterShare = unitFraction;
          const totalPSistersShare = sisterShare.mul(effectivePaternalSisters);
          heirs.push({
            id: 'paternal_sisters_with_brothers',
            title: effectivePaternalSisters === 1 ? 'Paternal Sister' : `Paternal Sisters (${effectivePaternalSisters})`,
            arabic: effectivePaternalSisters === 1 ? 'الأخت لأب' : `الأخوات لأب (${effectivePaternalSisters})`,
            count: effectivePaternalSisters,
            category: 'Asabah bi-ghayriha',
            isSpouse: false,
            rawFraction: totalPSistersShare,
            eachRawFraction: sisterShare,
            verseCitation: 'Surah An-Nisa 4:176',
            rationale: 'Residuary through paternal brother (2:1 ratio)'
          });
        }
      } else if (asabahType === 'paternal_sisters_with_daughters') {
        const eachSisterShare = residue.div(effectivePaternalSisters);
        heirs.push({
          id: 'paternal_sisters_asabah',
          title: effectivePaternalSisters === 1 ? 'Paternal Sister' : `Paternal Sisters (${effectivePaternalSisters})`,
          arabic: effectivePaternalSisters === 1 ? 'الأخت لأب' : `الأخوات لأب (${effectivePaternalSisters})`,
          count: effectivePaternalSisters,
          category: 'Asabah ma\'a ghayriha',
          isSpouse: false,
          rawFraction: residue,
          eachRawFraction: eachSisterShare,
          verseCitation: 'Sahih al-Bukhari 6736 & Qiyas',
          rationale: 'Residuary with daughters in absence of full sisters'
        });
      }

      for (const h of heirs) {
        h.finalFraction = h.rawFraction;
        h.eachFinalFraction = h.eachRawFraction;
      }
    } else if (sumFixed.toNumber() === 1) {
      state = 'exact';
      for (const h of heirs) {
        h.finalFraction = h.rawFraction;
        h.eachFinalFraction = h.eachRawFraction;
      }
    } else {
      // sumFixed > 1 -> Awl
      state = 'awl';
      let totalNumerator = 0;
      for (const h of heirs) {
        totalNumerator += h.rawFraction.num * (aslAlMasalah / h.rawFraction.den);
      }
      awlRoot = totalNumerator;

      for (const h of heirs) {
        h.finalFraction = h.rawFraction.div(sumFixed);
        h.eachFinalFraction = h.finalFraction.div(h.count);
      }
    }
  } else {
    // No Asabah exists!
    if (sumFixed.toNumber() === 1) {
      state = 'exact';
      for (const h of heirs) {
        h.finalFraction = h.rawFraction;
        h.eachFinalFraction = h.eachRawFraction;
      }
    } else if (sumFixed.toNumber() > 1) {
      state = 'awl';
      let totalNumerator = 0;
      for (const h of heirs) {
        totalNumerator += h.rawFraction.num * (aslAlMasalah / h.rawFraction.den);
      }
      awlRoot = totalNumerator;

      for (const h of heirs) {
        h.finalFraction = h.rawFraction.div(sumFixed);
        h.eachFinalFraction = h.finalFraction.div(h.count);
      }
    } else {
      // sumFixed < 1 -> Radd!
      state = 'radd';
      const spouseHeir = heirs.find(h => h.isSpouse);
      const bloodHeirs = heirs.filter(h => !h.isSpouse);

      if (bloodHeirs.length > 0) {
        if (spouseHeir) {
          spouseHeir.finalFraction = spouseHeir.rawFraction;
          spouseHeir.eachFinalFraction = spouseHeir.finalFraction.div(spouseHeir.count);

          const distributableToBlood = one.sub(spouseHeir.rawFraction);

          let sumBlood = new Fraction(0, 1);
          for (const bh of bloodHeirs) {
            sumBlood = sumBlood.add(bh.rawFraction);
          }

          for (const bh of bloodHeirs) {
            const ratio = bh.rawFraction.div(sumBlood);
            bh.finalFraction = distributableToBlood.mul(ratio);
            bh.eachFinalFraction = bh.finalFraction.div(bh.count);
          }
        } else {
          for (const bh of bloodHeirs) {
            bh.finalFraction = bh.rawFraction.div(sumFixed);
            bh.eachFinalFraction = bh.finalFraction.div(bh.count);
          }
        }
      } else {
        if (spouseHeir) {
          spouseHeir.finalFraction = new Fraction(1, 1);
          spouseHeir.eachFinalFraction = spouseHeir.finalFraction.div(spouseHeir.count);
          spouseHeir.rationale += ' (Whole estate awarded under Radd to sole surviving spouse)';
        }
      }
    }
  }

  // Calculate cash amounts and percentages
  for (const h of heirs) {
    const totalFraction = h.finalFraction || h.rawFraction;
    const eachFraction = h.eachFinalFraction || (h.finalFraction ? h.finalFraction.div(h.count) : h.eachRawFraction);

    h.percentage = (totalFraction.toNumber() * 100);
    h.totalAmount = totalFraction.toNumber() * distributable;
    h.eachAmount = eachFraction.toNumber() * distributable;
    h.fractionStr = totalFraction.toString();
    h.eachFractionStr = eachFraction.toString();
  }

  return {
    status: 'success',
    gross,
    funeral,
    debts,
    netAfterDebts,
    wasiyyah,
    wasiyyahExceeded,
    maxWasiyyahAllowed,
    distributable,
    state,
    aslAlMasalah,
    awlRoot,
    isUmariyyatan,
    heirs,
    blocked
  };
}

// ==========================================
// 5. CHART.JS VISUAL ENGINE
// ==========================================

let faraidChart = null;

const CHART_PALETTE = [
  '#059669', // Emerald
  '#d97706', // Gold / Amber
  '#0284c7', // Sky blue
  '#7c3aed', // Purple
  '#e11d48', // Rose
  '#0d9488', // Teal
  '#ea580c', // Orange
  '#4f46e5', // Indigo
  '#10b981', // Mint
  '#ca8a04', // Dark Gold
  '#2563eb'  // Royal Blue
];

function updateChart(heirs, distributable) {
  const canvas = document.getElementById('estate-donut-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (faraidChart) {
    faraidChart.destroy();
  }

  if (!heirs || heirs.length === 0) {
    // Render empty placeholder chart
    faraidChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['No Heirs'],
        datasets: [{
          data: [1],
          backgroundColor: ['#334155'],
          borderColor: '#1e293b',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        cutout: '72%'
      }
    });
    return;
  }

  const labels = heirs.map(h => `${h.title} (${h.fractionStr})`);
  const data = heirs.map(h => Number(h.percentage.toFixed(2)));
  const bgColors = heirs.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]);

  faraidChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgColors,
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#cbd5e1',
            font: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#fbbf24',
          bodyColor: '#f8fafc',
          borderColor: '#059669',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const heir = heirs[context.dataIndex];
              return [
                ` Share: ${heir.fractionStr} (${heir.percentage.toFixed(2)}%)`,
                ` Amount: ${formatMoney(heir.totalAmount)}`,
                heir.count > 1 ? ` Each (${heir.count}): ${formatMoney(heir.eachAmount)}` : null
              ].filter(Boolean);
            }
          }
        }
      },
      cutout: '70%',
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 800
      }
    }
  });
}

// ==========================================
// 6. UI CONTROLLER & EVENT LISTENERS
// ==========================================

const PRESETS = {
  standard: {
    name: 'Standard Family',
    desc: 'Husband deceased, Wife + 2 Sons + 1 Daughter ($120,000 net)',
    data: {
      gender: 'male',
      grossEstate: 120000,
      funeral: 2000,
      debts: 3000,
      wasiyyah: 5000,
      wivesCount: 1,
      husband: false,
      sons: 2,
      daughters: 1,
      father: false,
      mother: false,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 0,
      fullSisters: 0
    }
  },
  awl_classic: {
    name: "Classic Awl (Umar RA)",
    desc: "Wife deceased, Husband + Mother + 2 Full Sisters (Base 6 -> Awl 8)",
    data: {
      gender: 'female',
      grossEstate: 80000,
      funeral: 1000,
      debts: 0,
      wasiyyah: 0,
      wivesCount: 0,
      husband: true,
      sons: 0,
      daughters: 0,
      father: false,
      mother: true,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 0,
      fullSisters: 2
    }
  },
  minbariyyah: {
    name: "Al-Minbariyyah (Ali RA)",
    desc: "Husband deceased, Wife + 2 Daughters + Father + Mother (Base 24 -> Awl 27)",
    data: {
      gender: 'male',
      grossEstate: 108000,
      funeral: 0,
      debts: 0,
      wasiyyah: 0,
      wivesCount: 1,
      husband: false,
      sons: 0,
      daughters: 2,
      father: true,
      mother: true,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 0,
      fullSisters: 0
    }
  },
  gharrawiyyan: {
    name: "Al-Gharrawiyyan (Umariyyatan)",
    desc: "Wife deceased, Husband + Father + Mother (Mother gets 1/3 of Remainder)",
    data: {
      gender: 'female',
      grossEstate: 90000,
      funeral: 0,
      debts: 0,
      wasiyyah: 0,
      wivesCount: 0,
      husband: true,
      sons: 0,
      daughters: 0,
      father: true,
      mother: true,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 0,
      fullSisters: 0
    }
  },
  daughters_father: {
    name: "Only Daughters + Father",
    desc: "Wife + 2 Daughters + Father (Father receives 1/6 fixed + residue)",
    data: {
      gender: 'male',
      grossEstate: 96000,
      funeral: 1000,
      debts: 2000,
      wasiyyah: 0,
      wivesCount: 1,
      husband: false,
      sons: 0,
      daughters: 2,
      father: true,
      mother: false,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 0,
      fullSisters: 0
    }
  },
  kalalah: {
    name: "Kalalah (Brothers & Sisters)",
    desc: "Deceased leaves no children and no father: 1 Full Brother + 2 Full Sisters",
    data: {
      gender: 'male',
      grossEstate: 60000,
      funeral: 1000,
      debts: 0,
      wasiyyah: 0,
      wivesCount: 0,
      husband: false,
      sons: 0,
      daughters: 0,
      father: false,
      mother: false,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 1,
      fullSisters: 2
    }
  },
  radd_sample: {
    name: "Radd Surplus (Mother & Daughter)",
    desc: "Mother + 1 Daughter (Surplus 2/6 returned proportionally: 1/4 and 3/4)",
    data: {
      gender: 'male',
      grossEstate: 40000,
      funeral: 0,
      debts: 0,
      wasiyyah: 0,
      wivesCount: 0,
      husband: false,
      sons: 0,
      daughters: 1,
      father: false,
      mother: true,
      paternalGrandfather: false,
      paternalGrandmother: false,
      maternalGrandmother: false,
      fullBrothers: 0,
      fullSisters: 0
    }
  }
};

// Current App State
let appState = {
  gender: 'male',
  grossEstate: 100000,
  funeral: 2000,
  debts: 3000,
  wasiyyah: 5000,
  wivesCount: 1,
  husband: false,
  sons: 2,
  daughters: 1,
  father: false,
  mother: false,
  paternalGrandfather: false,
  paternalGrandmother: false,
  maternalGrandmother: false,
  fullBrothers: 0,
  fullSisters: 0,
  paternalBrothers: 0,
  paternalSisters: 0,
  uterineBrothers: 0,
  uterineSisters: 0
};

// Global Calculation Result Cache
let currentCalcResult = null;

function readFormInputs() {
  const gender = document.querySelector('input[name="deceased_gender"]:checked')?.value || 'male';
  const grossEstate = parseFloat(document.getElementById('input_gross_estate')?.value) || 0;
  const funeral = parseFloat(document.getElementById('input_funeral')?.value) || 0;
  const debts = parseFloat(document.getElementById('input_debts')?.value) || 0;
  const wasiyyah = parseFloat(document.getElementById('input_wasiyyah')?.value) || 0;

  const wivesCount = gender === 'male' ? parseInt(document.getElementById('input_wives')?.value || '1', 10) : 0;
  const husband = gender === 'female' ? document.getElementById('input_husband')?.checked : false;

  const sons = parseInt(document.getElementById('input_sons')?.value || '0', 10);
  const daughters = parseInt(document.getElementById('input_daughters')?.value || '0', 10);

  const father = document.getElementById('input_father')?.checked || false;
  const mother = document.getElementById('input_mother')?.checked || false;

  const paternalGrandfather = document.getElementById('input_p_grandfather')?.checked || false;
  const paternalGrandmother = document.getElementById('input_p_grandmother')?.checked || false;
  const maternalGrandmother = document.getElementById('input_m_grandmother')?.checked || false;

  const fullBrothers = parseInt(document.getElementById('input_full_brothers')?.value || '0', 10);
  const fullSisters = parseInt(document.getElementById('input_full_sisters')?.value || '0', 10);

  const paternalBrothers = parseInt(document.getElementById('input_paternal_brothers')?.value || '0', 10);
  const paternalSisters = parseInt(document.getElementById('input_paternal_sisters')?.value || '0', 10);
  const uterineBrothers = parseInt(document.getElementById('input_uterine_brothers')?.value || '0', 10);
  const uterineSisters = parseInt(document.getElementById('input_uterine_sisters')?.value || '0', 10);

  return {
    gender,
    grossEstate,
    funeral,
    debts,
    wasiyyah,
    wivesCount,
    husband,
    sons,
    daughters,
    father,
    mother,
    paternalGrandfather,
    paternalGrandmother,
    maternalGrandmother,
    fullBrothers,
    fullSisters,
    paternalBrothers,
    paternalSisters,
    uterineBrothers,
    uterineSisters
  };
}

function writeFormInputs(data) {
  appState = { ...data };

  // Set gender radio
  const genderRadio = document.querySelector(`input[name="deceased_gender"][value="${data.gender}"]`);
  if (genderRadio) genderRadio.checked = true;

  // Set numeric estate inputs
  const grossEl = document.getElementById('input_gross_estate');
  if (grossEl) grossEl.value = data.grossEstate;

  const funeralEl = document.getElementById('input_funeral');
  if (funeralEl) funeralEl.value = data.funeral;

  const debtsEl = document.getElementById('input_debts');
  if (debtsEl) debtsEl.value = data.debts;

  const wasiyyahEl = document.getElementById('input_wasiyyah');
  if (wasiyyahEl) wasiyyahEl.value = data.wasiyyah;

  // Set wives / husband
  const wivesEl = document.getElementById('input_wives');
  if (wivesEl) wivesEl.value = data.wivesCount;

  const husbandEl = document.getElementById('input_husband');
  if (husbandEl) husbandEl.checked = Boolean(data.husband);

  // Set children
  const sonsEl = document.getElementById('input_sons');
  if (sonsEl) sonsEl.value = data.sons;

  const daughtersEl = document.getElementById('input_daughters');
  if (daughtersEl) daughtersEl.value = data.daughters;

  // Set parents
  const fatherEl = document.getElementById('input_father');
  if (fatherEl) fatherEl.checked = Boolean(data.father);

  const motherEl = document.getElementById('input_mother');
  if (motherEl) motherEl.checked = Boolean(data.mother);

  // Set secondary
  const pGrandfatherEl = document.getElementById('input_p_grandfather');
  if (pGrandfatherEl) pGrandfatherEl.checked = Boolean(data.paternalGrandfather);

  const pGrandmotherEl = document.getElementById('input_p_grandmother');
  if (pGrandmotherEl) pGrandmotherEl.checked = Boolean(data.paternalGrandmother);

  const mGrandmotherEl = document.getElementById('input_m_grandmother');
  if (mGrandmotherEl) mGrandmotherEl.checked = Boolean(data.maternalGrandmother);

  const brothersEl = document.getElementById('input_full_brothers');
  if (brothersEl) brothersEl.value = data.fullBrothers || 0;

  const sistersEl = document.getElementById('input_full_sisters');
  if (sistersEl) sistersEl.value = data.fullSisters || 0;

  const pBrothersEl = document.getElementById('input_paternal_brothers');
  if (pBrothersEl) pBrothersEl.value = data.paternalBrothers || 0;

  const pSistersEl = document.getElementById('input_paternal_sisters');
  if (pSistersEl) pSistersEl.value = data.paternalSisters || 0;

  const uBrothersEl = document.getElementById('input_uterine_brothers');
  if (uBrothersEl) uBrothersEl.value = data.uterineBrothers || 0;

  const uSistersEl = document.getElementById('input_uterine_sisters');
  if (uSistersEl) uSistersEl.value = data.uterineSisters || 0;

  updateGenderVisibility();
  triggerRecalculate();
}

function updateGenderVisibility() {
  const gender = document.querySelector('input[name="deceased_gender"]:checked')?.value || 'male';
  const maleCard = document.getElementById('gender-card-male');
  const femaleCard = document.getElementById('gender-card-female');
  const wivesSection = document.getElementById('section-wives');
  const husbandSection = document.getElementById('section-husband');

  if (gender === 'male') {
    maleCard?.classList.add('border-emerald-500', 'bg-emerald-950/40', 'ring-2', 'ring-emerald-500/50');
    maleCard?.classList.remove('border-slate-700', 'bg-slate-800/40');
    femaleCard?.classList.remove('border-emerald-500', 'bg-emerald-950/40', 'ring-2', 'ring-emerald-500/50');
    femaleCard?.classList.add('border-slate-700', 'bg-slate-800/40');

    wivesSection?.classList.remove('hidden');
    husbandSection?.classList.add('hidden');
  } else {
    femaleCard?.classList.add('border-emerald-500', 'bg-emerald-950/40', 'ring-2', 'ring-emerald-500/50');
    femaleCard?.classList.remove('border-slate-700', 'bg-slate-800/40');
    maleCard?.classList.remove('border-emerald-500', 'bg-emerald-950/40', 'ring-2', 'ring-emerald-500/50');
    maleCard?.classList.add('border-slate-700', 'bg-slate-800/40');

    husbandSection?.classList.remove('hidden');
    wivesSection?.classList.add('hidden');
  }
}

function updateBlockingBadges(input) {
  const fatherAlive = Boolean(input.father);
  const motherAlive = Boolean(input.mother);
  const sonsAlive = input.sons > 0;
  const pGrandfatherAlive = !fatherAlive && Boolean(input.paternalGrandfather);

  // Grandfather badge
  const gFatherBadge = document.getElementById('badge-p-grandfather');
  if (gFatherBadge) {
    if (fatherAlive) {
      gFatherBadge.classList.remove('hidden');
      gFatherBadge.innerText = 'Blocked by Father';
    } else {
      gFatherBadge.classList.add('hidden');
    }
  }

  // Paternal Grandmother badge
  const pGMotherBadge = document.getElementById('badge-p-grandmother');
  if (pGMotherBadge) {
    if (motherAlive) {
      pGMotherBadge.classList.remove('hidden');
      pGMotherBadge.innerText = 'Blocked by Mother';
    } else if (fatherAlive) {
      pGMotherBadge.classList.remove('hidden');
      pGMotherBadge.innerText = 'Blocked by Father';
    } else {
      pGMotherBadge.classList.add('hidden');
    }
  }

  // Maternal Grandmother badge
  const mGMotherBadge = document.getElementById('badge-m-grandmother');
  if (mGMotherBadge) {
    if (motherAlive) {
      mGMotherBadge.classList.remove('hidden');
      mGMotherBadge.innerText = 'Blocked by Mother';
    } else {
      mGMotherBadge.classList.add('hidden');
    }
  }

  // Full Siblings badges
  const siblingsBadge = document.getElementById('badge-siblings');
  if (siblingsBadge) {
    if (fatherAlive) {
      siblingsBadge.classList.remove('hidden');
      siblingsBadge.innerText = 'Blocked by Father';
    } else if (sonsAlive) {
      siblingsBadge.classList.remove('hidden');
      siblingsBadge.innerText = 'Blocked by Son';
    } else if (pGrandfatherAlive) {
      siblingsBadge.classList.remove('hidden');
      siblingsBadge.innerText = 'Blocked by Grandfather';
    } else {
      siblingsBadge.classList.add('hidden');
    }
  }

  // Paternal Siblings badges
  const pSiblingsBadge = document.getElementById('badge-p-siblings');
  if (pSiblingsBadge) {
    if (fatherAlive) {
      pSiblingsBadge.classList.remove('hidden');
      pSiblingsBadge.innerText = 'Blocked by Father';
    } else if (sonsAlive) {
      pSiblingsBadge.classList.remove('hidden');
      pSiblingsBadge.innerText = 'Blocked by Son';
    } else if (pGrandfatherAlive) {
      pSiblingsBadge.classList.remove('hidden');
      pSiblingsBadge.innerText = 'Blocked by Grandfather';
    } else if (input.fullBrothers > 0) {
      pSiblingsBadge.classList.remove('hidden');
      pSiblingsBadge.innerText = 'Blocked by Full Brother';
    } else if (input.daughters > 0 && input.fullSisters > 0) {
      pSiblingsBadge.classList.remove('hidden');
      pSiblingsBadge.innerText = 'Blocked by Full Sister (with Daughters)';
    } else {
      pSiblingsBadge.classList.add('hidden');
    }
  }

  // Uterine Siblings badges
  const uSiblingsBadge = document.getElementById('badge-u-siblings');
  if (uSiblingsBadge) {
    if (input.sons > 0 || input.daughters > 0) {
      uSiblingsBadge.classList.remove('hidden');
      uSiblingsBadge.innerText = 'Blocked by Children';
    } else if (fatherAlive) {
      uSiblingsBadge.classList.remove('hidden');
      uSiblingsBadge.innerText = 'Blocked by Father';
    } else if (pGrandfatherAlive) {
      uSiblingsBadge.classList.remove('hidden');
      uSiblingsBadge.innerText = 'Blocked by Grandfather';
    } else {
      uSiblingsBadge.classList.add('hidden');
    }
  }
}

function triggerRecalculate() {
  const input = readFormInputs();
  updateBlockingBadges(input);

  const result = calculateFaraid(input);
  currentCalcResult = result;

  renderEstateDeductions(result);
  renderResultsSummary(result);
  renderHeirsTable(result);
  renderBlockedAlert(result);
  updateChart(result.heirs, result.distributable);
}

function renderEstateDeductions(result) {
  // Update currency labels
  document.querySelectorAll('.curr-symbol').forEach(el => {
    el.innerText = CURRENCIES[currentCurrency].symbol;
  });

  const netAfterDebtsEl = document.getElementById('disp-net-after-debts');
  if (netAfterDebtsEl) netAfterDebtsEl.innerText = formatMoney(result.netAfterDebts);

  const distributableEl = document.getElementById('disp-distributable');
  if (distributableEl) distributableEl.innerText = formatMoney(result.distributable);

  const maxWasiyyahEl = document.getElementById('disp-max-wasiyyah');
  if (maxWasiyyahEl) maxWasiyyahEl.innerText = formatMoney(result.maxWasiyyahAllowed);

  const wasiyyahWarningEl = document.getElementById('wasiyyah-warning');
  if (wasiyyahWarningEl) {
    if (result.wasiyyahExceeded) {
      wasiyyahWarningEl.classList.remove('hidden');
      wasiyyahWarningEl.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation text-amber-400 mr-1.5"></i>
        <span>Bequest was capped at 1/3 (${formatMoney(result.maxWasiyyahAllowed)}) per Sunnah guidelines. Excess requires approval of all legal heirs.</span>
      `;
    } else {
      wasiyyahWarningEl.classList.add('hidden');
    }
  }
}

function renderResultsSummary(result) {
  const badgeStateEl = document.getElementById('disp-case-badge');
  const caseTitleEl = document.getElementById('disp-case-title');
  const caseDescEl = document.getElementById('disp-case-desc');
  const baseLcmEl = document.getElementById('disp-base-lcm');

  if (result.status === 'exhausted') {
    if (badgeStateEl) {
      badgeStateEl.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-rose-900/60 text-rose-300 border border-rose-700/50';
      badgeStateEl.innerText = 'Estate Exhausted';
    }
    if (caseTitleEl) caseTitleEl.innerText = 'Debts & Obligations Exhaust Estate';
    if (caseDescEl) caseDescEl.innerText = 'Under Sharia rules, debts to creditors and funeral costs take priority over inheritance. No residual funds remain for distribution.';
    if (baseLcmEl) baseLcmEl.innerText = '-';
    return;
  }

  if (result.isUmariyyatan) {
    if (badgeStateEl) {
      badgeStateEl.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-600/50';
      badgeStateEl.innerText = 'Al-Gharrawiyyan / Umariyyatan';
    }
    if (caseTitleEl) caseTitleEl.innerText = 'Consensus Ruling of Umar RA';
    if (caseDescEl) caseDescEl.innerText = 'Spouse takes Quranic share. Mother receives 1/3 of remainder so Father retains the 2:1 ratio prescribed by divine wisdom.';
    if (baseLcmEl) baseLcmEl.innerText = `${result.aslAlMasalah}`;
    return;
  }

  if (result.state === 'awl') {
    if (badgeStateEl) {
      badgeStateEl.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-600/50';
      badgeStateEl.innerText = `Al-Awl (Base ${result.aslAlMasalah} → ${result.awlRoot})`;
    }
    if (caseTitleEl) caseTitleEl.innerText = 'Proportional Reduction (Al-Awl)';
    if (caseDescEl) caseDescEl.innerText = `The sum of Quranic fixed shares exceeded 100%. As established by the Sahaba, the denominator expands from ${result.aslAlMasalah} to ${result.awlRoot}, distributing the deficit proportionately without excluding any heir.`;
    if (baseLcmEl) baseLcmEl.innerText = `${result.aslAlMasalah} → ${result.awlRoot}`;
    return;
  }

  if (result.state === 'radd') {
    if (badgeStateEl) {
      badgeStateEl.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-teal-900/60 text-teal-300 border border-teal-600/50';
      badgeStateEl.innerText = 'Ar-Radd (Surplus Returned)';
    }
    if (caseTitleEl) caseTitleEl.innerText = 'Surplus Redistribution (Ar-Radd)';
    if (caseDescEl) caseDescEl.innerText = 'No Asabah (residuary) heir exists, leaving an unallocated surplus. By consensus of Ali and Ibn Mas\'ud (RA), the residue is redistributed to blood Quranic sharers in proportion to their shares.';
    if (baseLcmEl) baseLcmEl.innerText = `${result.aslAlMasalah} (Radd)`;
    return;
  }

  if (result.state === 'asabah_distribution') {
    if (badgeStateEl) {
      badgeStateEl.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-600/50';
      badgeStateEl.innerText = 'Asabah (Residuary)';
    }
    if (caseTitleEl) caseTitleEl.innerText = 'Residuary Allotment (Ta\'seeb)';
    if (caseDescEl) caseDescEl.innerText = 'Fixed shares (Zawil-Furud) satisfied first per Bukhari 6732. Remaining residue awarded to the primary agnatic heir(s).';
    if (baseLcmEl) baseLcmEl.innerText = `${result.aslAlMasalah}`;
    return;
  }

  // Exact match
  if (badgeStateEl) {
    badgeStateEl.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50';
    badgeStateEl.innerText = 'Exact Full Distribution';
  }
  if (caseTitleEl) caseTitleEl.innerText = 'Perfect Balance (100%)';
  if (caseDescEl) caseDescEl.innerText = 'All fixed Quranic fractions sum exactly to 1 (whole estate) with no surplus or deficit.';
  if (baseLcmEl) baseLcmEl.innerText = `${result.aslAlMasalah}`;
}

function renderHeirsTable(result) {
  const tbody = document.getElementById('heirs-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!result.heirs || result.heirs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-slate-400">
          <i class="fa-solid fa-users-slash text-2xl text-slate-600 mb-2 block"></i>
          No eligible surviving heirs specified or estate is exhausted.
        </td>
      </tr>
    `;
    return;
  }

  result.heirs.forEach((heir, index) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors';

    const colorDot = CHART_PALETTE[index % CHART_PALETTE.length];

    tr.innerHTML = `
      <td class="py-3 px-3">
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${colorDot}"></span>
          <div>
            <div class="font-medium text-white flex items-center gap-1.5">
              <span>${heir.title}</span>
              ${heir.count > 1 ? `<span class="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">x${heir.count}</span>` : ''}
            </div>
            <div class="text-xs font-amiri text-emerald-400/90 tracking-wide">${heir.arabic}</div>
          </div>
        </div>
      </td>
      <td class="py-3 px-3">
        <span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${
          heir.category.includes('Furud') 
            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' 
            : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
        }">
          ${heir.category}
        </span>
      </td>
      <td class="py-3 px-3 text-center">
        <div class="font-mono-calc font-semibold text-emerald-300">${heir.fractionStr}</div>
        <div class="text-[11px] text-slate-400">${heir.percentage.toFixed(2)}%</div>
      </td>
      <td class="py-3 px-3 text-right">
        <div class="font-mono-calc font-bold text-white">${formatMoney(heir.totalAmount)}</div>
        ${heir.count > 1 ? `<div class="text-[11px] text-slate-400">Each: ${formatMoney(heir.eachAmount)} (${heir.eachFractionStr})</div>` : ''}
      </td>
      <td class="py-3 px-3 text-center">
        <button type="button" class="view-verse-btn inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors" data-citation="${heir.verseCitation}">
          <i class="fa-solid fa-book-quran"></i>
          <span class="underline underline-offset-2">${heir.verseCitation}</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach verse modal trigger handlers
  document.querySelectorAll('.view-verse-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const citation = e.currentTarget.getAttribute('data-citation');
      openVerseModal(citation);
    });
  });

  // Update visual horizontal distribution bar
  const visualBar = document.getElementById('visual-distribution-bar');
  if (visualBar) {
    visualBar.innerHTML = '';
    if (result.heirs && result.heirs.length > 0) {
      result.heirs.forEach((heir, index) => {
        const seg = document.createElement('div');
        const colorDot = CHART_PALETTE[index % CHART_PALETTE.length];
        seg.style.width = `${Math.max(1, heir.percentage)}%`;
        seg.style.backgroundColor = colorDot;
        seg.className = 'h-full transition-all duration-300 relative group cursor-pointer border-r border-slate-900/30';
        seg.setAttribute('title', `${heir.title}: ${heir.fractionStr} (${heir.percentage.toFixed(1)}%) — ${formatMoney(heir.totalAmount)}`);
        visualBar.appendChild(seg);
      });
    }
  }
}

function renderBlockedAlert(result) {
  const container = document.getElementById('blocked-heirs-container');
  if (!container) return;

  if (!result.blocked || result.blocked.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200/90 text-xs">
      <div class="flex items-center gap-2 font-semibold text-amber-300 mb-1">
        <i class="fa-solid fa-shield-halved"></i>
        <span>Exclusion by Blocking (Hajb Hirman):</span>
      </div>
      <ul class="list-disc list-inside space-y-1 ml-1 text-slate-300">
        ${result.blocked.map(b => `
          <li>
            <strong class="text-amber-200">${b.heir}</strong> (${b.arabic}): ${b.reason}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

// ==========================================
// 7. MODALS & CERTIFICATE GENERATOR
// ==========================================

function openVerseModal(citationKey) {
  const ref = QURANIC_REFERENCES[citationKey] || {
    surah: citationKey,
    arabic: 'نَصٌّ مِنَ الْقُرْآنِ الْكَرِيمِ أَوِ السُّنَّةِ النَّبَوِيَّةِ الشَّرِيفَةِ',
    translation: 'Citation from the Holy Quran or authentic Prophetic Sunnah establishing Islamic estate rights.',
    explanation: 'Jurisprudential authority on Faraid distribution.'
  };

  const modal = document.getElementById('verse-modal');
  const titleEl = document.getElementById('verse-modal-title');
  const arabicEl = document.getElementById('verse-modal-arabic');
  const translationEl = document.getElementById('verse-modal-translation');
  const explanationEl = document.getElementById('verse-modal-explanation');

  if (titleEl) titleEl.innerText = ref.surah;
  if (arabicEl) arabicEl.innerText = ref.arabic;
  if (translationEl) translationEl.innerText = ref.translation;
  if (explanationEl) explanationEl.innerText = ref.explanation;

  modal?.classList.remove('hidden');
}

function closeVerseModal() {
  const modal = document.getElementById('verse-modal');
  modal?.classList.add('hidden');
}

function openEducationalGuideModal() {
  const modal = document.getElementById('guide-modal');
  modal?.classList.remove('hidden');
}

function closeEducationalGuideModal() {
  const modal = document.getElementById('guide-modal');
  modal?.classList.add('hidden');
}

function openCertificateModal() {
  if (!currentCalcResult) return;
  const modal = document.getElementById('certificate-modal');
  const container = document.getElementById('certificate-render-target');
  if (!container) return;

  const res = currentCalcResult;
  const input = readFormInputs();
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const refId = 'FAR-' + Math.floor(100000 + Math.random() * 900000);

  container.innerHTML = `
    <div class="cert-border rounded-lg bg-white text-slate-900 p-8 shadow-2xl relative overflow-hidden">
      <!-- Watermark Background -->
      <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <i class="fa-solid fa-scale-balanced text-[300px] text-emerald-900"></i>
      </div>

      <!-- Header -->
      <div class="text-center border-b-2 border-emerald-800 pb-5 mb-6">
        <div class="font-amiri text-2xl text-emerald-900 mb-1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <div class="text-xs uppercase tracking-widest text-emerald-700 font-semibold mb-1">In The Name of Allah, The Most Gracious, The Most Merciful</div>
        <h2 class="font-cinzel text-2xl font-bold text-slate-900">Islamic Inheritance Certificate</h2>
        <p class="text-xs text-slate-500 font-medium">Certified Sharia Estate Distribution Report • Ilm al-Faraid</p>
        <div class="flex justify-between items-center text-xs text-slate-500 mt-3 pt-2 border-t border-slate-200">
          <span><strong>Case Ref:</strong> ${refId}</span>
          <span><strong>Date Generated:</strong> ${dateStr}</span>
          <span><strong>Currency:</strong> ${CURRENCIES[currentCurrency].name} (${CURRENCIES[currentCurrency].code})</span>
        </div>
      </div>

      <!-- Profile & Deductions Grid -->
      <div class="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div class="p-3 bg-slate-50 rounded border border-slate-200">
          <div class="font-bold text-slate-800 mb-1.5 uppercase tracking-wider text-[11px] text-emerald-800">Deceased & Family Profile</div>
          <p><strong>Deceased Gender:</strong> ${input.gender === 'male' ? 'Male (Husband / Father)' : 'Female (Wife / Mother)'}</p>
          <p><strong>Surviving Spouse:</strong> ${input.gender === 'male' ? `${input.wivesCount} Wife/Wives` : (input.husband ? 'Husband' : 'None')}</p>
          <p><strong>Children:</strong> ${input.sons} Son(s), ${input.daughters} Daughter(s)</p>
          <p><strong>Parents:</strong> Father: ${input.father ? 'Alive' : 'Deceased'}, Mother: ${input.mother ? 'Alive' : 'Deceased'}</p>
        </div>

        <div class="p-3 bg-slate-50 rounded border border-slate-200">
          <div class="font-bold text-slate-800 mb-1.5 uppercase tracking-wider text-[11px] text-emerald-800">Estate Accounting (Tartib Huquq)</div>
          <div class="flex justify-between"><span>Gross Estate:</span> <span class="font-semibold">${formatMoney(res.gross)}</span></div>
          <div class="flex justify-between"><span>Less: Funeral & Burial Costs:</span> <span class="text-rose-600 font-semibold">- ${formatMoney(res.funeral)}</span></div>
          <div class="flex justify-between"><span>Less: Debts (Creditors & Allah):</span> <span class="text-rose-600 font-semibold">- ${formatMoney(res.debts)}</span></div>
          <div class="flex justify-between"><span>Less: Bequest (Wasiyyah ≤ 1/3):</span> <span class="text-amber-600 font-semibold">- ${formatMoney(res.wasiyyah)}</span></div>
          <div class="flex justify-between border-t border-slate-300 pt-1 mt-1 text-emerald-900 font-bold">
            <span>Net Distributable Estate:</span> <span>${formatMoney(res.distributable)}</span>
          </div>
        </div>
      </div>

      <!-- Heirs Table -->
      <div class="mb-6">
        <div class="font-bold text-slate-800 mb-2 uppercase tracking-wider text-xs text-emerald-800 flex justify-between items-center">
          <span>Allotment of Quranic Shares</span>
          <span class="text-[11px] text-slate-500 font-normal">Base LCM (Asl al-Mas'alah): <strong>${res.aslAlMasalah}${res.awlRoot ? ` → Awl ${res.awlRoot}` : ''}</strong></span>
        </div>
        <table class="w-full text-xs border border-slate-300 border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-800 border-b border-slate-300">
              <th class="py-2 px-3 text-left">Heir / Beneficiary</th>
              <th class="py-2 px-3 text-left">Class</th>
              <th class="py-2 px-3 text-center">Share</th>
              <th class="py-2 px-3 text-center">Percentage</th>
              <th class="py-2 px-3 text-right">Individual Amount</th>
              <th class="py-2 px-3 text-right">Total Allocation</th>
            </tr>
          </thead>
          <tbody>
            ${res.heirs.map(h => `
              <tr class="border-b border-slate-200">
                <td class="py-2 px-3">
                  <strong>${h.title}</strong>
                  <span class="text-slate-500 font-amiri block text-[11px]">${h.arabic}</span>
                </td>
                <td class="py-2 px-3">${h.category}</td>
                <td class="py-2 px-3 text-center font-bold font-mono text-emerald-900">${h.fractionStr}</td>
                <td class="py-2 px-3 text-center">${h.percentage.toFixed(2)}%</td>
                <td class="py-2 px-3 text-right">${h.count > 1 ? formatMoney(h.eachAmount) : '-'}</td>
                <td class="py-2 px-3 text-right font-bold text-emerald-950">${formatMoney(h.totalAmount)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="bg-slate-50 font-bold border-t border-slate-300 text-slate-900">
              <td colspan="4" class="py-2 px-3 text-right">Total Distributed:</td>
              <td colspan="2" class="py-2 px-3 text-right text-emerald-900">${formatMoney(res.distributable)} (100.00%)</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Legal & Sharia Notes -->
      <div class="mb-6 p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
        <p class="font-bold mb-1">Case Characterization: ${res.state === 'awl' ? 'Al-Awl (Proportional Reduction)' : res.state === 'radd' ? 'Ar-Radd (Surplus Return)' : res.isUmariyyatan ? 'Al-Gharrawiyyan (Umariyyatan)' : 'Standard Islamic Distribution'}</p>
        <p class="text-[11px] text-slate-700">Calculated according to the Quran (Surah An-Nisa 4:11-12, 4:176), authentic Sunnah of Prophet Muhammad (ﷺ), and consensus (Ijma) of the righteous Sahaba.</p>
        ${res.blocked.length > 0 ? `
          <div class="mt-1.5 pt-1.5 border-t border-emerald-200 text-[11px] text-slate-600">
            <strong>Exclusions:</strong> ${res.blocked.map(b => `${b.heir} (${b.reason})`).join('; ')}.
          </div>
        ` : ''}
      </div>

      <!-- Signatures & Disclaimer -->
      <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-center text-xs">
        <div>
          <div class="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">Estate Executor</div>
          <span class="text-[10px] text-slate-500">Signature & Date</span>
        </div>
        <div>
          <div class="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">Legal Heir Representative</div>
          <span class="text-[10px] text-slate-500">Signature & Date</span>
        </div>
        <div>
          <div class="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">Certified Mufti / Sharia Advisor</div>
          <span class="text-[10px] text-slate-500">Stamp & Verification</span>
        </div>
      </div>

      <div class="mt-6 pt-3 text-[10px] text-slate-400 text-center border-t border-slate-100">
        Disclaimer: This calculation certificate is generated by FaraidCalc for educational and preliminary estate liquidation planning. Formal probate requires verification by a local probate court or registered Islamic jurisprudential council.
      </div>
    </div>
  `;

  modal?.classList.remove('hidden');

  // Also populate print-only target for window.print()
  const printOnlyTarget = document.getElementById('certificate-view');
  if (printOnlyTarget) {
    printOnlyTarget.innerHTML = container.innerHTML;
  }
}

function closeCertificateModal() {
  const modal = document.getElementById('certificate-modal');
  modal?.classList.add('hidden');
}

function copySummaryToClipboard() {
  if (!currentCalcResult) return;
  const res = currentCalcResult;
  const input = readFormInputs();

  let text = `========================================\n`;
  text += `   FARAIDCALC - ISLAMIC INHERITANCE REPORT\n`;
  text += `========================================\n\n`;
  text += `Deceased: ${input.gender === 'male' ? 'Male' : 'Female'}\n`;
  text += `Currency: ${currentCurrency}\n`;
  text += `Gross Estate: ${formatMoney(res.gross)}\n`;
  text += `Funeral Expenses: - ${formatMoney(res.funeral)}\n`;
  text += `Debts Owed: - ${formatMoney(res.debts)}\n`;
  text += `Bequest (Wasiyyah): - ${formatMoney(res.wasiyyah)}\n`;
  text += `Net Distributable Estate: ${formatMoney(res.distributable)}\n\n`;
  text += `Case Type: ${res.state.toUpperCase()} (Base: ${res.aslAlMasalah}${res.awlRoot ? ` -> Awl ${res.awlRoot}` : ''})\n\n`;
  text += `HEIR ALLOTMENT BREAKDOWN:\n`;
  res.heirs.forEach(h => {
    text += `- ${h.title} (${h.arabic}): ${h.fractionStr} (${h.percentage.toFixed(2)}%) = ${formatMoney(h.totalAmount)}`;
    if (h.count > 1) {
      text += ` [Each: ${formatMoney(h.eachAmount)}]`;
    }
    text += ` | Ref: ${h.verseCitation}\n`;
  });

  if (res.blocked.length > 0) {
    text += `\nEXCLUDED HEIRS (Hajb Hirman):\n`;
    res.blocked.forEach(b => {
      text += `- ${b.heir}: ${b.reason}\n`;
    });
  }

  text += `\nGenerated via FaraidCalc (Simplified Islamic Inheritance Calculator)`;

  navigator.clipboard.writeText(text).then(() => {
    alert("Inheritance summary copied to clipboard successfully!");
  }).catch(() => {
    prompt("Copy the summary below:", text);
  });
}

function exportJSON() {
  if (!currentCalcResult) return;
  const data = {
    timestamp: new Date().toISOString(),
    currency: currentCurrency,
    input: readFormInputs(),
    calculation: currentCalcResult
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `faraid-estate-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Stepper helper
function setupStepper(btnMinusId, btnPlusId, inputId, min = 0, max = 99) {
  const btnMinus = document.getElementById(btnMinusId);
  const btnPlus = document.getElementById(btnPlusId);
  const input = document.getElementById(inputId);

  if (!btnMinus || !btnPlus || !input) return;

  btnMinus.addEventListener('click', () => {
    let val = parseInt(input.value || '0', 10);
    if (val > min) {
      input.value = val - 1;
      triggerRecalculate();
    }
  });

  btnPlus.addEventListener('click', () => {
    let val = parseInt(input.value || '0', 10);
    if (val < max) {
      input.value = val + 1;
      triggerRecalculate();
    }
  });

  input.addEventListener('input', () => {
    let val = parseInt(input.value || '0', 10);
    if (isNaN(val) || val < min) input.value = min;
    if (val > max) input.value = max;
    triggerRecalculate();
  });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Setup Currency Selector
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    currencySelect.value = currentCurrency;
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      triggerRecalculate();
    });
  }

  // Setup Gender Radio buttons
  document.querySelectorAll('input[name="deceased_gender"]').forEach(radio => {
    radio.addEventListener('change', () => {
      updateGenderVisibility();
      triggerRecalculate();
    });
  });

  // Setup Steppers
  setupStepper('btn-wives-minus', 'btn-wives-plus', 'input_wives', 1, 4);
  setupStepper('btn-sons-minus', 'btn-sons-plus', 'input_sons', 0, 20);
  setupStepper('btn-daughters-minus', 'btn-daughters-plus', 'input_daughters', 0, 20);
  setupStepper('btn-brothers-minus', 'btn-brothers-plus', 'input_full_brothers', 0, 20);
  setupStepper('btn-sisters-minus', 'btn-sisters-plus', 'input_full_sisters', 0, 20);
  setupStepper('btn-p-brothers-minus', 'btn-p-brothers-plus', 'input_paternal_brothers', 0, 20);
  setupStepper('btn-p-sisters-minus', 'btn-p-sisters-plus', 'input_paternal_sisters', 0, 20);
  setupStepper('btn-u-brothers-minus', 'btn-u-brothers-plus', 'input_uterine_brothers', 0, 20);
  setupStepper('btn-u-sisters-minus', 'btn-u-sisters-plus', 'input_uterine_sisters', 0, 20);

  // Setup Checkboxes and Inputs live listeners
  const inputIds = [
    'input_gross_estate',
    'input_funeral',
    'input_debts',
    'input_wasiyyah',
    'input_husband',
    'input_father',
    'input_mother',
    'input_p_grandfather',
    'input_p_grandmother',
    'input_m_grandmother',
    'input_paternal_brothers',
    'input_paternal_sisters',
    'input_uterine_brothers',
    'input_uterine_sisters'
  ];

  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', triggerRecalculate);
      el.addEventListener('change', triggerRecalculate);
    }
  });

  // Setup Cap Wasiyyah Button
  const capWasiyyahBtn = document.getElementById('btn-cap-wasiyyah');
  if (capWasiyyahBtn) {
    capWasiyyahBtn.addEventListener('click', () => {
      if (currentCalcResult) {
        const wasiyyahInput = document.getElementById('input_wasiyyah');
        if (wasiyyahInput) {
          wasiyyahInput.value = Math.floor(currentCalcResult.maxWasiyyahAllowed);
          triggerRecalculate();
        }
      }
    });
  }

  // Setup Preset Buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const presetKey = e.currentTarget.getAttribute('data-preset');
      const preset = PRESETS[presetKey];
      if (preset) {
        writeFormInputs(preset.data);
      }
    });
  });

  // Setup Reset Button
  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      writeFormInputs(PRESETS.standard.data);
    });
  }

  // Setup Certificate Buttons
  const openCertBtn = document.getElementById('btn-open-certificate');
  if (openCertBtn) openCertBtn.addEventListener('click', openCertificateModal);

  const closeCertBtn = document.getElementById('btn-close-certificate');
  if (closeCertBtn) closeCertBtn.addEventListener('click', closeCertificateModal);

  const printCertBtn = document.getElementById('btn-print-certificate');
  if (printCertBtn) printCertBtn.addEventListener('click', () => window.print());

  // Setup Modal Closers
  const closeVerseBtn = document.getElementById('btn-close-verse');
  if (closeVerseBtn) closeVerseBtn.addEventListener('click', closeVerseModal);

  const openGuideBtn = document.getElementById('btn-open-guide');
  if (openGuideBtn) openGuideBtn.addEventListener('click', openEducationalGuideModal);

  const closeGuideBtn = document.getElementById('btn-close-guide');
  if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeEducationalGuideModal);

  // Setup Clipboard & JSON
  const copyBtn = document.getElementById('btn-copy-summary');
  if (copyBtn) copyBtn.addEventListener('click', copySummaryToClipboard);

  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) exportBtn.addEventListener('click', exportJSON);

  // Collapsible Secondary Heirs Section
  const toggleSecondaryBtn = document.getElementById('btn-toggle-secondary');
  const secondaryContent = document.getElementById('secondary-heirs-content');
  const secondaryIcon = document.getElementById('secondary-chevron-icon');

  if (toggleSecondaryBtn && secondaryContent) {
    toggleSecondaryBtn.addEventListener('click', () => {
      const isHidden = secondaryContent.classList.contains('hidden');
      if (isHidden) {
        secondaryContent.classList.remove('hidden');
        secondaryIcon?.classList.add('rotate-180');
      } else {
        secondaryContent.classList.add('hidden');
        secondaryIcon?.classList.remove('rotate-180');
      }
    });
  }

  // Initial calculation
  updateGenderVisibility();
  triggerRecalculate();
});
