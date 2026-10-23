/**
 * ZAKATSIMPLE - Transparent Zakat Calculator Engine & Directory
 * Fully reactive single-page application logic
 */

(function () {
  'use strict';

  // 1. CURRENCY & DEFAULT METAL RATES (per gram)
  const CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollar', gold: 76.50, silver: 0.98, locale: 'en-US' },
    EUR: { symbol: '€', name: 'Euro', gold: 70.80, silver: 0.90, locale: 'de-DE' },
    GBP: { symbol: '£', name: 'British Pound', gold: 60.50, silver: 0.77, locale: 'en-GB' },
    SAR: { symbol: 'SAR', name: 'Saudi Riyal', gold: 286.90, silver: 3.68, locale: 'ar-SA' },
    AED: { symbol: 'AED', name: 'UAE Dirham', gold: 281.00, silver: 3.60, locale: 'ar-AE' },
    BDT: { symbol: '৳', name: 'Bangladeshi Taka', gold: 9050, silver: 115, locale: 'bn-BD' },
    PKR: { symbol: '₨', name: 'Pakistani Rupee', gold: 21200, silver: 270, locale: 'ur-PK' },
    INR: { symbol: '₹', name: 'Indian Rupee', gold: 6380, silver: 82, locale: 'en-IN' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', gold: 104.50, silver: 1.34, locale: 'en-CA' },
    TRY: { symbol: '₺', name: 'Turkish Lira', gold: 2460, silver: 31.50, locale: 'tr-TR' }
  };

  // Unit conversions to Grams
  const WEIGHT_UNITS = {
    grams: 1.0,
    tolas: 11.6638,
    troy_oz: 31.1035
  };

  // Karat multipliers
  const GOLD_KARATS = {
    '24k': 1.0,
    '22k': 0.9167,
    '21k': 0.875,
    '18k': 0.75,
    '14k': 0.5833
  };

  const SILVER_PURITIES = {
    '999': 0.999,
    '925': 0.925,
    '900': 0.900
  };

  // Nisab standard thresholds in grams
  const NISAB_WEIGHTS = {
    silver: 612.36, // approx 200 Dirhams / 52.5 Tolas
    gold: 87.48     // approx 20 Mithqals / 7.5 Tolas
  };

  // CHARITY DIRECTORY DATA
  const CHARITIES = [
    {
      id: 'irw',
      name: 'Islamic Relief Worldwide',
      accreditation: 'Independent NGO • Founded 1984',
      badge: '100% Zakat Policy',
      category: 'emergency',
      region: 'global',
      tags: ['Gaza & Palestine', 'Emergency Relief', 'Orphans', 'Water Wells'],
      desc: 'One of the world’s largest Western-based Islamic NGOs, operating in over 40 countries providing emergency assistance, long-term development, and orphan sponsorship.',
      donateUrl: 'https://www.islamic-relief.org/where-we-work/'
    },
    {
      id: 'hhrd',
      name: 'Helping Hand for Relief and Development (HHRD)',
      accreditation: 'Charity Navigator 4-Star (100%)',
      badge: '100% Zakat Guarantee',
      category: 'emergency',
      region: 'usa',
      tags: ['Disaster Management', 'Healthcare', 'Water for Life', 'Education'],
      desc: 'Top-rated international relief agency committed to serving humanity by integrating resources for people in need, with 100% Zakat compliance on dedicated appeals.',
      donateUrl: 'https://hhrd.org/zakat'
    },
    {
      id: 'muslim-aid',
      name: 'Muslim Aid UK',
      accreditation: 'UK Registered Charity No. 1176462',
      badge: '100% Zakat Fund',
      category: 'emergency',
      region: 'uk',
      tags: ['Emergency Food', 'Gaza Relief', 'Livelihoods', 'Healthcare'],
      desc: 'Supporting communities in over 20 countries. Muslim Aid ensures your Zakat reaches the poorest individuals in compliance with Islamic principles.',
      donateUrl: 'https://www.muslimaid.org/zakat/'
    },
    {
      id: 'penny-appeal',
      name: 'Penny Appeal',
      accreditation: 'International Aid Relief Charity',
      badge: '100% Zakat Eligible',
      category: 'water',
      region: 'uk',
      tags: ['Thirst Relief', 'OrphanKind', 'Emergency Response', 'Feed Our World'],
      desc: 'Known for high-impact sustainable projects including deep water wells, emergency nourishment, and caring for thousands of orphans worldwide.',
      donateUrl: 'https://pennyappeal.org/appeal/zakat'
    },
    {
      id: 'baitulmaal',
      name: 'Baitulmaal AHED',
      accreditation: 'US 501(c)(3) Nonprofit',
      badge: '100% Zakat Compliant',
      category: 'emergency',
      region: 'usa',
      tags: ['Yemen Crisis', 'Palestine Medical', 'Syria Relief', 'Winter Packs'],
      desc: 'Provides life-saving, compassionate, and dignified humanitarian aid to those affected by disasters and crises worldwide with transparent donor reporting.',
      donateUrl: 'https://baitulmaal.org/zakat/'
    },
    {
      id: 'islamic-aid',
      name: 'Islamic Aid',
      accreditation: 'International Development Charity',
      badge: '100% Zakat Distribution',
      category: 'education',
      region: 'global',
      tags: ['Vocational Training', 'Microfinance', 'Clean Water', 'Child Health'],
      desc: 'Empowering marginalized families through microfinance, sustainable livelihood programs, and child education to break generational poverty.',
      donateUrl: 'https://www.islamicaid.com/zakat/'
    },
    {
      id: 'launchgood',
      name: 'LaunchGood Global Zakat Fund',
      accreditation: 'Verified Shariah-Compliant Fund',
      badge: '100% Zakat to Beneficiaries',
      category: 'emergency',
      region: 'global',
      tags: ['Crowdfunding', 'Gaza Urgent', 'Hardship Cases', 'Students'],
      desc: 'Peer-to-peer verified emergency campaigns and institutional distribution to individuals facing life-altering hardships, overseen by recognized scholars.',
      donateUrl: 'https://www.launchgood.com/zakat'
    },
    {
      id: 'pcrf',
      name: 'Palestine Children’s Relief Fund (PCRF)',
      accreditation: 'Guidestar Platinum Transparency',
      badge: 'Zakat Compliant Relief',
      category: 'healthcare',
      region: 'middle_east',
      tags: ['Gaza Pediatric Surgery', 'Prosthetics', 'Cancer Care', 'Food Baskets'],
      desc: 'Non-political humanitarian NGO providing free specialized medical care to injured and critically ill children in the Middle East regardless of nationality or faith.',
      donateUrl: 'https://www.pcrf.net/'
    },
    {
      id: 'hci',
      name: 'Human Concern International (HCI)',
      accreditation: 'Canada’s Oldest Muslim Charity (1980)',
      badge: '100% Zakat Policy',
      category: 'orphans',
      region: 'usa',
      tags: ['Orphan Care', 'Shelter Reconstruction', 'Yemen & Somalia', 'Water'],
      desc: 'Dedicated to empowering the impoverished to move from crisis to sustainability through targeted food, health, and orphan support programs.',
      donateUrl: 'https://humanconcern.org/zakat/'
    },
    {
      id: 'muslim-global-relief',
      name: 'Muslim Global Relief',
      accreditation: 'Award Winning UK Charity',
      badge: '100% Zakat Certified',
      category: 'water',
      region: 'uk',
      tags: ['Solar Water Wells', 'Cataract Operations', 'Livelihood Stalls'],
      desc: 'Focusing on clean solar water pumps, sight restoration surgeries, and orphan development in remote rural areas across Asia and Africa.',
      donateUrl: 'https://www.muslimglobalrelief.org/zakat/'
    },
    {
      id: 'direct-aid',
      name: 'Direct Aid (Jam’iat Al-Awn)',
      accreditation: 'African Humanitarian Leader',
      badge: '100% Zakat Direct',
      category: 'education',
      region: 'global',
      tags: ['African Schools', 'Hospitals', 'Boreholes', 'University Grants'],
      desc: 'Founded by Dr. Abdur-Rahman Al-Sumait, Direct Aid has built thousands of schools, universities, hospitals, and water systems across 30+ African nations.',
      donateUrl: 'https://direct-aid.org/'
    },
    {
      id: 'sams',
      name: 'Syrian American Medical Society (SAMS)',
      accreditation: 'Global Medical Relief Foundation',
      badge: 'Zakat Eligible Medical Fund',
      category: 'healthcare',
      region: 'middle_east',
      tags: ['Frontline Trauma Care', 'Maternal Health', 'Refugee Camps', 'Mobile Clinics'],
      desc: 'Non-profit, non-political medical organization that provides life-saving medical care on the front lines of crisis in Syria, Turkey, Lebanon, and Jordan.',
      donateUrl: 'https://www.sams-usa.net/'
    }
  ];

  // STATE MANAGEMENT
  const state = {
    currency: 'USD',
    nisabType: 'silver', // 'silver' or 'gold'
    rateType: 'lunar',   // 'lunar' (2.5%) or 'solar' (2.577%)
    goldPrice: 76.50,
    silverPrice: 0.98,
    
    // Metal inputs
    goldWeight: 0,
    goldUnit: 'grams',
    goldKarat: '24k',
    goldDirectCash: 0,

    silverWeight: 0,
    silverUnit: 'grams',
    silverPurity: '999',
    silverDirectCash: 0,

    // Categorized Form Values
    cashInHand: 0,
    cashInBank: 0,
    foreignCurrency: 0,
    digitalWallets: 0,

    stocksTrading: 0,
    stocksLongterm: 0,
    cryptoHoldings: 0,
    mutualFunds: 0,
    pensionAccessible: 0,

    businessInventory: 0,
    businessReceivables: 0,

    moneyOwedToYou: 0,
    refundableDeposits: 0,

    // Deductions
    immediateDebt: 0,
    dueBillsRent: 0,
    unpaidWages: 0,
    supplierDues: 0,

    // Directory filter
    charitySearchQuery: '',
    charityActiveCategory: 'all',
    charityActiveRegion: 'all'
  };

  // DOM Elements Cache
  const els = {};

  function initElements() {
    // Nav tabs
    els.navTabs = document.querySelectorAll('.nav-tab-btn');
    els.tabPanes = document.querySelectorAll('.tab-pane');

    // Controls
    els.currencySelect = document.getElementById('currency-select');
    els.nisabToggleBtns = document.querySelectorAll('.nisab-choice-btn');
    els.goldPriceInput = document.getElementById('gold-price-input');
    els.silverPriceInput = document.getElementById('silver-price-input');
    els.ratePillBtns = document.querySelectorAll('.rate-pill-btn');

    // Metal customizers
    els.goldWeight = document.getElementById('gold-weight');
    els.goldUnit = document.getElementById('gold-unit');
    els.goldKarat = document.getElementById('gold-karat');
    els.goldDirect = document.getElementById('gold-direct');
    els.goldComputedBadge = document.getElementById('gold-computed-val');

    els.silverWeight = document.getElementById('silver-weight');
    els.silverUnit = document.getElementById('silver-unit');
    els.silverPurity = document.getElementById('silver-purity');
    els.silverDirect = document.getElementById('silver-direct');
    els.silverComputedBadge = document.getElementById('silver-computed-val');

    // Input fields
    els.allInputs = document.querySelectorAll('input[data-field]');

    // Badges & Displays
    els.nisabThresholdVal = document.getElementById('active-nisab-val');
    els.nisabGoldCardVal = document.getElementById('gold-threshold-display');
    els.nisabSilverCardVal = document.getElementById('silver-threshold-display');
    els.goldPriceUnit = document.querySelectorAll('.gold-curr-symbol');
    els.silverPriceUnit = document.querySelectorAll('.silver-curr-symbol');

    // Category subtotals
    els.subtotalCash = document.getElementById('subtotal-cash');
    els.subtotalMetals = document.getElementById('subtotal-metals');
    els.subtotalInvestments = document.getElementById('subtotal-investments');
    els.subtotalBusiness = document.getElementById('subtotal-business');
    els.subtotalReceivables = document.getElementById('subtotal-receivables');
    els.subtotalDeductions = document.getElementById('subtotal-deductions');

    // Sidebar Summary Elements
    els.sumTotalAssets = document.getElementById('sum-total-assets');
    els.sumTotalDeductions = document.getElementById('sum-total-deductions');
    els.sumNetWealth = document.getElementById('sum-net-wealth');
    els.sumNisabThreshold = document.getElementById('sum-nisab-threshold');
    els.sumNisabStatusBox = document.getElementById('sum-nisab-status-box');
    els.sumNisabStatusIcon = document.getElementById('sum-nisab-status-icon');
    els.sumNisabStatusTitle = document.getElementById('sum-nisab-status-title');
    els.sumNisabStatusSub = document.getElementById('sum-nisab-status-sub');
    els.sumZakatDueAmount = document.getElementById('sum-zakat-due-amount');
    els.sumRateNotice = document.getElementById('sum-rate-notice');

    // Action buttons
    els.btnPrint = document.getElementById('btn-print');
    els.btnHeaderPrint = document.getElementById('btn-header-print');
    els.btnSaveData = document.getElementById('btn-save-data');
    els.btnCopySummary = document.getElementById('btn-copy-summary');
    els.btnResetForm = document.getElementById('btn-reset-form');
    els.btnLoadDemo = document.getElementById('btn-load-demo');

    // Charity Elements
    els.charitySearch = document.getElementById('charity-search-input');
    els.charityFilterChips = document.querySelectorAll('.filter-chip');
    els.charityGrid = document.getElementById('charity-cards-grid');

    // Collapsible cards
    els.categoryHeaders = document.querySelectorAll('.category-header');

    // FAQ items
    els.faqItems = document.querySelectorAll('.faq-item');

    // Toast
    els.toast = document.getElementById('toast-notice');

    // Print statement container
    els.printStatement = document.getElementById('print-only-statement');
  }

  // Formatting helper
  function formatCurrency(amount, currencyCode = state.currency) {
    const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
    try {
      return new Intl.NumberFormat(cur.locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      return cur.symbol + ' ' + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // Calculate Gold Value
  function calculateGoldValue() {
    const directVal = parseFloat(els.goldDirect.value) || 0;
    if (directVal > 0) {
      return directVal;
    }
    const weight = parseFloat(els.goldWeight.value) || 0;
    const unitFactor = WEIGHT_UNITS[els.goldUnit.value] || 1.0;
    const karatFactor = GOLD_KARATS[els.goldKarat.value] || 1.0;
    const weightInGrams = weight * unitFactor;
    return weightInGrams * state.goldPrice * karatFactor;
  }

  // Calculate Silver Value
  function calculateSilverValue() {
    const directVal = parseFloat(els.silverDirect.value) || 0;
    if (directVal > 0) {
      return directVal;
    }
    const weight = parseFloat(els.silverWeight.value) || 0;
    const unitFactor = WEIGHT_UNITS[els.silverUnit.value] || 1.0;
    const purityFactor = SILVER_PURITIES[els.silverPurity.value] || 1.0;
    const weightInGrams = weight * unitFactor;
    return weightInGrams * state.silverPrice * purityFactor;
  }

  // Compute all totals and update UI
  function recalculate() {
    // 1. Get input values
    const cashInHand = parseFloat(document.getElementById('input-cash-hand').value) || 0;
    const cashInBank = parseFloat(document.getElementById('input-cash-bank').value) || 0;
    const foreignCurrency = parseFloat(document.getElementById('input-foreign-cash').value) || 0;
    const digitalWallets = parseFloat(document.getElementById('input-digital-wallets').value) || 0;
    const totalCash = cashInHand + cashInBank + foreignCurrency + digitalWallets;

    // Precious metals
    const goldValue = calculateGoldValue();
    const silverValue = calculateSilverValue();
    const totalMetals = goldValue + silverValue;

    // Update metal badges
    if (els.goldComputedBadge) {
      els.goldComputedBadge.textContent = formatCurrency(goldValue);
    }
    if (els.silverComputedBadge) {
      els.silverComputedBadge.textContent = formatCurrency(silverValue);
    }

    // Investments
    const stocksTrading = parseFloat(document.getElementById('input-stocks-trading').value) || 0;
    const stocksLongterm = parseFloat(document.getElementById('input-stocks-longterm').value) || 0;
    const cryptoHoldings = parseFloat(document.getElementById('input-crypto').value) || 0;
    const mutualFunds = parseFloat(document.getElementById('input-mutual-funds').value) || 0;
    const pensionAccessible = parseFloat(document.getElementById('input-pension').value) || 0;
    const totalInvestments = stocksTrading + stocksLongterm + cryptoHoldings + mutualFunds + pensionAccessible;

    // Business
    const businessInventory = parseFloat(document.getElementById('input-biz-inventory').value) || 0;
    const businessReceivables = parseFloat(document.getElementById('input-biz-cash').value) || 0;
    const totalBusiness = businessInventory + businessReceivables;

    // Receivables
    const moneyOwedToYou = parseFloat(document.getElementById('input-loans-owed').value) || 0;
    const refundableDeposits = parseFloat(document.getElementById('input-deposits').value) || 0;
    const totalReceivables = moneyOwedToYou + refundableDeposits;

    // TOTAL ASSETS
    const totalAssets = totalCash + totalMetals + totalInvestments + totalBusiness + totalReceivables;

    // Deductions
    const immediateDebt = parseFloat(document.getElementById('input-debt-immediate').value) || 0;
    const dueBillsRent = parseFloat(document.getElementById('input-due-bills').value) || 0;
    const unpaidWages = parseFloat(document.getElementById('input-unpaid-wages').value) || 0;
    const supplierDues = parseFloat(document.getElementById('input-supplier-dues').value) || 0;
    const totalDeductions = immediateDebt + dueBillsRent + unpaidWages + supplierDues;

    // NET WEALTH
    const netWealth = Math.max(0, totalAssets - totalDeductions);

    // NISAB THRESHOLDS
    const silverNisabValue = NISAB_WEIGHTS.silver * state.silverPrice;
    const goldNisabValue = NISAB_WEIGHTS.gold * state.goldPrice;
    const activeNisabThreshold = state.nisabType === 'silver' ? silverNisabValue : goldNisabValue;

    // OBLIGATION STATUS
    const isNisabReached = netWealth >= activeNisabThreshold && netWealth > 0;

    // ZAKAT RATE
    const zakatRate = state.rateType === 'lunar' ? 0.025 : 0.02577; // 2.5% Hijri vs 2.577% Solar
    const zakatPayable = isNisabReached ? (netWealth * zakatRate) : 0;

    // UPDATE UI SUB-TOTALS
    if (els.subtotalCash) els.subtotalCash.textContent = formatCurrency(totalCash);
    if (els.subtotalMetals) els.subtotalMetals.textContent = formatCurrency(totalMetals);
    if (els.subtotalInvestments) els.subtotalInvestments.textContent = formatCurrency(totalInvestments);
    if (els.subtotalBusiness) els.subtotalBusiness.textContent = formatCurrency(totalBusiness);
    if (els.subtotalReceivables) els.subtotalReceivables.textContent = formatCurrency(totalReceivables);
    if (els.subtotalDeductions) els.subtotalDeductions.textContent = '-' + formatCurrency(totalDeductions);

    // UPDATE NISAB CARDS & STRIP
    if (els.nisabSilverCardVal) els.nisabSilverCardVal.textContent = formatCurrency(silverNisabValue);
    if (els.nisabGoldCardVal) els.nisabGoldCardVal.textContent = formatCurrency(goldNisabValue);

    // Threshold card active classes
    const silverCard = document.getElementById('card-silver-threshold');
    const goldCard = document.getElementById('card-gold-threshold');
    if (silverCard && goldCard) {
      if (state.nisabType === 'silver') {
        silverCard.classList.add('active-threshold');
        goldCard.classList.remove('active-threshold');
      } else {
        goldCard.classList.add('active-threshold');
        silverCard.classList.remove('active-threshold');
      }
    }

    // UPDATE SIDEBAR SUMMARY
    if (els.sumTotalAssets) els.sumTotalAssets.textContent = formatCurrency(totalAssets);
    if (els.sumTotalDeductions) els.sumTotalDeductions.textContent = '-' + formatCurrency(totalDeductions);
    if (els.sumNetWealth) els.sumNetWealth.textContent = formatCurrency(netWealth);
    if (els.sumNisabThreshold) {
      els.sumNisabThreshold.textContent = `${formatCurrency(activeNisabThreshold)} (${state.nisabType === 'silver' ? 'Silver' : 'Gold'})`;
    }

    // UPDATE STATUS BADGE
    if (els.sumNisabStatusBox) {
      if (isNisabReached) {
        els.sumNisabStatusBox.className = 'nisab-status-box reached';
        els.sumNisabStatusIcon.innerHTML = '✓';
        els.sumNisabStatusTitle.textContent = 'Nisab Reached: Zakat is Obligatory';
        els.sumNisabStatusSub.textContent = `Your net wealth exceeds the ${state.nisabType} Nisab threshold (${formatCurrency(activeNisabThreshold)}). Zakat is due if held for 1 lunar year (Hawl).`;
      } else {
        els.sumNisabStatusBox.className = 'nisab-status-box not-reached';
        els.sumNisabStatusIcon.innerHTML = 'ℹ';
        els.sumNisabStatusTitle.textContent = 'Below Nisab: No Zakat Due';
        const diff = activeNisabThreshold - netWealth;
        els.sumNisabStatusSub.textContent = `Your net wealth is below the ${state.nisabType} Nisab threshold (${formatCurrency(activeNisabThreshold)}) by ${formatCurrency(diff)}.`;
      }
    }

    // UPDATE GRAND TOTAL
    if (els.sumZakatDueAmount) {
      els.sumZakatDueAmount.textContent = formatCurrency(zakatPayable);
    }
    if (els.sumRateNotice) {
      els.sumRateNotice.textContent = state.rateType === 'lunar' ? '2.50% (Lunar Hawl standard)' : '2.577% (Solar / Gregorian year adjusted)';
    }

    // AUTO-SAVE to localStorage
    autoSaveState({
      totalAssets, totalDeductions, netWealth, zakatPayable,
      totalCash, totalMetals, totalInvestments, totalBusiness, totalReceivables
    });

    // REGENERATE PRINT STATEMENT
    generatePrintStatement({
      totalCash, totalMetals, totalInvestments, totalBusiness, totalReceivables,
      totalAssets, totalDeductions, netWealth, activeNisabThreshold, isNisabReached,
      zakatPayable, silverNisabValue, goldNisabValue
    });
  }

  // Update Currency & Defaults
  function setCurrency(currencyCode) {
    if (!CURRENCIES[currencyCode]) return;
    state.currency = currencyCode;
    const cur = CURRENCIES[currencyCode];

    // Update metal prices from currency defaults
    state.goldPrice = cur.gold;
    state.silverPrice = cur.silver;
    if (els.goldPriceInput) els.goldPriceInput.value = cur.gold;
    if (els.silverPriceInput) els.silverPriceInput.value = cur.silver;

    // Update currency affixes in input groups
    document.querySelectorAll('.currency-affix').forEach(el => {
      el.textContent = cur.symbol;
    });

    document.querySelectorAll('.gold-curr-symbol').forEach(el => {
      el.textContent = `${cur.symbol}/g`;
    });
    document.querySelectorAll('.silver-curr-symbol').forEach(el => {
      el.textContent = `${cur.symbol}/g`;
    });

    recalculate();
  }

  // Toast Helper
  let toastTimer = null;
  function showToast(message) {
    if (!els.toast) return;
    const toastText = els.toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('show');
    }, 3200);
  }

  // Save to LocalStorage
  function autoSaveState(computed) {
    try {
      const data = {
        currency: state.currency,
        nisabType: state.nisabType,
        rateType: state.rateType,
        goldPrice: state.goldPrice,
        silverPrice: state.silverPrice,
        goldWeight: els.goldWeight ? els.goldWeight.value : 0,
        goldUnit: els.goldUnit ? els.goldUnit.value : 'grams',
        goldKarat: els.goldKarat ? els.goldKarat.value : '24k',
        goldDirect: els.goldDirect ? els.goldDirect.value : 0,
        silverWeight: els.silverWeight ? els.silverWeight.value : 0,
        silverUnit: els.silverUnit ? els.silverUnit.value : 'grams',
        silverPurity: els.silverPurity ? els.silverPurity.value : '999',
        silverDirect: els.silverDirect ? els.silverDirect.value : 0,
        inputs: {}
      };

      document.querySelectorAll('input[data-field]').forEach(input => {
        data.inputs[input.id] = input.value;
      });

      localStorage.setItem('zakatsimple_saved_state', JSON.stringify(data));
    } catch (e) {
      // localStorage may fail in restricted/private modes
    }
  }

  // Load from LocalStorage
  function loadSavedState() {
    try {
      const saved = localStorage.getItem('zakatsimple_saved_state');
      if (!saved) return false;
      const data = JSON.parse(saved);

      if (data.currency && CURRENCIES[data.currency]) {
        state.currency = data.currency;
        if (els.currencySelect) els.currencySelect.value = data.currency;
      }
      if (data.nisabType) {
        state.nisabType = data.nisabType;
        updateNisabToggleUI();
      }
      if (data.rateType) {
        state.rateType = data.rateType;
        updateRateToggleUI();
      }
      if (data.goldPrice) {
        state.goldPrice = parseFloat(data.goldPrice) || CURRENCIES[state.currency].gold;
        if (els.goldPriceInput) els.goldPriceInput.value = state.goldPrice;
      }
      if (data.silverPrice) {
        state.silverPrice = parseFloat(data.silverPrice) || CURRENCIES[state.currency].silver;
        if (els.silverPriceInput) els.silverPriceInput.value = state.silverPrice;
      }

      // Metals
      if (els.goldWeight && data.goldWeight) els.goldWeight.value = data.goldWeight;
      if (els.goldUnit && data.goldUnit) els.goldUnit.value = data.goldUnit;
      if (els.goldKarat && data.goldKarat) els.goldKarat.value = data.goldKarat;
      if (els.goldDirect && data.goldDirect) els.goldDirect.value = data.goldDirect;

      if (els.silverWeight && data.silverWeight) els.silverWeight.value = data.silverWeight;
      if (els.silverUnit && data.silverUnit) els.silverUnit.value = data.silverUnit;
      if (els.silverPurity && data.silverPurity) els.silverPurity.value = data.silverPurity;
      if (els.silverDirect && data.silverDirect) els.silverDirect.value = data.silverDirect;

      // Inputs
      if (data.inputs) {
        Object.keys(data.inputs).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = data.inputs[id];
        });
      }

      setCurrency(state.currency);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Update Nisab Toggle Button UI
  function updateNisabToggleUI() {
    if (!els.nisabToggleBtns) return;
    els.nisabToggleBtns.forEach(btn => {
      const type = btn.getAttribute('data-nisab');
      if (type === state.nisabType) {
        btn.classList.add('active');
        if (type === 'gold') btn.classList.add('gold-btn');
      } else {
        btn.classList.remove('active', 'gold-btn');
      }
    });
  }

  // Update Rate Toggle Button UI
  function updateRateToggleUI() {
    if (!els.ratePillBtns) return;
    els.ratePillBtns.forEach(btn => {
      const rate = btn.getAttribute('data-rate');
      if (rate === state.rateType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Load Sample Realistic Data
  function loadDemoData() {
    if (els.currencySelect) {
      els.currencySelect.value = 'USD';
      setCurrency('USD');
    }

    document.getElementById('input-cash-hand').value = 1200;
    document.getElementById('input-cash-bank').value = 14500;
    document.getElementById('input-foreign-cash').value = 850;
    document.getElementById('input-digital-wallets').value = 400;

    // Gold 45 grams 22K
    if (els.goldWeight) els.goldWeight.value = 45;
    if (els.goldUnit) els.goldUnit.value = 'grams';
    if (els.goldKarat) els.goldKarat.value = '22k';
    if (els.goldDirect) els.goldDirect.value = '';

    // Silver 150 grams 925
    if (els.silverWeight) els.silverWeight.value = 150;
    if (els.silverUnit) els.silverUnit.value = 'grams';
    if (els.silverPurity) els.silverPurity.value = '925';
    if (els.silverDirect) els.silverDirect.value = '';

    // Investments
    document.getElementById('input-stocks-trading').value = 3500;
    document.getElementById('input-stocks-longterm').value = 1200;
    document.getElementById('input-crypto').value = 2100;
    document.getElementById('input-mutual-funds').value = 4000;
    document.getElementById('input-pension').value = 0;

    // Business
    document.getElementById('input-biz-inventory').value = 0;
    document.getElementById('input-biz-cash').value = 0;

    // Receivables
    document.getElementById('input-loans-owed').value = 1500;
    document.getElementById('input-deposits').value = 0;

    // Deductions
    document.getElementById('input-debt-immediate').value = 1800;
    document.getElementById('input-due-bills').value = 650;
    document.getElementById('input-unpaid-wages').value = 0;
    document.getElementById('input-supplier-dues').value = 0;

    state.nisabType = 'silver';
    updateNisabToggleUI();

    recalculate();
    showToast('Demo data loaded successfully! View the calculation summary on the right.');
  }

  // Reset Form
  function resetForm() {
    if (!confirm('Are you sure you want to reset all calculation values to zero?')) return;

    document.querySelectorAll('input[data-field]').forEach(input => {
      input.value = '';
    });

    if (els.goldWeight) els.goldWeight.value = '';
    if (els.goldDirect) els.goldDirect.value = '';
    if (els.silverWeight) els.silverWeight.value = '';
    if (els.silverDirect) els.silverDirect.value = '';

    localStorage.removeItem('zakatsimple_saved_state');
    recalculate();
    showToast('Form has been cleared.');
  }

  // Copy Summary to Clipboard
  function copySummaryToClipboard() {
    const cur = CURRENCIES[state.currency] || CURRENCIES.USD;
    const assets = els.sumTotalAssets.textContent;
    const deductions = els.sumTotalDeductions.textContent;
    const net = els.sumNetWealth.textContent;
    const nisab = els.sumNisabThreshold.textContent;
    const zakat = els.sumZakatDueAmount.textContent;
    const status = els.sumNisabStatusTitle.textContent;
    const today = new Date().toLocaleDateString(cur.locale, { year: 'numeric', month: 'long', day: 'numeric' });

    const text = `=== ZAKAT ASSESSMENT SUMMARY ===
Date: ${today}
Currency: ${state.currency} (${cur.name})
Rate Applied: ${state.rateType === 'lunar' ? '2.5% (Hijri Lunar Year)' : '2.577% (Gregorian Solar Year)'}

Total Zakatable Assets: ${assets}
Total Immediate Deductions: ${deductions}
---------------------------------
Net Zakatable Wealth: ${net}
Nisab Threshold (${state.nisabType.toUpperCase()}): ${nisab}
Status: ${status}
=================================
TOTAL ZAKAT DUE: ${zakat}
=================================
Calculated transparently via ZakatSimple`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Calculation summary copied to clipboard!');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Calculation summary copied to clipboard!');
    } catch (e) {
      showToast('Could not copy to clipboard.');
    }
    document.body.removeChild(textarea);
  }

  // Printable formal statement generation
  function generatePrintStatement(c) {
    if (!els.printStatement) return;
    const cur = CURRENCIES[state.currency] || CURRENCIES.USD;
    const dateFormatted = new Date().toLocaleDateString(cur.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
      <div class="print-header">
        <div>
          <div class="print-title">ZAKAT ASSESSMENT & SUMMARY STATEMENT</div>
          <div class="print-subtitle">Transparent Calculation of Islamic Wealth Obligation (2.5%)</div>
        </div>
        <div style="text-align: right; font-size: 9pt; color: #555;">
          <strong>ZakatSimple Platform</strong><br>
          Official Assessment Record
        </div>
      </div>

      <div class="print-meta-grid">
        <div><strong>Assessment Date:</strong> ${dateFormatted}</div>
        <div><strong>Base Currency:</strong> ${state.currency} (${cur.name})</div>
        <div><strong>Nisab Criterion:</strong> ${state.nisabType.toUpperCase()} Nisab (${state.nisabType === 'silver' ? '612.36g Silver' : '87.48g Gold'})</div>
        <div><strong>Precious Metal Rates:</strong> Gold: ${formatCurrency(state.goldPrice)}/g | Silver: ${formatCurrency(state.silverPrice)}/g</div>
        <div><strong>Nisab Threshold Value:</strong> ${formatCurrency(c.activeNisabThreshold)}</div>
        <div><strong>Hawl Period:</strong> 1 Full Lunar Year (354 Days)</div>
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th>Category / Asset Description</th>
            <th class="text-right">Zakatable Value</th>
          </tr>
        </thead>
        <tbody>
          <tr class="category-subrow">
            <td><strong>1. Liquid Cash & Bank Balances</strong></td>
            <td class="text-right"><strong>${formatCurrency(c.totalCash)}</strong></td>
          </tr>
          <tr class="category-subrow">
            <td><strong>2. Precious Metals (Gold & Silver)</strong></td>
            <td class="text-right"><strong>${formatCurrency(c.totalMetals)}</strong></td>
          </tr>
          <tr class="category-subrow">
            <td><strong>3. Stocks, Investments & Crypto</strong></td>
            <td class="text-right"><strong>${formatCurrency(c.totalInvestments)}</strong></td>
          </tr>
          <tr class="category-subrow">
            <td><strong>4. Business Merchandise & Inventory</strong></td>
            <td class="text-right"><strong>${formatCurrency(c.totalBusiness)}</strong></td>
          </tr>
          <tr class="category-subrow">
            <td><strong>5. Money Owed to You (Receivables)</strong></td>
            <td class="text-right"><strong>${formatCurrency(c.totalReceivables)}</strong></td>
          </tr>
          <tr style="background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #000;">
            <td>TOTAL ZAKATABLE ASSETS</td>
            <td class="text-right">${formatCurrency(c.totalAssets)}</td>
          </tr>
          <tr>
            <td style="color: #c00;">Less: Total Immediate Debts & Due Liabilities</td>
            <td class="text-right" style="color: #c00;">-${formatCurrency(c.totalDeductions)}</td>
          </tr>
          <tr style="background-color: #e2e8f0; font-weight: 900; font-size: 11pt; border-top: 2px solid #000;">
            <td>NET ZAKATABLE WEALTH</td>
            <td class="text-right">${formatCurrency(c.netWealth)}</td>
          </tr>
        </tbody>
      </table>

      <div class="print-total-banner">
        <div style="font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; color: #065f46; font-weight: bold;">
          ${c.isNisabReached ? 'Status: NISAB REACHED — ZAKAT IS OBLIGATORY' : 'Status: BELOW NISAB — NO ZAKAT DUE'}
        </div>
        <div class="amount">${formatCurrency(c.zakatPayable)}</div>
        <div style="font-size: 9pt; color: #047857;">
          Calculated at ${state.rateType === 'lunar' ? '2.500% (Standard Lunar Year / 354 Days)' : '2.577% (Solar Year / 365 Days)'}
        </div>
      </div>

      <div class="print-declaration">
        <strong>The 8 Eligible Recipients (Surah At-Tawbah 9:60):</strong>
        Zakat must be distributed directly to one or more of the eight divinely ordained categories:
        (1) Al-Fuqara (The Poor), (2) Al-Masakin (The Destitute), (3) Al-Amilina (Zakat Administrators), 
        (4) Al-Mu'allafati Qulubuhum (Reconciling hearts), (5) Fir-Riqab (Freeing captives/slaves), 
        (6) Al-Gharimin (Insolvents in debt), (7) Fi Sabilillah (In the Cause of Allah), (8) Ibnus-Sabil (Stranded travelers).
      </div>

      <div class="print-signature-row">
        <div class="print-signature-box">Assessed By (Signature)</div>
        <div class="print-signature-box">Witness / Trustee</div>
        <div class="print-signature-box">Date of Distribution</div>
      </div>
    `;

    els.printStatement.innerHTML = html;
  }

  // CHARITY DIRECTORY RENDERER
  function renderCharityDirectory() {
    if (!els.charityGrid) return;

    const query = state.charitySearchQuery.toLowerCase().trim();
    const cat = state.charityActiveCategory;
    const reg = state.charityActiveRegion;

    const filtered = CHARITIES.filter(item => {
      // Category filter
      if (cat !== 'all' && item.category !== cat) return false;
      // Region filter
      if (reg !== 'all' && item.region !== reg && item.region !== 'global') return false;
      // Search query
      if (query) {
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.desc.toLowerCase().includes(query);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchTag) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      els.charityGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--navy-500);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--navy-800);">No Charities Found</h3>
          <p style="font-size: 0.875rem;">Try adjusting your search terms or selecting 'All Causes'.</p>
        </div>
      `;
      return;
    }

    els.charityGrid.innerHTML = filtered.map(item => {
      const initials = item.name.split(' ').map(w => w[0]).slice(0, 2).join('');
      const tagsHtml = item.tags.map(t => `<span class="tag-badge">${t}</span>`).join('');
      const regionLabel = item.region === 'global' ? 'Global Reach' :
                          item.region === 'usa' ? 'USA & North America' :
                          item.region === 'uk' ? 'UK & Europe' :
                          item.region === 'middle_east' ? 'Middle East & Levant' : 'International';

      return `
        <div class="charity-card" data-id="${item.id}">
          <div>
            <div class="charity-header">
              <div class="charity-identity">
                <div class="charity-logo-avatar">${initials}</div>
                <div>
                  <h3 class="charity-name">${item.name}</h3>
                  <div class="charity-accreditation">${item.accreditation}</div>
                </div>
              </div>
            </div>

            <div style="margin: 0.875rem 0 0.5rem;">
              <span class="policy-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ${item.badge}
              </span>
            </div>

            <p class="charity-desc">${item.desc}</p>
          </div>

          <div>
            <div class="charity-tags" style="margin-bottom: 1rem;">
              ${tagsHtml}
            </div>

            <div class="charity-footer">
              <div class="charity-region">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                ${regionLabel}
              </div>
              <a href="${item.donateUrl}" target="_blank" rel="noopener noreferrer" class="btn-donate-direct">
                Donate Zakat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // INITIALIZE EVENT LISTENERS
  function setupEventListeners() {
    // Nav Tab Switching
    els.navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = tab.getAttribute('data-tab');
        if (!target) return;
        els.navTabs.forEach(t => t.classList.remove('active'));
        els.tabPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPane = document.getElementById(`tab-${target}`);
        if (targetPane) targetPane.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Currency Switcher
    if (els.currencySelect) {
      els.currencySelect.addEventListener('change', (e) => {
        setCurrency(e.target.value);
        showToast(`Currency updated to ${e.target.value}. Metal rates adjusted.`);
      });
    }

    // Nisab Toggle (Silver vs Gold)
    els.nisabToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.nisabType = btn.getAttribute('data-nisab');
        updateNisabToggleUI();
        recalculate();
      });
    });

    // Calendar Rate Toggle (Lunar vs Solar)
    els.ratePillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.rateType = btn.getAttribute('data-rate');
        updateRateToggleUI();
        recalculate();
      });
    });

    // Precious Metal Custom Rates
    if (els.goldPriceInput) {
      els.goldPriceInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
          state.goldPrice = val;
          recalculate();
        }
      });
    }

    if (els.silverPriceInput) {
      els.silverPriceInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
          state.silverPrice = val;
          recalculate();
        }
      });
    }

    // Metal Specifier Controls
    [els.goldWeight, els.goldUnit, els.goldKarat, els.goldDirect,
     els.silverWeight, els.silverUnit, els.silverPurity, els.silverDirect].forEach(el => {
      if (el) {
        el.addEventListener('input', recalculate);
        el.addEventListener('change', recalculate);
      }
    });

    // All form input listeners
    document.querySelectorAll('input[data-field]').forEach(input => {
      input.addEventListener('input', recalculate);
    });

    // Collapsible Categories
    els.categoryHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.category-card');
        if (card) {
          card.classList.toggle('collapsed');
        }
      });
    });

    // FAQ Accordion
    els.faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          // Close all others
          els.faqItems.forEach(other => other.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });

    // Action Buttons
    if (els.btnPrint) {
      els.btnPrint.addEventListener('click', () => window.print());
    }
    if (els.btnHeaderPrint) {
      els.btnHeaderPrint.addEventListener('click', () => window.print());
    }
    if (els.btnSaveData) {
      els.btnSaveData.addEventListener('click', () => {
        autoSaveState({});
        showToast('Your calculation data has been saved to your browser.');
      });
    }
    if (els.btnCopySummary) {
      els.btnCopySummary.addEventListener('click', copySummaryToClipboard);
    }
    if (els.btnResetForm) {
      els.btnResetForm.addEventListener('click', resetForm);
    }
    if (els.btnLoadDemo) {
      els.btnLoadDemo.addEventListener('click', loadDemoData);
    }

    // Charity Filters & Search
    if (els.charitySearch) {
      els.charitySearch.addEventListener('input', (e) => {
        state.charitySearchQuery = e.target.value;
        renderCharityDirectory();
      });
    }

    els.charityFilterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        els.charityFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.charityActiveCategory = chip.getAttribute('data-category') || 'all';
        renderCharityDirectory();
      });
    });
  }

  // BOOTSTRAP APPLICATION
  document.addEventListener('DOMContentLoaded', () => {
    initElements();
    setupEventListeners();

    // Check if previously saved state exists
    const hasSaved = loadSavedState();
    if (!hasSaved) {
      setCurrency('USD');
    }

    renderCharityDirectory();

    // Support deep-link hashes (#calculator, #directory, #guide, #faq)
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && ['calculator', 'directory', 'guide', 'faq'].includes(hash)) {
      const targetBtn = document.querySelector(`[data-tab="${hash}"]`);
      if (targetBtn) targetBtn.click();
    }
  });
})();
