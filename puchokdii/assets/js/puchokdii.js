// PuChokDii - Thai Lottery Platform JavaScript

class PuChokDii {
    constructor() {
        this.authToken = localStorage.getItem('puchokdii_token');
        this.user = null;
        this.currentDraw = null;

        this.init();
    }

    async init() {
        // Check for magic link token in URL
        await this.checkMagicLinkToken();

        this.initEventListeners();
        this.loadLatestDraw();
        this.initAnimations();

        // Update UI if logged in
        if (this.authToken) {
            await this.loadUserData();
        }

        console.log('🍀 PuChokDii initialized - ผู้โชคดีแห่งความรู้และโชคลาภ');
    }

    async checkMagicLinkToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            try {
                // Verify the magic link token
                const response = await fetch(`${window.PUCHOKDII_CONFIG.API_BASE}/api/auth/verify-magic-link`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    // Store auth token
                    localStorage.setItem('puchokdii_token', data.token);
                    this.authToken = data.token;
                    this.user = data.user;

                    // Remove token from URL
                    window.history.replaceState({}, document.title, window.location.pathname);

                    // Show success message
                    showNotification('เข้าสู่ระบบสำเร็จ! / Login successful!', 'success');
                } else {
                    throw new Error(data.message || 'Invalid login link');
                }
            } catch (error) {
                console.error('Magic link verification error:', error);
                showNotification('ลิงก์เข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ / Invalid or expired login link', 'error');
                // Remove invalid token from URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }

    async loadUserData() {
        try {
            const response = await fetch(`${window.PUCHOKDII_CONFIG.API_BASE}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.user) {
                this.user = data.user;
                this.updateUIForLoggedInUser();
            } else {
                // Invalid token, clear it
                localStorage.removeItem('puchokdii_token');
                this.authToken = null;
            }
        } catch (error) {
            console.error('Load user data error:', error);
        }
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.user) {
            loginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>${this.user.email}</span>
            `;
            loginBtn.onclick = () => this.showUserMenu();
        }
    }

    showUserMenu() {
        // Simple logout for now
        if (confirm('ออกจากระบบ? / Logout?')) {
            localStorage.removeItem('puchokdii_token');
            this.authToken = null;
            this.user = null;
            location.reload();
        }
    }

    initEventListeners() {
        // Navigation toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Modal controls
        this.initModalControls();

        // Form submissions
        this.initForms();

        // Smooth scrolling
        this.initSmoothScrolling();
    }

    initModalControls() {
        // Login modal
        const loginModal = document.getElementById('loginModal');
        const loginBtn = document.getElementById('loginBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const modalClose = document.getElementById('modalClose');

        [loginBtn, getStartedBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.openModal('loginModal'));
            }
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal('loginModal'));
        }

        // Quick check modal
        const checkModal = document.getElementById('checkModal');
        const checkNumbersBtn = document.getElementById('checkNumbersBtn');
        const checkModalClose = document.getElementById('checkModalClose');

        if (checkNumbersBtn) {
            checkNumbersBtn.addEventListener('click', () => this.openModal('checkModal'));
        }

        if (checkModalClose) {
            checkModalClose.addEventListener('click', () => this.closeModal('checkModal'));
        }

        // Close modals on background click
        [loginModal, checkModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal.id);
                    }
                });
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    initForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Quick check form
        const quickCheckForm = document.getElementById('quickCheckForm');
        if (quickCheckForm) {
            quickCheckForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickCheck();
            });
        }

        // Number input formatting
        const checkNumbers = document.getElementById('checkNumbers');
        if (checkNumbers) {
            checkNumbers.addEventListener('input', (e) => {
                // Only allow numbers
                e.target.value = e.target.value.replace(/\D/g, '');

                // Limit to 6 digits
                if (e.target.value.length > 6) {
                    e.target.value = e.target.value.slice(0, 6);
                }
            });
        }
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initAnimations() {
        // Add entrance animations
        this.observeElements();

        // Number animation
        this.animateNumbers();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    animateNumbers() {
        // Animate the lottery numbers with a subtle glow effect
        const numbers = document.querySelectorAll('.number-display .number');

        numbers.forEach((number, index) => {
            setTimeout(() => {
                number.style.animation = 'numberGlow 2s ease-in-out infinite alternate';
                number.style.animationDelay = `${index * 0.1}s`;
            }, 1000);
        });

        // Add CSS animation if not already present
        if (!document.querySelector('#numberAnimation')) {
            const style = document.createElement('style');
            style.id = 'numberAnimation';
            style.textContent = `
                @keyframes numberGlow {
                    from {
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    to {
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1), 0 0 20px rgba(255,215,0,0.3);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        if (!email) {
            showNotification('กรุณากรอกอีเมล / Please enter your email', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            showNotification('กรุณากรอกอีเมลที่ถูกต้อง / Please enter a valid email', 'error');
            return;
        }

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...';
            submitBtn.disabled = true;

            // Use the shared backend
            const response = await fetch(`${window.PUCHOKDII_CONFIG?.API_BASE || ''}/api/auth/send-magic-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    platform: 'puchokdii' // Distinguish from stock alerts
                })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('ส่งลิงก์แล้ว! ตรวจสอบอีเมลของคุณ / Magic link sent! Check your email.', 'success');
                this.closeModal('loginModal');
                document.getElementById('loginForm').reset();
            } else {
                throw new Error(data.message || 'Failed to send magic link');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่ / Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleQuickCheck() {
        const numbers = document.getElementById('checkNumbers').value.trim();
        const submitBtn = document.querySelector('#quickCheckForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const resultDiv = document.getElementById('checkResult');

        if (!numbers || numbers.length !== 6) {
            showNotification('กรุณากรอกหมายเลข 6 หลัก / Please enter 6 digits', 'error');
            return;
        }

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังตรวจสอบ...';
            submitBtn.disabled = true;

            // Simulate lottery check (replace with real API)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const result = this.checkLotteryNumbers(numbers);

            resultDiv.innerHTML = this.formatCheckResult(result);
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Check error:', error);
            showNotification('เกิดข้อผิดพลาดในการตรวจสอบ / Error checking numbers', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    checkLotteryNumbers(numbers) {
        // Mock lottery checking logic
        const mockLatestDraw = {
            firstPrize: '123456',
            secondPrizes: ['789012', '345678', '901234', '567890', '234567'],
            thirdPrizes: ['111111', '222222', '333333', '444444', '555555'],
            twoDigit: '25',
            threeFront: '847',
            threeBack: '156'
        };

        // Check for wins
        if (numbers === mockLatestDraw.firstPrize) {
            return {
                status: 'winner',
                prize: 'รางวัลที่ 1',
                amount: '6,000,000 บาท',
                message: 'ยินดีด้วย! คุณถูกรางวัลที่ 1!'
            };
        }

        if (mockLatestDraw.secondPrizes.includes(numbers)) {
            return {
                status: 'winner',
                prize: 'รางวัลที่ 2',
                amount: '200,000 บาท',
                message: 'ยินดีด้วย! คุณถูกรางวัลที่ 2!'
            };
        }

        if (mockLatestDraw.thirdPrizes.includes(numbers)) {
            return {
                status: 'winner',
                prize: 'รางวัลที่ 3',
                amount: '80,000 บาท',
                message: 'ยินดีด้วย! คุณถูกรางวัลที่ 3!'
            };
        }

        // Check smaller prizes
        const lastTwo = numbers.slice(-2);
        const firstThree = numbers.slice(0, 3);
        const lastThree = numbers.slice(-3);

        if (lastTwo === mockLatestDraw.twoDigit) {
            return {
                status: 'winner',
                prize: 'รางวัลเลขท้าย 2 ตัว',
                amount: '2,000 บาท',
                message: 'ยินดีด้วย! คุณถูกรางวัลเลขท้าย 2 ตัว!'
            };
        }

        if (firstThree === mockLatestDraw.threeFront) {
            return {
                status: 'winner',
                prize: 'รางวัลเลขหน้า 3 ตัว',
                amount: '4,000 บาท',
                message: 'ยินดีด้วย! คุณถูกรางวัลเลขหน้า 3 ตัว!'
            };
        }

        if (lastThree === mockLatestDraw.threeBack) {
            return {
                status: 'winner',
                prize: 'รางวัลเลขท้าย 3 ตัว',
                amount: '4,000 บาท',
                message: 'ยินดีด้วย! คุณถูกรางวัลเลขท้าย 3 ตัว!'
            };
        }

        return {
            status: 'no-win',
            message: 'เสียใจด้วย หมายเลขของคุณไม่ถูกรางวัลในงวดนี้',
            encouragement: 'โชคดีกว่านี้ในงวดหน้า!'
        };
    }

    formatCheckResult(result) {
        if (result.status === 'winner') {
            return `
                <div class="check-result winner">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                    <h3 style="color: var(--crimson); margin-bottom: 1rem;">${result.message}</h3>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--indigo); margin-bottom: 0.5rem;">
                        ${result.prize}
                    </div>
                    <div style="font-size: 1.25rem; color: var(--gold-dark); font-weight: 600;">
                        ${result.amount}
                    </div>
                    <p style="margin-top: 1rem; color: var(--thai-gray);">
                        กรุณานำใบหวยไปขึ้นเงินที่ตัวแทนขายหวย
                    </p>
                </div>
            `;
        } else {
            return `
                <div class="check-result no-win">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🤞</div>
                    <h3 style="color: var(--indigo); margin-bottom: 1rem;">${result.message}</h3>
                    <p style="color: var(--thai-gray); margin-bottom: 1rem;">${result.encouragement}</p>
                    <button class="btn thai-primary" onclick="puchokdii.openModal('checkModal')">
                        <i class="fas fa-dice"></i>
                        ลองสุ่มเลขโชคดี
                    </button>
                </div>
            `;
        }
    }

    async loadLatestDraw() {
        try {
            // Mock loading latest draw results
            // In production, this would call a real API
            this.currentDraw = {
                date: '1 มกราคม 2567',
                firstPrize: '123456',
                secondPrizes: ['789012', '345678', '901234', '567890', '234567'],
                thirdPrizes: ['111111', '222222', '333333', '444444', '555555'],
                twoDigit: '25',
                threeFront: '847',
                threeBack: '156'
            };

            console.log('📊 Latest draw loaded:', this.currentDraw);
        } catch (error) {
            console.error('Error loading latest draw:', error);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus on first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';

            // Reset forms
            const form = modal.querySelector('form');
            if (form) form.reset();

            // Hide results
            const result = modal.querySelector('.check-result');
            if (result) result.style.display = 'none';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

}

// Initialize PuChokDii when DOM is loaded
let puchokdii;

function initPuChokDii() {
    // Initialize translation system for PuChokDii
    if (window.translator && window.PUCHOKDII_TRANSLATIONS) {
        window.translator.init('puchokdii', window.PUCHOKDII_TRANSLATIONS);

        // Create language toggle in navigation
        const languageToggleContainer = document.getElementById('languageToggle');
        if (languageToggleContainer) {
            const currentLang = window.translator.getCurrentLanguage();
            languageToggleContainer.innerHTML = `
                <div class="language-toggle">
                    <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">
                        🇺🇸 EN
                    </button>
                    <button class="lang-btn ${currentLang === 'th' ? 'active' : ''}" data-lang="th">
                        🇹🇭 ไทย
                    </button>
                </div>
            `;

            // Add event listeners for language switching
            languageToggleContainer.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const lang = btn.dataset.lang;
                    window.translator.setLanguage(lang);

                    // Update button states
                    languageToggleContainer.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
    }

    puchokdii = new PuChokDii();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPuChokDii);
} else {
    initPuChokDii();
}

// Export for global access
window.puchokdii = puchokdii;