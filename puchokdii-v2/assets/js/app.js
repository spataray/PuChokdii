// PuChokDii v2 - Main App Logic with Real Lottery Data
console.log('🍀 PuChokDii v2 initialized!');

// Lottery data (will be populated from API)
let latestDraw = {
    date: 'กำลังโหลด...',
    firstPrize: null,
    twoDigit: null,
    threeFront: null,
    threeBack: null,
    secondPrizes: [],
    thirdPrizes: [],
    fourthPrizes: [],
    fifthPrizes: [],
    nearFirst: []
};

// API endpoints - rayriffy Thai Lottery API (free, community-maintained)
const LOTTERY_API = 'https://lotto.api.rayriffy.com/latest';
const LOTTERY_LIST_API = 'https://lotto.api.rayriffy.com/list';

// Historical data storage
let historicalDraws = [];
const HISTORY_LIMIT = 20; // Analyze last 20 draws

// Fetch latest lottery results
async function fetchLatestLottery() {
    console.log('📡 Fetching latest lottery results...');

    try {
        const response = await fetch(LOTTERY_API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Lottery data received:', data);

        // Parse the API response
        parseLotteryData(data);

        // Update UI with real data
        updateLotteryDisplay();

        return true;
    } catch (error) {
        console.error('❌ Error fetching lottery data:', error);
        console.log('⚠️ Using fallback mock data');

        // Fallback to mock data
        useMockData();
        updateLotteryDisplay();

        return false;
    }
}

// Parse lottery data from API
function parseLotteryData(data) {
    // API structure: { status: "success", response: { date, prizes: [...], runningNumbers: [...] } }
    if (data.status === 'success' && data.response) {
        const prizes = data.response.prizes;
        const runningNumbers = data.response.runningNumbers;

        // Update date
        latestDraw.date = data.response.date;

        // Parse prizes array
        prizes.forEach(prize => {
            switch(prize.id) {
                case 'prizeFirst':
                    latestDraw.firstPrize = prize.number[0]; // First element of array
                    break;
                case 'prizeFirstNear':
                    latestDraw.nearFirst = prize.number; // Array of near first
                    break;
                case 'prizeSecond':
                    latestDraw.secondPrizes = prize.number;
                    break;
                case 'prizeThird':
                    latestDraw.thirdPrizes = prize.number;
                    break;
                case 'prizeForth': // Note: API has typo "Forth" instead of "Fourth"
                    latestDraw.fourthPrizes = prize.number;
                    break;
                case 'prizeFifth':
                    latestDraw.fifthPrizes = prize.number;
                    break;
            }
        });

        // Parse running numbers (2-digit, 3-digit front/back)
        runningNumbers.forEach(rn => {
            switch(rn.id) {
                case 'runningNumberFrontThree':
                    latestDraw.threeFront = rn.number[0]; // First element
                    break;
                case 'runningNumberBackThree':
                    latestDraw.threeBack = rn.number[0]; // First element
                    break;
                case 'runningNumberBackTwo':
                    latestDraw.twoDigit = rn.number[0]; // First element
                    break;
            }
        });

        console.log('📊 Parsed lottery data:', latestDraw);
    }
}

// Format Thai date
function formatThaiDate(dateString) {
    // Date is already in Thai format from API (e.g., "16 ตุลาคม 2568")
    // Just add "งวดวันที่" prefix
    return `งวดวันที่ ${dateString}`;
}

// Use mock data as fallback
function useMockData() {
    latestDraw = {
        date: '16 ตุลาคม 2567',
        firstPrize: '123456',
        twoDigit: '56',
        threeFront: '123',
        threeBack: '456',
        secondPrizes: ['789012', '345678'],
        thirdPrizes: ['111111', '222222', '333333'],
        nearFirst: ['123455', '123457']
    };
}

// Update lottery display in UI
function updateLotteryDisplay() {
    // Update date
    const dateEl = document.getElementById('drawDate');
    if (dateEl) {
        dateEl.textContent = latestDraw.date;
    }

    // Update prize numbers in the display
    const prizeElements = document.querySelectorAll('.prize-number');
    if (prizeElements.length >= 4) {
        prizeElements[0].textContent = latestDraw.firstPrize || '------';
        prizeElements[1].textContent = latestDraw.twoDigit || '--';
        prizeElements[2].textContent = latestDraw.threeFront || '---';
        prizeElements[3].textContent = latestDraw.threeBack || '---';
    }
}

// Initialize - fetch lottery data on load
document.addEventListener('DOMContentLoaded', async () => {
    await fetchLatestLottery();
});

// Language switcher
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        updateLanguage(lang);
    });
});

// Lottery number input - only allow digits
const lotteryInput = document.getElementById('lotteryNumber');
if (lotteryInput) {
    lotteryInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });
}

// Form submission
const checkForm = document.getElementById('checkForm');
if (checkForm) {
    checkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkLottery();
    });
}

// Check lottery number
function checkLottery() {
    const number = lotteryInput.value.trim();
    const resultDiv = document.getElementById('result');

    // Validation
    if (number.length !== 6) {
        showResult({
            type: 'no-win',
            title: t('invalid-number'),
            subtitle: '',
            amount: ''
        });
        return;
    }

    // Check against prizes
    const result = checkNumber(number);
    showResult(result);
}

// Check number against all prizes
function checkNumber(number) {
    // First prize
    if (number === latestDraw.firstPrize) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: t('prize-first'),
            amount: '6,000,000 ฿'
        };
    }

    // Near first (adjacent to first prize)
    if (latestDraw.nearFirst && latestDraw.nearFirst.includes(number)) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: currentLang === 'th' ? 'รางวัลข้างเคียงรางวัลที่ 1' : 'Near 1st Prize',
            amount: '100,000 ฿'
        };
    }

    // Second prizes
    if (latestDraw.secondPrizes && latestDraw.secondPrizes.includes(number)) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: currentLang === 'th' ? 'รางวัลที่ 2' : '2nd Prize',
            amount: '200,000 ฿'
        };
    }

    // Third prizes
    if (latestDraw.thirdPrizes && latestDraw.thirdPrizes.includes(number)) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: currentLang === 'th' ? 'รางวัลที่ 3' : '3rd Prize',
            amount: '80,000 ฿'
        };
    }

    // Fourth prizes
    if (latestDraw.fourthPrizes && latestDraw.fourthPrizes.includes(number)) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: currentLang === 'th' ? 'รางวัลที่ 4' : '4th Prize',
            amount: '40,000 ฿'
        };
    }

    // Fifth prizes
    if (latestDraw.fifthPrizes && latestDraw.fifthPrizes.includes(number)) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: currentLang === 'th' ? 'รางวัลที่ 5' : '5th Prize',
            amount: '20,000 ฿'
        };
    }

    // Two digits
    const lastTwo = number.slice(-2);
    if (lastTwo === latestDraw.twoDigit) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: t('prize-2digit'),
            amount: '2,000 ฿'
        };
    }

    // Three front
    const firstThree = number.slice(0, 3);
    if (firstThree === latestDraw.threeFront) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: t('prize-3front'),
            amount: '4,000 ฿'
        };
    }

    // Three back
    const lastThree = number.slice(-3);
    if (lastThree === latestDraw.threeBack) {
        return {
            type: 'winner',
            title: t('congratulations'),
            subtitle: t('prize-3back'),
            amount: '4,000 ฿'
        };
    }

    // No match
    return {
        type: 'no-win',
        title: t('no-match'),
        subtitle: t('try-again'),
        amount: ''
    };
}

// Show result
function showResult(result) {
    const resultDiv = document.getElementById('result');

    const icon = result.type === 'winner' ? '🎉' : '🤞';

    resultDiv.className = `result ${result.type}`;
    resultDiv.innerHTML = `
        <div class="result-icon">${icon}</div>
        <h3>${result.title}</h3>
        ${result.subtitle ? `<div class="result-prize">${result.subtitle}</div>` : ''}
        ${result.amount ? `<div class="result-amount">${result.amount}</div>` : ''}
    `;

    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Lucky Number Generator
const generateBtn = document.getElementById('generateBtn');
if (generateBtn) {
    generateBtn.addEventListener('click', generateLuckyNumber);
}

function generateLuckyNumber() {
    const digits = document.querySelectorAll('.number-display .digit');

    // Disable button during animation
    generateBtn.disabled = true;

    // Animate each digit
    digits.forEach((digit, index) => {
        digit.classList.add('animate');

        // Generate random number after animation delay
        setTimeout(() => {
            const randomDigit = Math.floor(Math.random() * 10);
            digit.textContent = randomDigit;
            digit.classList.remove('animate');

            // Re-enable button after last digit
            if (index === digits.length - 1) {
                setTimeout(() => {
                    generateBtn.disabled = false;
                }, 300);
            }
        }, 100 * index);
    });
}

// Fetch historical lottery data
async function fetchHistoricalLottery() {
    console.log('📚 Fetching historical lottery data...');

    try {
        // Fetch list of past draws
        const listResponse = await fetch(LOTTERY_LIST_API);
        if (!listResponse.ok) {
            throw new Error(`HTTP error! status: ${listResponse.status}`);
        }

        const drawList = await listResponse.json();
        console.log(`📋 Found ${drawList.length} historical draws`);

        // Get the most recent draws (limit to HISTORY_LIMIT)
        const recentDrawIds = drawList.slice(0, HISTORY_LIMIT).map(draw => draw.id);

        // Fetch each draw's data
        const fetchPromises = recentDrawIds.map(async (id) => {
            try {
                const response = await fetch(`https://lotto.api.rayriffy.com/lotto/${id}`);
                if (response.ok) {
                    return await response.json();
                }
                return null;
            } catch (error) {
                console.warn(`⚠️ Failed to fetch draw ${id}:`, error);
                return null;
            }
        });

        const results = await Promise.all(fetchPromises);
        historicalDraws = results.filter(draw => draw && draw.status === 'success');

        console.log(`✅ Successfully fetched ${historicalDraws.length} historical draws`);
        return true;

    } catch (error) {
        console.error('❌ Error fetching historical data:', error);
        return false;
    }
}

// Number Analytics - REAL Historical Analysis
function calculateAnalytics() {
    const statusEl = document.getElementById('analyticsStatus');

    if (historicalDraws.length === 0) {
        console.log('⚠️ No historical data available for analytics');

        // Update status - FAILED
        if (statusEl) {
            statusEl.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                ⚠️ วิเคราะห์จาก 1 งวดเท่านั้น (ไม่สามารถโหลดข้อมูลย้อนหลัง)
            `;
            statusEl.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        }
        return;
    }

    console.log(`📊 Analyzing ${historicalDraws.length} draws for statistics`);

    // Collect all first prize numbers from historical draws
    const allFirstPrizes = [];
    const digitFrequency = {};

    historicalDraws.forEach(draw => {
        const prizes = draw.response.prizes;
        const firstPrize = prizes.find(p => p.id === 'prizeFirst');

        if (firstPrize && firstPrize.number && firstPrize.number[0]) {
            const number = firstPrize.number[0];
            allFirstPrizes.push(number);

            // Count each digit
            for (let digit of number) {
                digitFrequency[digit] = (digitFrequency[digit] || 0) + 1;
            }
        }
    });

    // Update status - SUCCESS
    if (statusEl) {
        statusEl.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ✅ วิเคราะห์จาก <strong>${historicalDraws.length} งวด</strong> (${allFirstPrizes.length} ตัวเลข)
        `;
        statusEl.style.background = 'linear-gradient(135deg, #059669, #047857)';
    }

    // Calculate most common digits (HOT NUMBERS)
    const sortedDigits = Object.entries(digitFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    // Update most common digits WITH VISIBLE COUNTS
    const mostCommonEl = document.getElementById('mostCommon');
    if (mostCommonEl && sortedDigits.length >= 3) {
        mostCommonEl.innerHTML = sortedDigits.map(([digit, count]) => `
            <div style="text-align: center;">
                <span class="stat-digit">${digit}</span>
                <div style="font-size: 0.75rem; color: var(--gold-dark); margin-top: 0.25rem; font-weight: 600;">
                    ${count}x
                </div>
            </div>
        `).join('');
    }

    // Calculate hot pairs from all first prizes
    const pairFrequency = {};
    allFirstPrizes.forEach(number => {
        for (let i = 0; i < number.length - 1; i++) {
            const pair = number.substring(i, i + 2);
            pairFrequency[pair] = (pairFrequency[pair] || 0) + 1;
        }
    });

    const sortedPairs = Object.entries(pairFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const hotPairsEl = document.getElementById('hotPairs');
    if (hotPairsEl) {
        hotPairsEl.innerHTML = sortedPairs
            .map(([pair, count]) =>
                `<span class="pair-badge">${pair} <small style="opacity: 0.8;">(${count}x)</small></span>`)
            .join('');
    }

    // Calculate average sum
    const sums = allFirstPrizes.map(number =>
        number.split('').reduce((acc, digit) => acc + parseInt(digit), 0)
    );
    const avgSum = Math.round(sums.reduce((a, b) => a + b, 0) / sums.length);

    const sumEl = document.getElementById('digitSum');
    if (sumEl) {
        const sumNumber = sumEl.querySelector('.sum-number');
        if (sumNumber) {
            sumNumber.textContent = avgSum;
        }
    }

    console.log('✅ Analytics calculated from historical data');
    console.log(`   Hot digits: ${sortedDigits.map(([d, c]) => `${d} (${c}x)`).join(', ')}`);
    console.log(`   Hot pairs: ${sortedPairs.map(([p, c]) => `${p} (${c}x)`).join(', ')}`);
    console.log(`   Average sum: ${avgSum}`);
}

// Dream to Numbers Interpreter
const dreamNumbers = {
    snake: ['341', '187', '925', '653'],
    water: ['402', '714', '896', '523'],
    monk: ['108', '999', '369', '777'],
    elephant: ['521', '839', '247', '615'],
    fish: ['618', '752', '394', '827'],
    money: ['888', '168', '678', '999'],
    temple: ['369', '108', '999', '555'],
    bird: ['273', '491', '685', '137']
};

const dreamMeanings = {
    th: {
        snake: 'งู - สัญลักษณ์แห่งโชคลาภ อำนาจ และความมั่งคั่ง',
        water: 'น้ำ - สัญลักษณ์แห่งความสดชื่น ชีวิตใหม่ และการไหลเวียนของโชคลาภ',
        monk: 'พระ - สัญลักษณ์แห่งบุญบารมี ความศักดิ์สิทธิ์ และความเป็นมงคล',
        elephant: 'ช้าง - สัญลักษณ์แห่งความเข้มแข็ง อำนาจ และความมั่นคง',
        fish: 'ปลา - สัญลักษณ์แห่งความอุดมสมบูรณ์ ความเจริญรุ่งเรือง',
        money: 'เงิน - สัญลักษณ์แห่งโชคลาภ ทรัพย์สิน และความมั่งคั่ง',
        temple: 'วัด - สัญลักษณ์แห่งบุญบารมี ความศักดิ์สิทธิ์ และการอำนวยพร',
        bird: 'นก - สัญลักษณ์แห่งอิสรภาพ ข่าวสาร และโอกาสดีๆ'
    },
    en: {
        snake: 'Snake - Symbol of fortune, power and wealth',
        water: 'Water - Symbol of freshness, new life and flow of fortune',
        monk: 'Monk - Symbol of merit, holiness and auspiciousness',
        elephant: 'Elephant - Symbol of strength, power and stability',
        fish: 'Fish - Symbol of abundance and prosperity',
        money: 'Money - Symbol of fortune, wealth and riches',
        temple: 'Temple - Symbol of merit, holiness and blessings',
        bird: 'Bird - Symbol of freedom, news and good opportunities'
    }
};

document.querySelectorAll('.dream-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const dream = btn.dataset.dream;
        const numbers = dreamNumbers[dream];
        const meaning = dreamMeanings[currentLang][dream];

        const resultEl = document.getElementById('dreamResult');
        resultEl.innerHTML = `
            <h3>${meaning}</h3>
            <p>${currentLang === 'th' ? 'เลขนำโชคของคุณ:' : 'Your lucky numbers:'}</p>
            <div class="dream-numbers">
                ${numbers.map(num => `<span class="dream-number">${num}</span>`).join('')}
            </div>
        `;
        resultEl.classList.remove('hidden');

        // Scroll to result
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// Lucky Color of the Day
const thaiColors = {
    0: { // Sunday
        th: { name: 'แดง', desc: 'วันอาทิตย์ - สีแดง สัญลักษณ์แห่งพลังและความกล้าหาญ' },
        en: { name: 'Red', desc: 'Sunday - Red symbolizes power and courage' },
        color: '#DC143C',
        emoji: '🔴',
        numbers: ['700', '711', '722', '733']
    },
    1: { // Monday
        th: { name: 'เหลือง', desc: 'วันจันทร์ - สีเหลือง สัญลักษณ์แห่งพระมหากษัตริย์' },
        en: { name: 'Yellow', desc: 'Monday - Yellow symbolizes royalty' },
        color: '#FFD700',
        emoji: '💛',
        numbers: ['100', '111', '122', '133']
    },
    2: { // Tuesday
        th: { name: 'ชมพู', desc: 'วันอังคาร - สีชมพู สัญลักษณ์แห่งความรักและความอ่อนโยน' },
        en: { name: 'Pink', desc: 'Tuesday - Pink symbolizes love and gentleness' },
        color: '#FFB6C1',
        emoji: '🩷',
        numbers: ['200', '211', '222', '233']
    },
    3: { // Wednesday
        th: { name: 'เขียว', desc: 'วันพุธ - สีเขียว สัญลักษณ์แห่งความสดชื่นและการเติบโต' },
        en: { name: 'Green', desc: 'Wednesday - Green symbolizes freshness and growth' },
        color: '#059669',
        emoji: '💚',
        numbers: ['300', '311', '322', '333']
    },
    4: { // Thursday
        th: { name: 'ส้ม', desc: 'วันพฤหัสบดี - สีส้ม สัญลักษณ์แห่งความอบอุ่นและพลังชีวิต' },
        en: { name: 'Orange', desc: 'Thursday - Orange symbolizes warmth and vitality' },
        color: '#FF9933',
        emoji: '🧡',
        numbers: ['400', '411', '422', '433']
    },
    5: { // Friday
        th: { name: 'ฟ้า', desc: 'วันศุกร์ - สีฟ้า สัญลักษณ์แห่งความสงบและภูมิปัญญา' },
        en: { name: 'Blue', desc: 'Friday - Blue symbolizes peace and wisdom' },
        color: '#3B82F6',
        emoji: '💙',
        numbers: ['500', '511', '522', '533']
    },
    6: { // Saturday
        th: { name: 'ม่วง', desc: 'วันเสาร์ - สีม่วง สัญลักษณ์แห่งความมั่นคงและความเป็นผู้นำ' },
        en: { name: 'Purple', desc: 'Saturday - Purple symbolizes stability and leadership' },
        color: '#7C3AED',
        emoji: '💜',
        numbers: ['600', '611', '622', '633']
    }
};

function displayTodayColor() {
    const today = new Date().getDay();
    const colorData = thaiColors[today];
    const lang = currentLang || 'th';

    const displayEl = document.querySelector('.color-display');
    const nameEl = document.querySelector('.color-name');
    const descEl = document.querySelector('.color-desc');
    const numbersEl = document.querySelector('.color-numbers');

    if (displayEl && colorData) {
        displayEl.style.backgroundColor = colorData.color;
        displayEl.textContent = colorData.emoji;
        nameEl.textContent = colorData[lang].name;
        descEl.textContent = colorData[lang].desc;
        numbersEl.innerHTML = colorData.numbers
            .map(num => `<span class="color-number">${num}</span>`)
            .join('');
    }
}

// Initialize features on load
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch latest draw for checker
    await fetchLatestLottery();

    // Display today's lucky color
    displayTodayColor();
});

// ========================================
// FEATURE 4: Lucky Number Combos
// ========================================
const comboStrategies = {
    dragon: {
        th: { name: 'มังกรทอง', desc: 'เลขคู่และเลขคี่สลับกัน - ความสมดุลแห่งพลัง' },
        en: { name: 'Golden Dragon', desc: 'Alternating even and odd numbers - Balance of power' },
        generate: () => {
            const result = [];
            for (let i = 0; i < 6; i++) {
                const digit = i % 2 === 0 ?
                    Math.floor(Math.random() * 5) * 2 : // Even: 0,2,4,6,8
                    Math.floor(Math.random() * 5) * 2 + 1; // Odd: 1,3,5,7,9
                result.push(digit);
            }
            return result.join('');
        }
    },
    phoenix: {
        th: { name: 'นกฟีนิกซ์', desc: 'เลขสูงและเลขต่ำสมดุล - การเกิดใหม่' },
        en: { name: 'Phoenix Rising', desc: 'Balanced high and low numbers - Rebirth' },
        generate: () => {
            const result = [];
            for (let i = 0; i < 6; i++) {
                const digit = i % 2 === 0 ?
                    Math.floor(Math.random() * 5) : // Low: 0-4
                    Math.floor(Math.random() * 5) + 5; // High: 5-9
                result.push(digit);
            }
            return result.join('');
        }
    },
    lucky7: {
        th: { name: 'เลขเจ็ดนำโชค', desc: 'เลขที่บวกกันได้ 7 - เลขศักดิ์สิทธิ์' },
        en: { name: 'Lucky Seven', desc: 'Numbers that sum to 7 - Sacred number' },
        generate: () => {
            const result = [];
            for (let i = 0; i < 3; i++) {
                const first = Math.floor(Math.random() * 8);
                const second = 7 - first;
                result.push(first, second);
            }
            return result.join('');
        }
    },
    royal: {
        th: { name: 'ราชันย์', desc: 'เลข 1, 6, 8, 9 - เลขมงคลไทย' },
        en: { name: 'Royal Fortune', desc: 'Numbers 1, 6, 8, 9 - Thai auspicious numbers' },
        generate: () => {
            const luckyDigits = [1, 6, 8, 9];
            const result = [];
            for (let i = 0; i < 6; i++) {
                result.push(luckyDigits[Math.floor(Math.random() * luckyDigits.length)]);
            }
            return result.join('');
        }
    }
};

document.querySelectorAll('.combo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const comboType = btn.dataset.combo;
        const combo = comboStrategies[comboType];
        const lang = currentLang || 'th';

        const number = combo.generate();

        const resultEl = document.getElementById('comboResult');
        resultEl.innerHTML = `
            <h3>${combo[lang].name}</h3>
            <p>${combo[lang].desc}</p>
            <div class="combo-number">${number}</div>
            <small style="opacity: 0.7;">${lang === 'th' ? 'สูตรนี้เน้น' : 'This strategy focuses on'}: ${combo[lang].desc.split('-')[1]}</small>
        `;
        resultEl.classList.remove('hidden');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// ========================================
// FEATURE 5: Thai Zodiac Lucky Numbers
// ========================================
const zodiacAnimals = {
    rat: {
        th: { name: 'ชวด (หนู)', desc: 'ปีชวด - ฉลาด ว่องไว เปิดรับโอกาสใหม่', years: '2484, 2496, 2508, 2520, 2532, 2544, 2556, 2568' },
        en: { name: 'Rat', desc: 'Year of the Rat - Clever, agile, open to new opportunities', years: '1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025' },
        numbers: ['101', '213', '325', '437']
    },
    ox: {
        th: { name: 'ฉลู (วัว)', desc: 'ปีฉลู - อดทน แข็งแกร่ง น่าเชื่อถือ', years: '2485, 2497, 2509, 2521, 2533, 2545, 2557, 2569' },
        en: { name: 'Ox', desc: 'Year of the Ox - Patient, strong, reliable', years: '1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026' },
        numbers: ['202', '314', '426', '538']
    },
    tiger: {
        th: { name: 'ขาล (เสือ)', desc: 'ปีขาล - กล้าหาญ มีพลัง เป็นผู้นำ', years: '2486, 2498, 2510, 2522, 2534, 2546, 2558, 2570' },
        en: { name: 'Tiger', desc: 'Year of the Tiger - Brave, powerful, leader', years: '1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027' },
        numbers: ['303', '415', '527', '639']
    },
    rabbit: {
        th: { name: 'เถาะ (กระต่าย)', desc: 'ปีเถาะ - อ่อนโยน มีเสน่ห์ โชคดี', years: '2487, 2499, 2511, 2523, 2535, 2547, 2559, 2571' },
        en: { name: 'Rabbit', desc: 'Year of the Rabbit - Gentle, charming, lucky', years: '1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028' },
        numbers: ['404', '516', '628', '740']
    },
    dragon: {
        th: { name: 'มะโรง (มังกร)', desc: 'ปีมะโรง - ทรงพลัง โชคดี สง่างาม', years: '2488, 2500, 2512, 2524, 2536, 2548, 2560, 2572' },
        en: { name: 'Dragon', desc: 'Year of the Dragon - Powerful, lucky, majestic', years: '1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029' },
        numbers: ['505', '617', '729', '841']
    },
    snake: {
        th: { name: 'มะเส็ง (งู)', desc: 'ปีมะเส็ง - ฉลาด ลึกลับ มีเสน่ห์', years: '2489, 2501, 2513, 2525, 2537, 2549, 2561, 2573' },
        en: { name: 'Snake', desc: 'Year of the Snake - Wise, mysterious, charming', years: '1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030' },
        numbers: ['606', '718', '820', '932']
    },
    horse: {
        th: { name: 'มะเมีย (ม้า)', desc: 'ปีมะเมีย - เร็วไว กระฉับกระเฉง ตรงไปตรงมา', years: '2490, 2502, 2514, 2526, 2538, 2550, 2562, 2574' },
        en: { name: 'Horse', desc: 'Year of the Horse - Swift, energetic, straightforward', years: '1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031' },
        numbers: ['707', '819', '921', '133']
    },
    goat: {
        th: { name: 'มะแม (แพะ)', desc: 'ปีมะแม - สร้างสรรค์ ใจดี สงบเสงี่ยม', years: '2491, 2503, 2515, 2527, 2539, 2551, 2563, 2575' },
        en: { name: 'Goat', desc: 'Year of the Goat - Creative, kind, peaceful', years: '1948, 1960, 1972, 1984, 1996, 2008, 2020, 2032' },
        numbers: ['808', '910', '122', '234']
    },
    monkey: {
        th: { name: 'มะเมีย (ลิง)', desc: 'ปีมะเมีย - ฉลาด เล่ห์เหลี่ยม สนุกสนาน', years: '2492, 2504, 2516, 2528, 2540, 2552, 2564, 2576' },
        en: { name: 'Monkey', desc: 'Year of the Monkey - Clever, cunning, playful', years: '1949, 1961, 1973, 1985, 1997, 2009, 2021, 2033' },
        numbers: ['909', '111', '223', '335']
    },
    rooster: {
        th: { name: 'มะโรง (ไก่)', desc: 'ปีมะโรง - ซื่อสัตย์ ตรงต่อเวลา มั่นใจ', years: '2493, 2505, 2517, 2529, 2541, 2553, 2565, 2577' },
        en: { name: 'Rooster', desc: 'Year of the Rooster - Honest, punctual, confident', years: '1950, 1962, 1974, 1986, 1998, 2010, 2022, 2034' },
        numbers: ['110', '212', '324', '436']
    },
    dog: {
        th: { name: 'มะเส็ง (หมา)', desc: 'ปีมะเส็ง - ซื่อสัตย์ ภักดี ปกป้องคนที่รัก', years: '2494, 2506, 2518, 2530, 2542, 2554, 2566, 2578' },
        en: { name: 'Dog', desc: 'Year of the Dog - Loyal, faithful, protective', years: '1951, 1963, 1975, 1987, 1999, 2011, 2023, 2035' },
        numbers: ['211', '313', '425', '537']
    },
    pig: {
        th: { name: 'กุน (หมู)', desc: 'ปีกุน - มีโชค ใจดี เอื้อเฟื้อเผื่อแผ่', years: '2495, 2507, 2519, 2531, 2543, 2555, 2567, 2579' },
        en: { name: 'Pig', desc: 'Year of the Pig - Fortunate, kind, generous', years: '1952, 1964, 1976, 1988, 2000, 2012, 2024, 2036' },
        numbers: ['312', '414', '526', '638']
    }
};

document.querySelectorAll('.zodiac-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const animal = btn.dataset.animal;
        const zodiac = zodiacAnimals[animal];
        const lang = currentLang || 'th';

        const resultEl = document.getElementById('zodiacResult');
        resultEl.innerHTML = `
            <h3>${btn.textContent}</h3>
            <p>${zodiac[lang].desc}</p>
            <div style="margin: 1rem 0; font-size: 0.9rem; opacity: 0.9;">
                ${lang === 'th' ? 'ปีเกิด' : 'Birth Years'}: ${zodiac[lang].years}
            </div>
            <div class="zodiac-numbers">
                ${zodiac.numbers.map(num => `<span class="zodiac-number">${num}</span>`).join('')}
            </div>
        `;
        resultEl.classList.remove('hidden');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// ========================================
// FEATURE 6: Number Scanner
// ========================================
const scanInput = document.getElementById('scanNumber');
const scanBtn = document.getElementById('scanBtn');

if (scanInput) {
    // Only allow digits, max 6
    scanInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });
}

if (scanBtn) {
    scanBtn.addEventListener('click', () => {
        const number = scanInput.value.trim();
        const lang = currentLang || 'th';

        if (number.length !== 6) {
            const resultEl = document.getElementById('scanResult');
            resultEl.innerHTML = `
                <div style="color: var(--crimson);">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${lang === 'th' ? 'กรุณากรอกหมายเลข 6 หลัก' : 'Please enter 6 digits'}
                </div>
            `;
            resultEl.classList.remove('hidden');
            return;
        }

        // Check against current draw
        const result = checkNumber(number);

        const resultEl = document.getElementById('scanResult');
        resultEl.innerHTML = `
            <div class="scan-number">${number}</div>
            <div class="${result.type === 'winner' ? 'scan-winner' : 'scan-no-win'}">
                ${result.type === 'winner' ? '🎉' : '🔍'}
                ${result.title}
            </div>
            ${result.subtitle ? `<div style="font-size: 1rem; margin-top: 0.5rem;">${result.subtitle}</div>` : ''}
            ${result.amount ? `<div style="font-size: 1.5rem; font-weight: 700; color: var(--gold); margin-top: 0.5rem;">${result.amount}</div>` : ''}
        `;
        resultEl.classList.remove('hidden');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// ========================================
// FEATURE 7: Spin the Wheel
// ========================================
const luckyWheel = document.getElementById('luckyWheel');
const spinBtn = document.getElementById('spinBtn');
let isSpinning = false;

if (spinBtn && luckyWheel) {
    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;

        isSpinning = true;
        spinBtn.disabled = true;

        const lang = currentLang || 'th';

        // Random rotations (3-5 full spins + random position)
        const spins = 3 + Math.floor(Math.random() * 3);
        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = (spins * 360) + randomDegree;

        luckyWheel.style.transform = `rotate(${totalRotation}deg)`;

        // Calculate which number landed on (accounting for 10 segments)
        setTimeout(() => {
            const segmentAngle = 360 / 10;
            const normalizedAngle = randomDegree % 360;
            const selectedDigit = Math.floor((360 - normalizedAngle) / segmentAngle) % 10;

            // Generate 6 digits where one is the selected digit
            const luckyNumber = [];
            const selectedPosition = Math.floor(Math.random() * 6);
            for (let i = 0; i < 6; i++) {
                if (i === selectedPosition) {
                    luckyNumber.push(selectedDigit);
                } else {
                    luckyNumber.push(Math.floor(Math.random() * 10));
                }
            }

            const resultEl = document.getElementById('wheelResult');
            resultEl.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎰</div>
                <h3>${lang === 'th' ? 'หมุนได้เลข' : 'You Spun'}: ${selectedDigit}</h3>
                <p>${lang === 'th' ? 'เลขนำโชคของคุณ' : 'Your lucky number'}:</p>
                <div class="wheel-lucky-number">${luckyNumber.join('')}</div>
            `;
            resultEl.classList.remove('hidden');
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            isSpinning = false;
            spinBtn.disabled = false;
        }, 3000);
    });
}

// ========================================
// FEATURE 8: Temple Fortune Sticks
// ========================================
const fortuneSticks = document.getElementById('fortuneSticks');
const shakeBtn = document.getElementById('shakeBtn');

const fortuneMessages = {
    th: [
        { level: 'มหาเศรษฐี', desc: 'โชคใหญ่มาแรง! ความมั่งคั่งรออยู่', numbers: ['888', '168', '678', '999'] },
        { level: 'เศรษฐี', desc: 'โชคดีมาก! ทรัพย์สินจะเพิ่มพูน', numbers: ['666', '789', '456', '321'] },
        { level: 'ปานกลาง', desc: 'โชคดี ชีวิตสงบสุข', numbers: ['369', '147', '258', '741'] },
        { level: 'ต้องพยายาม', desc: 'ความพยายามจะนำมาซึ่งความสำเร็จ', numbers: ['123', '234', '345', '456'] },
        { level: 'โชคน้อย', desc: 'อดทนและมองหาโอกาสใหม่', numbers: ['100', '200', '300', '400'] }
    ],
    en: [
        { level: 'Great Fortune', desc: 'Huge luck coming! Wealth awaits', numbers: ['888', '168', '678', '999'] },
        { level: 'Good Fortune', desc: 'Very lucky! Wealth will increase', numbers: ['666', '789', '456', '321'] },
        { level: 'Moderate', desc: 'Good luck, peaceful life', numbers: ['369', '147', '258', '741'] },
        { level: 'Keep Trying', desc: 'Effort will bring success', numbers: ['123', '234', '345', '456'] },
        { level: 'Small Luck', desc: 'Be patient and look for new opportunities', numbers: ['100', '200', '300', '400'] }
    ]
};

if (shakeBtn && fortuneSticks) {
    shakeBtn.addEventListener('click', () => {
        const lang = currentLang || 'th';

        // Animate sticks shaking
        const sticks = fortuneSticks.querySelectorAll('.stick');
        sticks.forEach((stick, index) => {
            setTimeout(() => {
                stick.classList.add('shake');
                setTimeout(() => stick.classList.remove('shake'), 500);
            }, index * 100);
        });

        // Random fortune after shaking completes
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * fortuneMessages[lang].length);
            const fortune = fortuneMessages[lang][randomIndex];

            const resultEl = document.getElementById('fortuneResult');
            resultEl.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎋</div>
                <h3>${fortune.level}</h3>
                <p style="font-size: 1.1rem; margin: 1rem 0;">${fortune.desc}</p>
                <div>${lang === 'th' ? 'เลขมงคล' : 'Lucky Numbers'}:</div>
                <div class="fortune-numbers">
                    ${fortune.numbers.map(num => `<span class="fortune-number">${num}</span>`).join('')}
                </div>
            `;
            resultEl.classList.remove('hidden');
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 600);
    });
}

// ========================================
// FEATURE 10: Number Meanings Encyclopedia
// ========================================
const numberMeanings = {
    th: {
        0: { name: 'ศูนย์', meaning: 'จุดเริ่มต้น ความว่างเปล่า ศักยภาพไร้ขีดจำกัด', luck: 'โอกาสใหม่รออยู่' },
        1: { name: 'หนึ่ง', meaning: 'ความเป็นหนึ่ง ความเป็นผู้นำ จุดเริ่มต้น', luck: 'ความสำเร็จในการเป็นผู้นำ' },
        2: { name: 'สอง', meaning: 'คู่ ความสมดุล ความร่วมมือ', luck: 'ความสัมพันธ์ที่ดี' },
        3: { name: 'สาม', meaning: 'มงคล สมบูรณ์ พระรัตนตรัย', luck: 'ความเป็นสิริมงคล' },
        4: { name: 'สี่', meaning: 'มั่นคง แข็งแกร่ง สี่ทิศ', luck: 'รากฐานที่มั่นคง' },
        5: { name: 'ห้า', meaning: 'ธาตุทั้งห้า สมดุล กลาง', luck: 'สมดุลในชีวิต' },
        6: { name: 'หก', meaning: 'มงคล โชคลาภ ราบรื่น', luck: 'ความราบรื่นในชีวิต' },
        7: { name: 'เจ็ด', meaning: 'ศักดิ์สิทธิ์ พระรัตนตรัย+ครู+พ่อแม่', luck: 'ความศักดิ์สิทธิ์ปกป้อง' },
        8: { name: 'แปด', meaning: 'มั่งคั่ง เจริญรุ่งเรือง อินฟินิตี้', luck: 'ทรัพย์สมบัติเพิ่มพูน' },
        9: { name: 'เก้า', meaning: 'ก้าวหน้า เกือบถึงจุดสูงสุด', luck: 'ความก้าวหน้าในชีวิต' }
    },
    en: {
        0: { name: 'Zero', meaning: 'Beginning, emptiness, unlimited potential', luck: 'New opportunities await' },
        1: { name: 'One', meaning: 'Unity, leadership, beginning', luck: 'Success in leadership' },
        2: { name: 'Two', meaning: 'Pair, balance, cooperation', luck: 'Good relationships' },
        3: { name: 'Three', meaning: 'Auspicious, complete, Triple Gem', luck: 'Auspiciousness' },
        4: { name: 'Four', meaning: 'Stable, strong, four directions', luck: 'Strong foundation' },
        5: { name: 'Five', meaning: 'Five elements, balance, center', luck: 'Life balance' },
        6: { name: 'Six', meaning: 'Auspicious, fortune, smooth', luck: 'Smooth sailing' },
        7: { name: 'Seven', meaning: 'Sacred, Triple Gem + teachers + parents', luck: 'Sacred protection' },
        8: { name: 'Eight', meaning: 'Wealth, prosperity, infinity', luck: 'Wealth increases' },
        9: { name: 'Nine', meaning: 'Progress, nearly peak', luck: 'Progress in life' }
    }
};

document.querySelectorAll('.meaning-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const number = btn.dataset.number;
        const lang = currentLang || 'th';
        const meaning = numberMeanings[lang][number];

        const resultEl = document.getElementById('meaningResult');
        resultEl.innerHTML = `
            <div class="meaning-number">${number}</div>
            <h3>${meaning.name}</h3>
            <p style="font-size: 1.1rem; margin: 1rem 0; line-height: 1.6;">
                ${meaning.meaning}
            </p>
            <div style="background: linear-gradient(135deg, var(--gold), var(--gold-dark));
                        padding: 1rem; border-radius: 12px; margin-top: 1rem;">
                <strong>${lang === 'th' ? '🍀 นำโชค:' : '🍀 Lucky:'}</strong> ${meaning.luck}
            </div>
        `;
        resultEl.classList.remove('hidden');
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

console.log('✅ All fun features loaded successfully!');
