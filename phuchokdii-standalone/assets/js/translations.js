// Translation data
const translations = {
    th: {
        'login': 'เข้าสู่ระบบ',
        'hero-title': 'ตรวจหวยไทย',
        'hero-subtitle': 'Thai Lottery Checker',
        'hero-description': 'ตรวจสอบผลรางวัลสลากกินแบ่งรัฐบาลไทย รวดเร็ว แม่นยำ',
        'check-title': 'ตรวจหวยของคุณ',
        'check-subtitle': 'กรอกหมายเลข 6 หลัก',
        'check-placeholder': 'กรอกหมายเลข 6 หลัก',
        'check-button': 'ตรวจสอบ',
        'latest-draw': 'ผลรางวัลล่าสุด',
        'prize-first': 'รางวัลที่ 1',
        'prize-2digit': 'เลขท้าย 2 ตัว',
        'prize-3front': 'เลขหน้า 3 ตัว',
        'prize-3back': 'เลขท้าย 3 ตัว',
        'footer-text': 'เพื่อความบันเทิงเท่านั้น',
        'congratulations': 'ยินดีด้วย! คุณถูกรางวัล!',
        'no-match': 'เสียใจด้วย ไม่ถูกรางวัล',
        'try-again': 'โชคดีกว่านี้ในงวดหน้า!',
        'invalid-number': 'กรุณากรอกหมายเลข 6 หลัก',
        'generator-title': 'สุ่มเลขนำโชค',
        'generator-subtitle': 'ให้เราช่วยเลือกเลขโชคดีให้คุณ',
        'generator-button': 'สุ่มเลขโชคดี',
        'analytics-title': 'วิเคราะห์สถิติหวย',
        'analytics-subtitle': 'วิเคราะห์จาก 20 งวดล่าสุด',
        'loading-analytics': 'กำลังโหลดข้อมูล...',
        'analytics-failed': '⚠️ วิเคราะห์จาก 1 งวดเท่านั้น (ไม่สามารถโหลดข้อมูลย้อนหลัง)',
        'disclaimer-title': 'คำเตือน:',
        'disclaimer-text': 'สถิติเหล่านี้ใช้เพื่อความบันเทิงเท่านั้น หวยเป็นการสุ่มที่เป็นอิสระ ไม่สามารถทำนายผลรางวัลได้',
        'dream-title': 'ฝันเห็นอะไร?',
        'dream-subtitle': 'ฝันบอกเลข - ตีความฝันเป็นตัวเลขนำโชค',
        'dream-snake': 'งู',
        'dream-water': 'น้ำ',
        'dream-monk': 'พระ',
        'dream-elephant': 'ช้าง',
        'dream-fish': 'ปลา',
        'dream-money': 'เงิน',
        'dream-temple': 'วัด',
        'dream-bird': 'นก',
        'color-title': 'สีมงคลประจำวัน',
        'color-subtitle': 'สีนำโชคตามวันเกิด',
        'jackpot-title': 'ถ้าถูกรางวัลที่ 1',
        'jackpot-subtitle': 'คุณจะซื้ออะไรได้บ้าง? (6,000,000 ฿)',
        'jackpot-house': 'บ้าน',
        'jackpot-car': 'รถยนต์',
        'jackpot-travel': 'ท่องเที่ยว',
        'jackpot-noodles': 'ก๋วยเตี๋ยว',
        'jackpot-iphone': 'iPhone',
        'jackpot-education': 'การศึกษา',
        'combos-title': 'สูตรเลขนำโชค',
        'combos-subtitle': 'เลือกสูตรเลขโชคดีที่เหมาะกับคุณ',
        'combo-dragon': 'มังกรทอง',
        'combo-dragon-desc': 'เลขคู่+เลขคี่',
        'combo-phoenix': 'นกฟีนิกซ์',
        'combo-phoenix-desc': 'สูง+ต่ำ',
        'combo-lucky7': 'เลข 7 นำโชค',
        'combo-lucky7-desc': 'บวกได้ 7',
        'combo-royal': 'ราชันย์',
        'combo-royal-desc': 'เลขมงคล',
        'zodiac-title': 'ปีนักษัตรของคุณ',
        'zodiac-subtitle': 'เลือกปีเกิดตามนักษัตรไทย 12 ปี',
        'zodiac-rat': 'ชวด (หนู)',
        'zodiac-ox': 'ฉลู (วัว)',
        'zodiac-tiger': 'ขาล (เสือ)',
        'zodiac-rabbit': 'เถาะ (กระต่าย)',
        'zodiac-dragon': 'มะโรง (มังกร)',
        'zodiac-snake': 'มะเส็ง (งู)',
        'zodiac-horse': 'มะเมีย (ม้า)',
        'zodiac-goat': 'มะแม (แพะ)',
        'zodiac-monkey': 'มะเมีย (ลิง)',
        'zodiac-rooster': 'มะโรง (ไก่)',
        'zodiac-dog': 'มะเส็ง (หมา)',
        'zodiac-pig': 'กุน (หมู)',
        'scanner-title': 'สแกนเลขจากชีวิตประจำวัน',
        'scanner-subtitle': 'เห็นเลข 6 หลักที่ไหน? ตรวจสอบความหมาย',
        'scanner-placeholder': 'กรอกเลข 6 หลัก',
        'scanner-button': 'ตรวจสอบเลข',
        'wheel-title': 'หมุนวงล้อนำโชค',
        'wheel-subtitle': 'หมุนเพื่อรับเลขโชคดี',
        'wheel-button': 'หมุนวงล้อ',
        'fortune-title': 'เขย่าซำซีวัด',
        'fortune-subtitle': 'เขย่าเพื่อขอพรและรับเลขมงคล',
        'fortune-button': 'เขย่าเพื่อขอพร',
        'meanings-title': 'ความหมายของตัวเลข',
        'meanings-subtitle': 'เลือกตัวเลขเพื่อดูความหมายในวัฒนธรรมไทย'
    },
    en: {
        'login': 'Login',
        'hero-title': 'Thai Lottery Checker',
        'hero-subtitle': 'ตรวจหวยไทย',
        'hero-description': 'Check Thai Government Lottery results quickly and accurately',
        'check-title': 'Check Your Number',
        'check-subtitle': 'Enter 6-digit number',
        'check-placeholder': 'Enter 6-digit number',
        'check-button': 'Check',
        'latest-draw': 'Latest Draw Results',
        'prize-first': '1st Prize',
        'prize-2digit': 'Last 2 Digits',
        'prize-3front': 'First 3 Digits',
        'prize-3back': 'Last 3 Digits',
        'footer-text': 'For entertainment only',
        'congratulations': 'Congratulations! You won!',
        'no-match': 'Sorry, no winning match',
        'try-again': 'Better luck next time!',
        'invalid-number': 'Please enter 6 digits',
        'generator-title': 'Lucky Number Generator',
        'generator-subtitle': 'Let us help you pick your lucky numbers',
        'generator-button': 'Generate Lucky Numbers',
        'analytics-title': 'Number Analytics',
        'analytics-subtitle': 'Analyzed from last 20 draws',
        'loading-analytics': 'Loading data...',
        'analytics-failed': '⚠️ Analyzed from 1 draw only (historical data unavailable)',
        'disclaimer-title': 'Warning:',
        'disclaimer-text': 'These statistics are for entertainment only. Lottery is random and cannot be predicted.',
        'dream-title': 'What Did You Dream?',
        'dream-subtitle': 'Dreams tell numbers - Interpret your dreams into lucky numbers',
        'dream-snake': 'Snake',
        'dream-water': 'Water',
        'dream-monk': 'Monk',
        'dream-elephant': 'Elephant',
        'dream-fish': 'Fish',
        'dream-money': 'Money',
        'dream-temple': 'Temple',
        'dream-bird': 'Bird',
        'color-title': 'Lucky Color of the Day',
        'color-subtitle': 'Lucky color based on your birthday',
        'jackpot-title': 'If You Won 1st Prize',
        'jackpot-subtitle': 'What could you buy? (6,000,000 ฿)',
        'jackpot-house': 'House',
        'jackpot-car': 'Car',
        'jackpot-travel': 'Travel',
        'jackpot-noodles': 'Noodles',
        'jackpot-iphone': 'iPhone',
        'jackpot-education': 'Education',
        'combos-title': 'Lucky Number Combos',
        'combos-subtitle': 'Choose your lucky number strategy',
        'combo-dragon': 'Golden Dragon',
        'combo-dragon-desc': 'Even+Odd',
        'combo-phoenix': 'Phoenix Rising',
        'combo-phoenix-desc': 'High+Low',
        'combo-lucky7': 'Lucky Seven',
        'combo-lucky7-desc': 'Sum to 7',
        'combo-royal': 'Royal Fortune',
        'combo-royal-desc': 'Auspicious',
        'zodiac-title': 'Your Zodiac Year',
        'zodiac-subtitle': 'Choose your birth year in Thai 12-year cycle',
        'zodiac-rat': 'Rat',
        'zodiac-ox': 'Ox',
        'zodiac-tiger': 'Tiger',
        'zodiac-rabbit': 'Rabbit',
        'zodiac-dragon': 'Dragon',
        'zodiac-snake': 'Snake',
        'zodiac-horse': 'Horse',
        'zodiac-goat': 'Goat',
        'zodiac-monkey': 'Monkey',
        'zodiac-rooster': 'Rooster',
        'zodiac-dog': 'Dog',
        'zodiac-pig': 'Pig',
        'scanner-title': 'Scan Numbers from Daily Life',
        'scanner-subtitle': 'See a 6-digit number anywhere? Check its meaning',
        'scanner-placeholder': 'Enter 6 digits',
        'scanner-button': 'Check Number',
        'wheel-title': 'Spin the Lucky Wheel',
        'wheel-subtitle': 'Spin to receive your lucky number',
        'wheel-button': 'Spin the Wheel',
        'fortune-title': 'Shake Temple Fortune Sticks',
        'fortune-subtitle': 'Shake for blessings and lucky numbers',
        'fortune-button': 'Shake for Blessing',
        'meanings-title': 'Number Meanings',
        'meanings-subtitle': 'Select a number to see its meaning in Thai culture'
    }
};

// Current language
let currentLang = localStorage.getItem('lottery_lang') || 'th';

// Update all translatable elements
function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lottery_lang', lang);
    document.documentElement.lang = lang;

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});
