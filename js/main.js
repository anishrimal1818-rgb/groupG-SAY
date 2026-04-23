/* ===== Advanced JavaScript Functionality ===== */

// Global state management
const AppState = {
    userName: getCookie('userName') || '',
    lastVisit: getCookie('lastVisit') || '',
    preferences: JSON.parse(getCookie('userPreferences') || '{}')
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCookieConsent();
    initMoodCheckin();
    initFAQ();
    initNewsletterForm();
    initScrollToTop();
    initAnimations();
    initPlanSelection();
    initBreathingExercise();
    initTimer();
    initContactForm();
    initReviewForm();
    initSearchFunctionality();
    initFormValidation();
    trackPageView();
    updateLastVisit();
    showWelcomeMessage();
});

// ===== Navigation =====
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Active page highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== Cookie Management =====
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

function initCookieConsent() {
    const consent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    // Use sessionStorage - clears when browser closes
    const choiceMade = sessionStorage.getItem('cookieChoice');
    
    if (consent) {
        if (choiceMade) {
            consent.style.display = 'none';
        } else {
            consent.style.display = 'flex';
        }
    }
    
    acceptBtn?.addEventListener('click', () => {
        sessionStorage.setItem('cookieChoice', 'accepted');
        if (consent) consent.style.display = 'none';
        showToast('Cookies accepted! Thank you.', 'success');
    });
    
    declineBtn?.addEventListener('click', () => {
        sessionStorage.setItem('cookieChoice', 'declined');
        if (consent) consent.style.display = 'none';
        showToast('Cookies declined. Some features may be limited.', 'info');
    });
}

// ===== Mood Check-in =====
function initMoodCheckin() {
    const modal = document.getElementById('moodModal');
    const openBtns = document.querySelectorAll('#openMoodCheckin');
    const closeBtn = document.getElementById('closeMoodModal');
    const moodBtns = document.querySelectorAll('.mood-btn');
    const form = document.getElementById('moodForm');
    
    openBtns.forEach(btn => btn.addEventListener('click', () => modal?.classList.add('active')));
    closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = '', 200);
        });
    });
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const selected = document.querySelector('.mood-btn.selected');
        if (selected) {
            saveMoodEntry(selected.dataset.mood);
            modal.classList.remove('active');
            showToast('Mood saved! Keep tracking your feelings.', 'success');
            document.getElementById('moodFeedback')?.remove();
            displayMoodFeedback(selected.dataset.mood);
        } else {
            showToast('Please select your mood first', 'error');
        }
    });
}

function saveMoodEntry(mood) {
    let entries = JSON.parse(getCookie('moodEntries') || '[]');
    entries.push({ mood, timestamp: new Date().toISOString() });
    if (entries.length > 30) entries = entries.slice(-30);
    setCookie('moodEntries', JSON.stringify(entries), 30);
    updateMoodStats();
}

function displayMoodFeedback(mood) {
    const feedback = {
        great: { icon: '&#128513;', message: 'Wonderful! Keep spreading that positivity!' },
        good: { icon: '&#128522;', message: 'Great to hear! Keep up the good work.' },
        okay: { icon: '&#128528;', message: 'It\'s okay to feel okay. Take care of yourself.' },
        low: { icon: '&#128533;', message: 'We\'re here for you. Consider trying a breathing exercise.' },
        bad: { icon: '&#128543;', message: 'Hang in there. Remember, it\'s okay to ask for help.' }
    };
    
    const fb = feedback[mood] || feedback.okay;
    const div = document.createElement('div');
    div.id = 'moodFeedback';
    div.className = 'alert alert-success text-center mt-3';
    div.innerHTML = `<span style="font-size:2rem">${fb.icon}</span><br><strong>${fb.message}</strong>`;
    document.querySelector('#moodModal .modal-content')?.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}

function updateMoodStats() {
    const stats = document.getElementById('moodStats');
    if (!stats) return;
    
    const entries = JSON.parse(getCookie('moodEntries') || '[]');
    const moodCounts = { great: 0, good: 0, okay: 0, low: 0, bad: 0 };
    entries.forEach(e => moodCounts[e.mood]++);
    
    const total = entries.length || 1;
    let avgMood = 'okay';
    const moodValues = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
    const avg = entries.reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / total;
    if (avg >= 4.5) avgMood = 'great';
    else if (avg >= 3.5) avgMood = 'good';
    else if (avg >= 2.5) avgMood = 'okay';
    else if (avg >= 1.5) avgMood = 'low';
    else avgMood = 'bad';
    
    stats.innerHTML = `
        <div class="d-flex justify-content-around">
            <div class="text-center"><strong>${entries.length}</strong><br><small>Entries</small></div>
            <div class="text-center"><strong>${avgMood.charAt(0).toUpperCase() + avgMood.slice(1)}</strong><br><small>Avg Mood</small></div>
        </div>
    `;
}

// ===== FAQ Accordion =====
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

// ===== Newsletter Form =====
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value;
        if (validateEmail(email)) {
            setCookie('newsletterEmail', email, 365);
            setCookie('newsletterDate', new Date().toISOString(), 365);
            form.reset();
            showToast('Welcome to our wellness community!', 'success');
            updateNewsletterCount();
        } else {
            showToast('Please enter a valid email', 'error');
        }
    });
}

function updateNewsletterCount() {
    const count = parseInt(getCookie('newsletterCount') || '0') + 1;
    setCookie('newsletterCount', count.toString(), 365);
}

// ===== Scroll to Top =====
function initScrollToTop() {
    const btn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => btn?.classList.toggle('show', window.scrollY > 500));
    btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== Animations =====
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .feature-item, .testimonial-card, .review-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== Plan Selection =====
function initPlanSelection() {
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            setCookie('selectedPlan', plan, 30);
            setCookie('planSelectedAt', new Date().toISOString(), 30);
            showToast(`You've selected the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`, 'success');
            
            // Simulate loading
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = 'Selected ✓';
                btn.classList.remove('btn-primary', 'btn-secondary');
                btn.classList.add('btn-success');
                btn.disabled = false;
            }, 1500);
        });
    });
}

// ===== Breathing Exercise =====
function initBreathingExercise() {
    const circle = document.querySelector('.breathing-circle');
    if (!circle) return;
    
    const phases = [
        { text: 'Breathe In...', duration: 4000 },
        { text: 'Hold...', duration: 7000 },
        { text: 'Breathe Out...', duration: 8000 }
    ];
    
    let currentPhase = 0;
    const text = circle.querySelector('.breathing-text');
    
    function runPhase() {
        const phase = phases[currentPhase];
        text.textContent = phase.text;
        circle.style.animationDuration = `${phase.duration / 1000}s`;
        
        // Pulse animation
        circle.style.transform = 'scale(1.2)';
        setTimeout(() => circle.style.transform = 'scale(0.8)', phase.duration / 2);
        
        currentPhase = (currentPhase + 1) % phases.length;
        setTimeout(runPhase, phase.duration);
    }
    
    // Start button functionality
    const startBtn = document.getElementById('startBreathing');
    startBtn?.addEventListener('click', () => {
        startBtn.style.display = 'none';
        runPhase();
        showToast('Follow the circle with your breath', 'info');
    });
    
    // Auto-start after delay
    setTimeout(() => {
        const autoStart = document.getElementById('autoStartBreathing');
        if (autoStart) runPhase();
    }, 3000);
}

// ===== Timer =====
function initTimer() {
    const timer = document.getElementById('resetTimer');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimerBtn');
    
    if (!timer) return;
    
    let seconds = 300;
    let interval;
    let isRunning = false;
    
    function updateDisplay() {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            interval = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                    seconds = 300;
                    showToast('Timer complete! Take a break.', 'success');
                    // Play notification sound simulation
                    timer.style.background = 'var(--success)';
                    setTimeout(() => timer.style.background = '', 1000);
                }
                updateDisplay();
            }, 1000);
        }
    }
    
    function pauseTimer() {
        isRunning = false;
        clearInterval(interval);
    }
    
    function resetTimer() {
        pauseTimer();
        seconds = 300;
        updateDisplay();
    }
    
    startBtn?.addEventListener('click', startTimer);
    pauseBtn?.addEventListener('click', pauseTimer);
    resetBtn?.addEventListener('click', resetTimer);
}

// ===== Contact Form Validation =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fields = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (isValid) {
            // Collect form data
            const formData = {
                name: form.querySelector('#name')?.value,
                email: form.querySelector('#email')?.value,
                subject: form.querySelector('#subject')?.value,
                message: form.querySelector('#message')?.value,
                timestamp: new Date().toISOString()
            };
            
            // Save to cookie (simulating backend)
            const submissions = JSON.parse(getCookie('contactSubmissions') || '[]');
            submissions.push(formData);
            if (submissions.length > 10) submissions.shift();
            setCookie('contactSubmissions', JSON.stringify(submissions), 30);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = '<svg class="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Sent!';
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-success');
                showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
                
                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.classList.remove('btn-success');
                    submitBtn.classList.add('btn-primary');
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        }
    });
}

// ===== Review Form =====
function initReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    
    // Star rating
    const stars = document.querySelectorAll('.star-rating svg');
    let selectedRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStars(stars, selectedRating);
            document.getElementById('ratingValue').textContent = selectedRating;
        });
        
        star.addEventListener('mouseenter', () => highlightStars(stars, index + 1));
        star.addEventListener('mouseleave', () => updateStars(stars, selectedRating));
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = form.querySelector('#reviewName')?.value;
        const title = form.querySelector('#reviewTitle')?.value;
        const text = form.querySelector('#reviewText')?.value;
        
        if (!name || !title || !text || selectedRating === 0) {
            showToast('Please fill all fields and select a rating', 'error');
            return;
        }
        
        const review = {
            name,
            title,
            text,
            rating: selectedRating,
            date: new Date().toISOString(),
            helpful: 0
        };
        
        // Save review
        const reviews = JSON.parse(getCookie('userReviews') || '[]');
        reviews.unshift(review);
        setCookie('userReviews', JSON.stringify(reviews), 365);
        
        // Reset form
        form.reset();
        selectedRating = 0;
        updateStars(stars, 0);
        
        showToast('Thank you for your review!', 'success');
        
        // Reload reviews display
        displayReviews();
    });
}

function updateStars(stars, rating) {
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        star.style.color = index < rating ? 'var(--warning)' : '#ddd';
        star.style.fill = index < rating ? 'var(--warning)' : '#ddd';
    });
}

function displayReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    
    const reviews = JSON.parse(getCookie('userReviews') || '[]');
    const template = document.getElementById('reviewTemplate');
    
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="review-author-img">${review.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h5 class="mb-0">${review.name}</h5>
                        <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
                    </div>
                </div>
                <div class="star-rating">
                    ${[1,2,3,4,5].map(i => `<svg viewBox="0 0 24 24" class="${i <= review.rating ? 'active' : ''}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('')}
                </div>
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-text">${review.text}</p>
            <div class="review-helpful">
                <small class="text-muted">${review.helpful || 0} people found this helpful</small>
            </div>
        </div>
    `).join('');
}

// ===== Search Functionality =====
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.card, .tool-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
        
        // Show no results message
        const visibleCards = document.querySelectorAll('.card:not([style*="display: none"]), .tool-card:not([style*="display: none"])');
        const noResults = document.getElementById('noResults');
        
        if (noResults) {
            noResults.style.display = visibleCards.length === 0 ? 'block' : 'none';
        }
    });
}

// ===== Form Validation Helper =====
function initFormValidation() {
    // Add validation to all forms
    document.querySelectorAll('form').forEach(form => {
        form.setAttribute('novalidate', '');
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMsg = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'This field is required';
    }
    
    // Email validation
    if (isValid && field.type === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (isValid && field.type === 'tel' && value && !validatePhone(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid phone number';
    }
    
    // Min length check
    if (isValid && field.dataset.minLength && value.length < parseInt(field.dataset.minLength)) {
        isValid = false;
        errorMsg = `Minimum ${field.dataset.minLength} characters required`;
    }
    
    if (!isValid) {
        showFieldError(field, errorMsg);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    let errorEl = field.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('invalid-feedback')) {
        errorEl = document.createElement('div');
        errorEl.className = 'invalid-feedback';
        field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
    const errorEl = field.nextElementSibling;
    if (errorEl?.classList.contains('invalid-feedback')) {
        errorEl.remove();
    }
}

function clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    const errorEl = field.nextElementSibling;
    if (errorEl?.classList.contains('invalid-feedback')) {
        errorEl.remove();
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;margin-left:1rem;">&times;</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// ===== Tracking & Analytics =====
function trackPageView() {
    let views = parseInt(getCookie('pageViews') || '0');
    views++;
    setCookie('pageViews', views.toString(), 365);
    setCookie('lastPage', window.location.pathname, 1);
}

function updateLastVisit() {
    const now = new Date().toISOString();
    setCookie('lastVisit', now, 365);
}

// ===== Welcome Message =====
function showWelcomeMessage() {
    const lastVisit = getCookie('lastVisit');
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const now = new Date();
        const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 0 && getCookie('userName')) {
            setTimeout(() => {
                showToast(`Welcome back! It's been ${daysDiff} day(s) since your last visit.`, 'info');
            }, 2000);
        }
    }
}

// ===== Print Functionality =====
window.printPage = function() {
    window.print();
};

// ===== Export Data =====
window.exportUserData = function() {
    const data = {
        moodEntries: JSON.parse(getCookie('moodEntries') || '[]'),
        newsletterEmail: getCookie('newsletterEmail'),
        selectedPlan: getCookie('selectedPlan'),
        pageViews: getCookie('pageViews'),
        userReviews: JSON.parse(getCookie('userReviews') || '[]'),
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindfulpath-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Your data has been exported!', 'success');
};

// ===== Dark Mode Toggle =====
window.toggleDarkMode = function() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    setCookie('darkMode', isDark ? 'true' : 'false', 365);
    
    if (isDark) {
        document.documentElement.style.setProperty('--light-green', '#1a3a2a');
        document.documentElement.style.setProperty('--white', '#1a1a1a');
        document.documentElement.style.setProperty('--text-dark', '#ffffff');
    } else {
        document.documentElement.style.setProperty('--light-green', '#E8F5F0');
        document.documentElement.style.setProperty('--white', '#FFFFFF');
        document.documentElement.style.setProperty('--text-dark', '#2C3E50');
    }
};

// ===== Gender-Specific Content =====
// Tips database for different gender content
const tipsDatabase = {
    'stress-man': {
        title: 'Quick Stress Relief',
        content: '<h4>5-Second Reset</h4><ol><li>Close your eyes</li><li>Take a deep breath</li><li>Exhale slowly</li><li>Repeat 3 times</li></ol><p>This activates your parasympathetic nervous system.</p>'
    },
    'fitness-man': {
        title: 'Quick Workout',
        content: '<h4>10-Min Morning Routine</h4><ol><li>10 jumping jacks</li><li>10 push-ups</li><li>10 squats</li><li>Repeat 3 times</li></ol><p>End with 1 minute of stretching.</p>'
    },
    'sleep-man': {
        title: 'Sleep Hygiene',
        content: '<h4>Evening Checklist</h4><ol><li>Dim lights 1 hour before bed</li><li>No caffeine after 2pm</li><li>Avoid heavy meals</li><li>Set room temperature to 65-68°F</li><li>Use relaxation techniques</li></ol>'
    },
    'selfcare-women': {
        title: 'Self-Care Starter Kit',
        content: '<h4>Daily Rituals</h4><ol><li>Morning: 5 min skincare, set intentions</li><li>Midday: 10 min break, breathe</li><li>Evening: 30 min wind-down routine</li><li>Before bed: gratitude journaling</li></ol>'
    },
    'stress-women': {
        title: 'Instant Calm',
        content: '<h4>4-7-8 Breathing</h4><ol><li>Inhale through nose for 4 seconds</li><li>Hold for 7 seconds</li><li>Exhale through mouth for 8 seconds</li><li>Repeat 4 times</li></ol><p>Use whenever you feel overwhelmed.</p>'
    },
    'journal-women': {
        title: 'Journaling Starter',
        content: '<h4>Today\'s Prompts</h4><ol><li>How am I feeling right now?</li><li>What do I need most today?</li><li>Who made me smile recently?</li><li>What would bring me joy tomorrow?</li></ol><p>Write without editing for 10 minutes.</p>'
    }
};

// Gender content switcher
function switchGender(gender) {
    // Update button states
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === gender);
        if (btn.dataset.gender === gender) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        }
    });
    
    // Save preference
    setCookie('preferredGender', gender, 365);
    
    // Toggle content visibility
    document.getElementById('menContent').style.display = gender === 'men' ? 'block' : 'none';
    document.getElementById('womenContent').style.display = gender === 'women' ? 'block' : 'none';
    
    // Animate content change
    const content = document.getElementById(gender === 'men' ? 'menContent' : 'womenContent');
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        content.style.transition = 'all 0.4s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 50);
    
    showToast(`Showing ${gender === 'men' ? 'men' : 'women'}'s wellness content`, 'info');
}

// Show tip modal
function showTip(tipId) {
    const tip = tipsDatabase[tipId];
    if (tip) {
        document.getElementById('tipModalTitle').textContent = tip.title;
        document.getElementById('tipModalBody').innerHTML = tip.content;
        const modal = new bootstrap.Modal(document.getElementById('tipModal'));
        modal.show();
        
        // Track tip views
        let tipsViewed = JSON.parse(getCookie('tipsViewed') || '[]');
        tipsViewed.push({ id: tipId, timestamp: new Date().toISOString() });
        setCookie('tipsViewed', JSON.stringify(tipsViewed), 30);
    }
}

// Initialize gender preference from cookie
function initGenderPreference() {
    const preferred = getCookie('preferredGender');
    if (preferred) {
        switchGender(preferred);
    }
    
    // Add click handlers for gender buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', () => switchGender(btn.dataset.gender));
    });
}

// ===== Initialize Reviews Display =====
document.addEventListener('DOMContentLoaded', function() {
    displayReviews();
    initGenderPreference();
    initHomeGenderSelector();
    initQuoteRotator();
    initSupportFormValidation();
});

// ===== Support Form Validation =====
function initSupportFormValidation() {
    const form = document.getElementById('supportForm');
    if (!form) return;
    
    const nameInput = document.getElementById('supportName');
    const emailInput = document.getElementById('supportEmail');
    const phoneInput = document.getElementById('supportPhone');
    const subjectSelect = document.getElementById('supportSubject');
    const messageInput = document.getElementById('supportMessage');
    const consentCheckbox = document.getElementById('consentCheck');
    const messageCounter = document.getElementById('messageCounter');
    
    // Real-time validation on blur
    [nameInput, emailInput, phoneInput, subjectSelect, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', () => validateSupportField(input));
            input.addEventListener('input', () => clearSupportFieldError(input));
        }
    });
    
    // Message character counter
    if (messageInput && messageCounter) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            messageCounter.textContent = `${count}/10 minimum characters`;
            messageCounter.style.color = count >= 10 ? 'var(--success)' : 'var(--text-light)';
        });
    }
    
    // Consent checkbox validation
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', () => {
            if (consentCheckbox.checked) {
                consentCheckbox.classList.remove('is-invalid');
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        if (!validateSupportField(nameInput)) isValid = false;
        if (!validateSupportField(emailInput)) isValid = false;
        if (phoneInput && phoneInput.value && !validateSupportField(phoneInput)) isValid = false;
        if (!validateSupportField(subjectSelect)) isValid = false;
        if (!validateSupportField(messageInput)) isValid = false;
        
        // Validate consent checkbox
        if (consentCheckbox && !consentCheckbox.checked) {
            consentCheckbox.classList.add('is-invalid');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Save to cookie (simulating backend)
                const formData = {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput ? phoneInput.value : '',
                    subject: subjectSelect.value,
                    message: messageInput.value,
                    timestamp: new Date().toISOString()
                };
                
                const submissions = JSON.parse(getCookie('supportSubmissions') || '[]');
                submissions.push(formData);
                setCookie('supportSubmissions', JSON.stringify(submissions), 30);
                
                // Show success message
                form.style.display = 'none';
                document.getElementById('formSuccess').style.display = 'block';
                
                showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            }, 1500);
        } else {
            showToast('Please fill in all required fields correctly.', 'error');
        }
    });
}

function validateSupportField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    let isValid = true;
    let errorMsg = '';
    
    // Clear previous error
    clearSupportFieldError(field);
    
    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'This field is required';
    }
    
    // Min length check
    if (isValid && field.dataset.minLength && value.length < parseInt(field.dataset.minLength)) {
        isValid = false;
        errorMsg = `Minimum ${field.dataset.minLength} characters required`;
    }
    
    // Email validation
    if (isValid && field.type === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (isValid && field.type === 'tel' && value && !validatePhone(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid phone number';
    }
    
    // Select validation
    if (isValid && field.tagName === 'SELECT' && field.hasAttribute('required') && (!value || value === '')) {
        isValid = false;
        errorMsg = 'Please select an option';
    }
    
    if (!isValid) {
        showSupportFieldError(field, errorMsg);
    } else {
        showSupportFieldSuccess(field);
    }
    
    return isValid;
}

function showSupportFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    let errorEl = field.nextElementSibling;
    while (errorEl && !errorEl.classList.contains('invalid-feedback')) {
        errorEl = errorEl.nextElementSibling;
    }
    
    if (errorEl && errorEl.classList.contains('invalid-feedback')) {
        errorEl.textContent = message;
    }
}

function showSupportFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}

function clearSupportFieldError(field) {
    if (field) {
        field.classList.remove('is-invalid', 'is-valid');
    }
}

function resetSupportForm() {
    const form = document.getElementById('supportForm');
    const successDiv = document.getElementById('formSuccess');
    
    if (form) {
        form.reset();
        form.style.display = 'block';
        form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });
    }
    
    if (successDiv) {
        successDiv.style.display = 'none';
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
    }
    
    const messageCounter = document.getElementById('messageCounter');
    if (messageCounter) {
        messageCounter.textContent = '0/10 minimum characters';
        messageCounter.style.color = 'var(--text-light)';
    }
}

// ===== Home Page Gender Selector =====
function initHomeGenderSelector() {
    const preferred = getCookie('preferredGender');
    if (preferred) {
        switchGenderHome(preferred);
    }
    
    document.querySelectorAll('.gender-btn-home').forEach(btn => {
        btn.addEventListener('click', () => switchGenderHome(btn.dataset.gender));
    });
}

function switchGenderHome(gender, navigateToServices = false) {
    document.querySelectorAll('.gender-btn-home').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === gender);
        if (btn.dataset.gender === gender) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        }
    });
    
    setCookie('preferredGender', gender, 365);
    
    const welcomeBox = document.getElementById('genderWelcome');
    const messages = {
        men: {
            title: 'Welcome to Your Wellness Space',
            content: 'Access stress management tips, fitness routines, and sleep optimization designed for men.'
        },
        women: {
            title: 'Welcome to Your Wellness Space',
            content: 'Explore self-care routines, stress relief techniques, and journaling prompts designed for women.'
        }
    };
    
    const msg = messages[gender];
    welcomeBox.innerHTML = `
        <h5 class="mb-2">${msg.title}</h5>
        <p class="mb-0 text-muted">${msg.content}</p>
        <a href="services.html?gender=${gender}" class="btn btn-sm btn-primary mt-2">View ${gender === 'men' ? "Men's" : "Women's"} Plans</a>
    `;
    welcomeBox.style.display = 'block';
    welcomeBox.style.animation = 'fadeInUp 0.5s ease';
    
    // Navigate to services page with gender parameter if requested
    if (navigateToServices) {
        setTimeout(() => {
            window.location.href = `services.html?gender=${gender}`;
        }, 500);
    } else {
        showToast(`Experience customized for ${gender}`, 'success');
    }
}

// ===== Wellbeing Quotes Database =====
const quotes = [
    { text: "Your mental health is a priority. Your feelings are valid. Your journey is unique.", author: "MindfulPath" },
    { text: "You don't have to be positive all the time. It's okay to feel everything at once.", author: "Unknown" },
    { text: "Self-care is not selfish. You cannot pour from an empty cup.", author: "Eleanor Brown" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
    { text: "You are not your thoughts. You are the observer of your thoughts.", author: "Eckhart Tolle" },
    { text: "Recovery is not one and done. It is a lifelong journey.", author: "Unknown" },
    { text: "Be patient with yourself. Self-growth is tender; it's holy ground.", author: "Stephen Covey" },
    { text: "It's okay to not be okay as long as you don't give up.", author: "Unknown" },
    { text: "The only way out is through. You can do this.", author: "MindfulPath" },
    { text: "Every day may not be good, but there is good in every day.", author: "Alice Morse Earle" },
    { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
    { text: "You are enough just as you are. Each emotion you feel, everything in your life, everything you do or don't do... it's all okay.", author: "Unknown" },
    { text: "Progress, not perfection. Every step forward counts.", author: "MindfulPath" },
    { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Unknown" }
];

function initQuoteRotator() {
    // Show random quote on load
    const savedQuote = getCookie('dailyQuote');
    const lastShown = getCookie('lastQuoteDate');
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
        showRandomQuote();
        setCookie('lastQuoteDate', today, 1);
    } else if (savedQuote) {
        try {
            const quote = JSON.parse(savedQuote);
            document.getElementById('quoteText').textContent = `"${quote.text}"`;
            document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
        } catch(e) {
            showRandomQuote();
        }
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    document.getElementById('quoteText').style.opacity = '0';
    document.getElementById('quoteAuthor').style.opacity = '0';

    setTimeout(() => {
        document.getElementById('quoteText').textContent = `"${quote.text}"`;
        document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
        document.getElementById('quoteText').style.opacity = '1';
        document.getElementById('quoteAuthor').style.opacity = '1';
    }, 300);

    setCookie('dailyQuote', JSON.stringify(quote), 1);
}

// ===== Stress Quiz System =====
const quizQuestions = [
    {
        question: "How often do you feel overwhelmed by your responsibilities?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How well do you sleep at night?",
        options: ["Very well - I sleep through", "Pretty well", "I have some trouble", "I often can't sleep", "I rarely sleep well"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How often do you experience physical symptoms like headaches or muscle tension?",
        options: ["Never", "Rarely", "A few times a week", "Almost every day", "Every day"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How often do you feel anxious or worried without knowing why?",
        options: ["Never", "Rarely", "Sometimes", "Often", "All the time"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How would you rate your ability to relax?",
        options: ["Excellent - I can relax easily", "Good", "Moderate", "Poor", "I can't remember the last time I relaxed"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How often do you find yourself eating more or less than usual?",
        options: ["Never changes", "Rarely", "Sometimes", "Often", "It's always affected by stress"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How would you describe your mood most days?",
        options: ["Happy and content", "Mostly positive", "Neutral", "Often down", "Overwhelmed or hopeless"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How well can you concentrate on tasks?",
        options: ["Very well", "Pretty well", "I get distracted sometimes", "I struggle to focus", "I can't concentrate at all"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How often do you engage in activities you enjoy?",
        options: ["Every day", "A few times a week", "Once a week", "Rarely", "I can't remember"],
        scores: [0, 1, 2, 3, 4]
    },
    {
        question: "How supported do you feel by friends and family?",
        options: ["Very supported", "Mostly supported", "Somewhat supported", "Not very supported", "Completely alone"],
        scores: [0, 1, 2, 3, 4]
    }
];

let currentQuestion = 0;
let userAnswers = [];

function startQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizQuestions').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    
    document.getElementById('totalQ').textContent = quizQuestions.length;
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('currentQ').textContent = currentQuestion + 1;
    
    const progress = ((currentQuestion) / quizQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const isSelected = userAnswers[currentQuestion] === index;
        const btn = document.createElement('button');
        btn.className = `quiz-option ${isSelected ? 'selected' : ''}`;
        btn.innerHTML = `
            <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="quiz-option-text">${option}</span>
        `;
        btn.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(btn);
    });
    
    // Update navigation buttons
    document.getElementById('prevBtn').style.display = currentQuestion > 0 ? 'block' : 'none';
    
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestion === quizQuestions.length - 1) {
        nextBtn.textContent = 'See Results';
    } else {
        nextBtn.textContent = 'Next';
    }
}

function selectAnswer(index) {
    userAnswers[currentQuestion] = index;
    
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });
}

function nextQuestion() {
    if (userAnswers[currentQuestion] === undefined) {
        showToast('Please select an answer to continue', 'error');
        return;
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showResults() {
    // Calculate total score
    let totalScore = 0;
    userAnswers.forEach((answer, index) => {
        totalScore += quizQuestions[index].scores[answer];
    });
    
    const maxScore = quizQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    // Determine stress level
    let level, icon, recommendations;
    
    if (percentage <= 25) {
        level = { name: 'Low Stress', color: '#28a745', desc: 'Great job managing stress!' };
        icon = '&#127775;';
        recommendations = {
            title: 'Maintaining Wellness',
            content: `
                <p>You're doing excellent work managing your stress levels. Keep up the great habits!</p>
                <h5>Recommendations:</h5>
                <ul>
                    <li>Continue your current wellness practices</li>
                    <li>Share your stress-management techniques with others</li>
                    <li>Stay mindful of any changes in your stress levels</li>
                </ul>
            `
        };
    } else if (percentage <= 50) {
        level = { name: 'Moderate Stress', color: '#ffc107', desc: 'Some areas to work on' };
        icon = '&#128578;';
        recommendations = {
            title: 'Managing Daily Stress',
            content: `
                <p>You have a healthy baseline, but there's room for improvement. Consider these steps:</p>
                <h5>Recommendations:</h5>
                <ul>
                    <li>Practice the 4-7-8 breathing technique daily</li>
                    <li>Schedule regular breaks during work</li>
                    <li>Ensure you're getting 7-9 hours of sleep</li>
                    <li>Try the 5-minute mindfulness exercises</li>
                </ul>
            `
        };
    } else if (percentage <= 75) {
        level = { name: 'High Stress', color: '#fd7e14', desc: 'Time to take action' };
        icon = '&#128543;';
        recommendations = {
            title: 'Reducing Stress Levels',
            content: `
                <p>Your stress levels are elevated and may be affecting your wellbeing. Consider:</p>
                <h5>Recommendations:</h5>
                <ul>
                    <li>Try the grounding exercise (5-4-3-2-1) when feeling overwhelmed</li>
                    <li>Set boundaries with work and personal commitments</li>
                    <li>Consider speaking with a therapist or counselor</li>
                    <li>Use our breathing exercises daily</li>
                    <li>Reach out to your support network</li>
                </ul>
            `
        };
    } else {
        level = { name: 'Very High Stress', color: '#dc3545', desc: 'Please seek support' };
        icon = '&#128546;';
        recommendations = {
            title: 'Getting Support',
            content: `
                <p>Your stress levels are quite high. It's important to seek support.</p>
                <h5>Immediate Steps:</h5>
                <ul>
                    <li>Talk to a healthcare professional</li>
                    <li>Contact our support team at 1-800-MINDHELP</li>
                    <li>Reach out to trusted friends or family</li>
                    <li>Practice deep breathing exercises throughout the day</li>
                    <li>Remember: seeking help is a sign of strength</li>
                </ul>
            `
        };
    }
    
    // Display results
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizQuestions').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    
    document.getElementById('quizProgress').style.width = '100%';
    document.getElementById('stressLevelIcon').innerHTML = icon;
    document.getElementById('stressLevelTitle').textContent = level.name;
    document.getElementById('stressLevelTitle').style.color = level.color;
    document.getElementById('stressLevelScore').textContent = `Score: ${totalScore}/${maxScore} (${Math.round(percentage)}%) - ${level.desc}`;
    
    document.getElementById('stressMeterFill').style.width = percentage + '%';
    document.getElementById('stressMeterFill').style.backgroundColor = level.color;
    
    document.getElementById('resultsContent').innerHTML = `
        <h4 class="text-center mb-3">${recommendations.title}</h4>
        ${recommendations.content}
    `;
    
    // Save quiz results
    setCookie('lastQuizScore', totalScore.toString(), 30);
    setCookie('lastQuizDate', new Date().toISOString(), 30);
    setCookie('lastQuizLevel', level.name, 30);
    
    showToast(`Your stress level: ${level.name}`, 'info');
}

function retakeQuiz() {
    document.getElementById('quizResults').style.display = 'none';
    startQuiz();
}

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', function() {
    displayReviews();
    initGenderPreference();
    initHomeGenderSelector();
    initQuoteRotator();
    
    // Auto-start quiz intro display
    if (document.getElementById('quizContainer')) {
        document.getElementById('totalQ').textContent = quizQuestions.length;
    }
    
    // Handle gender parameter from URL on services page
    handleServicesGenderParam();
});

// ===== Services Page Gender Handling =====
function handleServicesGenderParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const gender = urlParams.get('gender');
    
    if (gender && (gender === 'men' || gender === 'women')) {
        // Show the gender banner
        showGenderBanner(gender);
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            switchPlanGender(gender);
            // Scroll to personal lessons section (first thing shown)
            const lessonsSection = document.getElementById('personalLessons');
            if (lessonsSection) {
                lessonsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 200);
    }
}

function showGenderBanner(gender) {
    const banner = document.getElementById('genderBanner');
    if (!banner) return;
    
    const content = {
        men: {
            icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>',
            title: "Men's Mental Health Resources",
            subtitle: "Personalized lessons and plans designed for your wellbeing"
        },
        women: {
            icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M12 11v10"/></svg>',
            title: "Women's Mental Health Resources",
            subtitle: "Personalized lessons and plans designed for your wellbeing"
        }
    };
    
    const c = content[gender];
    document.getElementById('bannerIcon').innerHTML = c.icon;
    document.getElementById('bannerTitle').textContent = c.title;
    document.getElementById('bannerSubtitle').textContent = c.subtitle;
    
    banner.style.display = 'block';
    banner.style.animation = 'slideDown 0.5s ease';
}

function switchPlanGender(gender) {
    // Update ALL gender selector buttons on the page
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gender === gender);
        if (btn.dataset.gender === gender) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        }
    });
    
    // Toggle lessons visibility
    const menLessons = document.getElementById('menLessons');
    const womenLessons = document.getElementById('womenLessons');
    
    if (menLessons && womenLessons) {
        menLessons.style.display = gender === 'men' ? 'block' : 'none';
        womenLessons.style.display = gender === 'women' ? 'block' : 'none';
        
        // Animate the transition
        const targetLessons = gender === 'men' ? menLessons : womenLessons;
        targetLessons.style.opacity = '0';
        targetLessons.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetLessons.style.transition = 'all 0.4s ease';
            targetLessons.style.opacity = '1';
            targetLessons.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Toggle plans visibility
    const menPlans = document.getElementById('menPlans');
    const womenPlans = document.getElementById('womenPlans');
    
    if (menPlans && womenPlans) {
        menPlans.style.display = gender === 'men' ? 'block' : 'none';
        womenPlans.style.display = gender === 'women' ? 'block' : 'none';
        
        // Animate the transition
        const targetPlans = gender === 'men' ? menPlans : womenPlans;
        targetPlans.style.opacity = '0';
        targetPlans.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetPlans.style.transition = 'all 0.4s ease';
            targetPlans.style.opacity = '1';
            targetPlans.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Save preference
    setCookie('preferredGender', gender, 365);
    
    showToast(`Showing ${gender === 'men' ? "men's" : "women's"} wellness content`, 'success');
}

function selectPlan(planId) {
    setCookie('selectedPlan', planId, 30);
    showToast(`You've selected the ${planId.replace('-', ' ')} plan!`, 'success');
    
    // Show confirmation modal or redirect
    setTimeout(() => {
        window.location.href = 'support.html';
    }, 1000);
}