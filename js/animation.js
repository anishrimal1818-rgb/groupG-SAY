/* ===== Animation JavaScript for MindfulPath ===== */

// ===== Typing Effect Animation =====
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    
    const phrases = [
        "Discover your path to inner peace and mental clarity.",
        "Simple tools and daily habits for lasting wellbeing.",
        "Your feelings are valid. Your journey is unique.",
        "Take the first step toward a healthier mind today.",
        "Expert guidance for stress, anxiety, and self-care."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 50;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 30;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 50;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingDelay = 500;
        }
        
        setTimeout(typeEffect, typingDelay);
    }
    
    setTimeout(typeEffect, 1000);
}

// ===== Floating Leaves Animation =====
function initFloatingLeaves() {
    const leavesContainer = document.getElementById('floatingLeaves');
    if (!leavesContainer) return;
    
    const leafSVGs = [
        // Leaf SVG 1
        `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5C12 8 8 15 8 22C8 30 13 35 20 38C27 35 32 30 32 22C32 15 28 8 20 5Z" fill="#2D8B6F" opacity="0.6"/>
            <path d="M20 10V35" stroke="#1E5F4C" stroke-width="1.5"/>
            <path d="M20 15L14 20M20 20L26 25M20 25L15 28" stroke="#1E5F4C" stroke-width="1"/>
        </svg>`,
        // Leaf SVG 2
        `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3C10 8 5 18 5 25C5 35 12 38 20 38C28 38 35 35 35 25C35 18 30 8 20 3Z" fill="#4ECDC4" opacity="0.5"/>
            <path d="M20 8V36" stroke="#2D8B6F" stroke-width="1.5"/>
            <path d="M20 14L13 22M20 22L27 28M20 28L14 33" stroke="#2D8B6F" stroke-width="1"/>
        </svg>`,
        // Leaf SVG 3
        `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C8 10 4 22 4 28C4 36 11 40 20 40C29 40 36 36 36 28C36 22 32 10 20 2Z" fill="#2D8B6F" opacity="0.4"/>
            <path d="M20 6V38" stroke="#1E5F4C" stroke-width="1.5"/>
            <path d="M20 12L11 22M20 22L29 30M20 30L12 36" stroke="#1E5F4C" stroke-width="1"/>
        </svg>`,
        // Leaf SVG 4
        `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20" cy="20" rx="14" ry="18" fill="#4ECDC4" opacity="0.35" transform="rotate(-15 20 20)"/>
            <path d="M20 5V38" stroke="#2D8B6F" stroke-width="1.5"/>
            <path d="M20 12L12 20M20 20L28 26M20 26L13 32" stroke="#2D8B6F" stroke-width="1"/>
        </svg>`
    ];
    
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'floating-leaf';
        leaf.innerHTML = leafSVGs[Math.floor(Math.random() * leafSVGs.length)];
        
        // Random starting position
        const startX = Math.random() * 100;
        const size = 30 + Math.random() * 40; // 30-70px
        const duration = 15 + Math.random() * 20; // 15-35 seconds
        const delay = Math.random() * 5;
        const swayAmount = 50 + Math.random() * 100; // 50-150px sway
        
        leaf.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            top: -${size}px;
            animation: floatDown ${duration}s linear ${delay}s infinite;
            --sway-amount: ${swayAmount}px;
            pointer-events: none;
            z-index: 1;
        `;
        
        leavesContainer.appendChild(leaf);
    }
    
    // Create initial leaves
    for (let i = 0; i < 8; i++) {
        createLeaf();
    }
    
    // Continuously add new leaves
    setInterval(() => {
        if (leavesContainer.children.length < 12) {
            createLeaf();
        }
    }, 3000);
}

// ===== Smooth Scroll Animation =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.card, .feature-item, .testimonial-card, .lesson-card, .plan-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// ===== Parallax Effect =====
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .parallax-bg');
        
        parallaxElements.forEach(el => {
            const speed = 0.3;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== Button Ripple Effect =====
function initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                left: ${x - 50}px;
                top: ${y - 50}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== Number Counter Animation =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-item h3, .quiz-score');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/[\d,]+/);
    
    if (!match) return;
    
    const target = parseInt(match[0].replace(/,/g, ''));
    const prefix = text.substring(0, text.indexOf(match[0]));
    const suffix = text.substring(text.indexOf(match[0]) + match[0].length);
    
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = prefix + target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        }
    }, stepTime);
}

// ===== Pulse Animation on Hover =====
function initPulseOnHover() {
    document.querySelectorAll('.feature-icon, .card-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('pulse-once');
            setTimeout(() => this.classList.remove('pulse-once'), 600);
        });
    });
}

// ===== Initialize All Animations =====
document.addEventListener('DOMContentLoaded', function() {
    initTypingEffect();
    initFloatingLeaves();
    initSmoothScroll();
    initScrollReveal();
    initButtonRipple();
    initCounterAnimation();
    initPulseOnHover();
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('animations-loaded');
});
