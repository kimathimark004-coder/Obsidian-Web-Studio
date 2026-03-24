/**
 * OBSIDIAN WEB STUDIO - PREMIUM INTERACTIONS
 * Enhanced with GSAP animations and modern JS features
 * 
 * Dependencies (loaded in HTML):
 *   - gsap.min.js (core)
 *   - ScrollTrigger.min.js
 *   - ScrollToPlugin.min.js
 */

// ===== GLOBAL VARIABLES =====
let isLoaded = false;
let scrollDirection = 'up';
let lastScrollY = 0;
let currentSection = '';

// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger);

// Register ScrollToPlugin if available (loaded via CDN)
if (typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
}

// Set GSAP defaults
gsap.defaults({
    duration: 0.8,
    ease: "power2.out"
});

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== PRELOADER =====
class Preloader {
    constructor() {
        this.loader = $('#loader-wrapper');
        this.bar = $('.loader-bar');
        this.init();
    }

    init() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 300);
            }
            if (this.bar) this.bar.style.width = `${progress}%`;
        }, 150);
    }

    hide() {
        if (!this.loader) return;
        gsap.to(this.loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                this.loader.style.display = 'none';
                this.onLoadComplete();
            }
        });
    }

    onLoadComplete() {
        isLoaded = true;
        document.body.classList.add('loaded');
        this.initPageAnimations();
    }

    initPageAnimations() {
        // Navbar slide down
        gsap.from('.navbar', {
            y: -100,
            duration: 1,
            ease: "power3.out",
            delay: 0.2
        });

        // Hero text reveals
        this.initHeroAnimations();

        // Initialize scroll-triggered animations
        this.initScrollAnimations();
    }

    initHeroAnimations() {
        const titleLines = $$('.title-line');

        titleLines.forEach((line, index) => {
            const text = line.textContent.trim();
            const hasGoldGradient = line.classList.contains('gold-gradient');

            // Clear the line content
            line.innerHTML = '';

            // If this line has the gold-gradient class, we need to handle it
            // differently. Remove gradient from parent, apply to each char span.
            if (hasGoldGradient) {
                line.classList.remove('gold-gradient');
            }

            text.split('').forEach((char) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.transform = 'translateY(100%)';
                span.style.opacity = '0';

                // Apply gold gradient to each character span if parent had it
                if (hasGoldGradient) {
                    span.classList.add('gold-gradient');
                }

                line.appendChild(span);
            });

            // Animate characters in
            gsap.to(line.children, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "back.out(1.7)",
                delay: 0.8 + (index * 0.3)
            });
        });

        // Hero subtitle
        gsap.from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1.6
        });

        // Hero buttons
        gsap.from('.hero-actions', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 1.8
        });
    }

    initScrollAnimations() {
        // Fade up animations for section headers only
        // (cards are handled by grid stagger below — no double-animation)
        $$('.section-header').forEach((el) => {
            gsap.from(el, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Stagger animations for grids (handles all cards)
        ['.expertise-grid', '.portfolio-grid', '.team-grid', '.pricing-grid'].forEach(gridSelector => {
            const grid = $(gridSelector);
            if (grid) {
                const cards = grid.children;
                gsap.from(cards, {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // Contact section
        const contactSection = $('.contact-content');
        if (contactSection) {
            gsap.from('.contact-left', {
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: contactSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
            gsap.from('.contact-right', {
                x: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: contactSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // Counter animations
        this.initCounterAnimations();
    }

    initCounterAnimations() {
        $$('[data-target]').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            let hasAnimated = false;

            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                onEnter: () => {
                    if (hasAnimated) return;
                    hasAnimated = true;
                    
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            counter.textContent = Math.floor(obj.val);
                        }
                    });
                }
            });
        });
    }
}

// ===== CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.cursor = $('.custom-cursor');
        this.dot = $('.cursor-dot');
        this.isVisible = false;

        if ('ontouchstart' in window || !this.cursor || !this.dot) return;

        this.init();
    }

    init() {
        this.bindEvents();
        this.bindHoverEffects();
    }

    bindEvents() {
        document.addEventListener('mousemove', this.updatePosition.bind(this));
        document.addEventListener('mouseenter', this.showCursor.bind(this));
        document.addEventListener('mouseleave', this.hideCursor.bind(this));
    }

    updatePosition(e) {
        if (!this.isVisible) return;

        requestAnimationFrame(() => {
            this.cursor.style.left = `${e.clientX}px`;
            this.cursor.style.top = `${e.clientY}px`;
            this.dot.style.left = `${e.clientX}px`;
            this.dot.style.top = `${e.clientY}px`;
        });
    }

    showCursor() {
        this.isVisible = true;
        gsap.to([this.cursor, this.dot], { opacity: 1, duration: 0.3 });
    }

    hideCursor() {
        this.isVisible = false;
        gsap.to([this.cursor, this.dot], { opacity: 0, duration: 0.3 });
    }

    bindHoverEffects() {
        const hoverables = 'a, button, .project-card, .exp-card, .team-card, .price-card, [tabindex]';

        $$(hoverables).forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(this.cursor, {
                    scale: 1.6,
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderColor: 'rgba(212, 175, 55, 0.6)',
                    duration: 0.3
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(this.cursor, {
                    scale: 1,
                    backgroundColor: 'transparent',
                    borderColor: 'var(--gold)',
                    duration: 0.3
                });
            });
        });
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = $('.navbar');
        this.mobileToggle = $('.mobile-menu-toggle');
        this.mobileOverlay = $('.mobile-menu-overlay');
        this.navItems = $$('.nav-item, .mobile-nav-item');
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.initScrollBehavior();
        this.initActiveSection();
    }

    bindEvents() {
        // Mobile menu toggle
        this.mobileToggle?.addEventListener('click', this.toggleMobileMenu.bind(this));

        // Close menu on link click
        $$('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(() => this.closeMobileMenu(), 300);
            });
        });

        // Close menu on overlay click
        this.mobileOverlay?.addEventListener('click', (e) => {
            if (e.target === this.mobileOverlay) {
                this.closeMobileMenu();
            }
        });

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.mobileToggle.classList.add('active');
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileToggle.classList.remove('active');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    initScrollBehavior() {
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.pageYOffset;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                if (scrollDirection !== 'down') {
                    scrollDirection = 'down';
                    if (!this.isMenuOpen) {
                        gsap.to(this.navbar, { y: -100, duration: 0.3 });
                    }
                }
            } else {
                if (scrollDirection !== 'up') {
                    scrollDirection = 'up';
                    gsap.to(this.navbar, { y: 0, duration: 0.3 });
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    initActiveSection() {
        const sections = $$('section[id]');

        const updateActiveSection = () => {
            let current = '';

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    current = section.id;
                }
            });

            if (current !== currentSection) {
                currentSection = current;

                this.navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}` ||
                        item.dataset.section === current) {
                        item.classList.add('active');
                    }
                });
            }
        };

        window.addEventListener('scroll', throttle(updateActiveSection, 100));
        // Run once on load
        updateActiveSection();
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = $(targetId);
                if (!target) return;

                e.preventDefault();

                // Use ScrollToPlugin if available, otherwise fallback
                if (typeof ScrollToPlugin !== 'undefined') {
                    gsap.to(window, {
                        scrollTo: {
                            y: target,
                            offsetY: 80,
                            autoKill: false
                        },
                        duration: 1.2,
                        ease: "power2.inOut"
                    });
                } else {
                    // Fallback: native smooth scroll
                    const targetRect = target.getBoundingClientRect();
                    const targetY = window.pageYOffset + targetRect.top - 80;
                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== MAGNETIC BUTTONS =====
class MagneticButtons {
    constructor() {
        this.buttons = $$('[data-magnetic]');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMouseMove(e, btn));
            btn.addEventListener('mouseleave', () => this.handleMouseLeave(btn));
        });
    }

    handleMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    handleMouseLeave(btn) {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    }
}

// ===== PORTFOLIO INTERACTIONS =====
class PortfolioEffects {
    constructor() {
        this.projectCards = $$('.project-card');
        this.init();
    }

    init() {
        this.projectCards.forEach(card => {
            this.bindCardEffects(card);
        });
    }

    bindCardEffects(card) {
        const image = card.querySelector('.project-image img');
        if (!image) return;

        // Magnetic image movement
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 20;
            const y = (e.clientY - rect.top - rect.height / 2) / 20;

            gsap.to(image, {
                x: x,
                y: y,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
}

// ===== TEAM CARD 3D EFFECTS =====
class TeamCardEffects {
    constructor() {
        this.teamCards = $$('.team-card');
        this.init();
    }

    init() {
        this.teamCards.forEach(card => {
            this.bindCardEffects(card);
        });
    }

    bindCardEffects(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);

            gsap.to(card, {
                rotationY: deltaX * 10,
                rotationX: -deltaY * 10,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
}

// ===== FORM ENHANCEMENTS =====
class FormEnhancements {
    constructor() {
        this.form = $('#contactForm');
        this.submitBtn = $('#submitBtn');
        this.inputs = $$('#contactForm .form-group input, #contactForm .form-group textarea, #contactForm .form-group select');
        this.successMsg = $('#formSuccess');
        this.errorMsg = $('#formError');

        this.init();
    }

    init() {
        if (!this.form) return;
        this.bindFormEvents();
        this.enhanceInputs();
    }

    bindFormEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    hideFeedback() {
        if (this.successMsg) this.successMsg.classList.remove('show');
        if (this.errorMsg) this.errorMsg.classList.remove('show');
    }

    validateForm() {
        let isValid = true;
        const name = this.form.querySelector('#contact-name');
        const email = this.form.querySelector('#contact-email');
        const service = this.form.querySelector('#contact-service');
        const message = this.form.querySelector('#contact-message');

        // Clear previous error styles
        [name, email, service, message].forEach(field => {
            if (field) field.style.borderColor = '';
        });

        // Name validation
        if (!name.value.trim() || name.value.trim().length < 2) {
            name.style.borderColor = '#ef4444';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            email.style.borderColor = '#ef4444';
            isValid = false;
        }

        // Service validation
        if (!service.value) {
            service.style.borderColor = '#ef4444';
            isValid = false;
        }

        // Message validation
        if (!message.value.trim() || message.value.trim().length < 10) {
            message.style.borderColor = '#ef4444';
            isValid = false;
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.hideFeedback();

        // Client-side validation
        if (!this.validateForm()) {
            if (this.errorMsg) {
                this.errorMsg.querySelector('span').textContent = 'Please fill in all fields correctly.';
                this.errorMsg.classList.add('show');
            }
            return;
        }

        // Reset error message text
        if (this.errorMsg) {
            this.errorMsg.querySelector('span').textContent = 'Something went wrong. Please try again or contact us directly.';
        }

        // Add loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;

        const formData = new FormData(this.form);

        try {
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;

            if (response.ok) {
                // Show success feedback
                if (this.successMsg) this.successMsg.classList.add('show');

                gsap.to(this.submitBtn, {
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    duration: 0.3,
                    onComplete: () => {
                        const btnText = this.submitBtn.querySelector('.btn-text');
                        if (btnText) btnText.textContent = 'Sent Successfully!';
                        setTimeout(() => {
                            gsap.to(this.submitBtn, {
                                backgroundColor: '#D4AF37',
                                color: '#0A0A0A',
                                duration: 0.3
                            });
                            if (btnText) btnText.textContent = 'Start Your Project';
                        }, 3000);
                    }
                });

                // Reset form and labels
                this.form.reset();
                this.updateLabels();

                // Clear any error border colors
                this.inputs.forEach(input => { input.style.borderColor = ''; });

                // Auto-hide success after 6s
                setTimeout(() => this.hideFeedback(), 6000);
            } else {
                throw new Error('Server returned ' + response.status);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;

            if (this.errorMsg) this.errorMsg.classList.add('show');

            // Auto-hide error after 6s
            setTimeout(() => this.hideFeedback(), 6000);
        }
    }

    enhanceInputs() {
        this.inputs.forEach(input => {
            input.addEventListener('input', () => {
                // Clear error border on input
                input.style.borderColor = '';
                this.updateLabels();
            });
            input.addEventListener('blur', this.updateLabels.bind(this));
            input.addEventListener('focus', this.updateLabels.bind(this));
        });
    }

    updateLabels() {
        this.inputs.forEach(input => {
            const label = input.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (input.value.trim() !== '' || input === document.activeElement) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            }
        });
    }
}

// ===== SCROLL PROGRESS =====
class ScrollProgress {
    constructor() {
        this.progressBar = $('.scroll-progress');
        this.init();
    }

    init() {
        if (!this.progressBar) return;
        window.addEventListener('scroll', throttle(this.updateProgress.bind(this), 16));
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
    constructor() {
        this.button = $('.back-to-top');
        this.init();
    }

    init() {
        if (!this.button) return;
        this.button.addEventListener('click', this.scrollToTop.bind(this));
        window.addEventListener('scroll', throttle(this.toggleVisibility.bind(this), 100));
    }

    scrollToTop() {
        if (typeof ScrollToPlugin !== 'undefined') {
            gsap.to(window, {
                scrollTo: { y: 0, autoKill: false },
                duration: 1.2,
                ease: "power2.inOut"
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    toggleVisibility() {
        const shouldShow = window.pageYOffset > 300;

        if (shouldShow && !this.button.classList.contains('visible')) {
            this.button.classList.add('visible');
            gsap.from(this.button, {
                scale: 0,
                rotation: -180,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        } else if (!shouldShow && this.button.classList.contains('visible')) {
            gsap.to(this.button, {
                scale: 0,
                rotation: 180,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    this.button.classList.remove('visible');
                    gsap.set(this.button, { scale: 1, rotation: 0 });
                }
            });
        }
    }
}

// ===== PARALLAX EFFECTS =====
class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        // Floating orbs parallax
        $$('.orb').forEach((orb, index) => {
            gsap.to(orb, {
                y: -100,
                rotation: 360,
                duration: 20 + index * 5,
                repeat: -1,
                ease: "none"
            });
        });

        // Background grid parallax
        const heroGrid = $('.hero-bg-grid');
        if (heroGrid) {
            ScrollTrigger.create({
                trigger: '.hero',
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    gsap.to(heroGrid, {
                        y: progress * 100,
                        opacity: 1 - progress * 0.5,
                        duration: 0.3,
                        overwrite: true
                    });
                }
            });
        }
    }
}

// ===== INTERSECTION OBSERVER ENHANCEMENTS =====
class IntersectionEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.createRevealObserver();
        this.createScaleObserver();
    }

    createRevealObserver() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    const children = entry.target.children;
                    if (children.length > 1) {
                        gsap.from(children, {
                            y: 30,
                            opacity: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            ease: "power2.out"
                        });
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $$('.stats-grid, .trusted-logos').forEach(el => {
            revealObserver.observe(el);
        });
    }

    createScaleObserver() {
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    });
                }
            });
        }, {
            threshold: 0.3
        });

        $$('.recommended-badge').forEach(el => {
            scaleObserver.observe(el);
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizations {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeAnimations();
        this.lazyLoadImages();
    }

    optimizeAnimations() {
        const animatedElements = $$('.exp-card, .project-card, .team-card, .price-card, .magnetic-btn');

        animatedElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.willChange = 'transform';
            });
            el.addEventListener('mouseleave', () => {
                el.style.willChange = 'auto';
            });
        });
    }

    lazyLoadImages() {
        const images = $$('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading — already set in HTML
            return;
        }

        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        $$('.exp-card, .project-card, .team-card, .price-card').forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Find the primary link inside the card and click it
                    const link = card.querySelector('a');
                    if (link) {
                        link.click();
                    }
                }
            });
        });
    }

    setupFocusManagement() {
        const focusableElements = $$('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');

        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                if (el.getAttribute('data-magnetic')) {
                    gsap.to(el, {
                        scale: 1.02,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
            el.addEventListener('blur', () => {
                if (el.getAttribute('data-magnetic')) {
                    gsap.to(el, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            // Kill all scroll-triggered animations
            ScrollTrigger.getAll().forEach(st => st.kill());
            // Disable GSAP transitions
            gsap.globalTimeline.clear();
            document.documentElement.style.setProperty('--transition-base', 'none');
            document.documentElement.style.setProperty('--transition-slow', 'none');
            // Make sure all content is visible
            $$('.title-line span, .reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                el.style.transform = 'none';
                el.style.opacity = '1';
            });
        }
    }
}

// ===== FORCE-HIDE LOADER (failsafe) =====
function forceHideLoader() {
    const loader = document.getElementById('loader-wrapper');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
        document.body.classList.add('loaded');
    }
}

// Absolute failsafe — if nothing else works, hide loader after 5s
setTimeout(forceHideLoader, 5000);

// Also hide on window load (all assets done)
window.addEventListener('load', () => {
    setTimeout(forceHideLoader, 2000);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        const preloader = new Preloader();
    } catch (err) {
        console.error('Preloader error:', err);
        forceHideLoader();
    }

    // Initialize everything else after a tick to ensure DOM is stable
    setTimeout(() => {
        const components = [
            ['CustomCursor', CustomCursor],
            ['Navigation', Navigation],
            ['SmoothScrolling', SmoothScrolling],
            ['MagneticButtons', MagneticButtons],
            ['PortfolioEffects', PortfolioEffects],
            ['TeamCardEffects', TeamCardEffects],
            ['FormEnhancements', FormEnhancements],
            ['ScrollProgress', ScrollProgress],
            ['BackToTop', BackToTop],
            ['ParallaxEffects', ParallaxEffects],
            ['IntersectionEnhancements', IntersectionEnhancements],
            ['PerformanceOptimizations', PerformanceOptimizations],
            ['AccessibilityEnhancements', AccessibilityEnhancements],
        ];

        components.forEach(([name, Component]) => {
            try {
                new Component();
            } catch (err) {
                console.error(`${name} init error:`, err);
            }
        });

        console.log('🚀 Obsidian Web Studio - All systems initialized');
    }, 100);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 250));

// Set initial viewport height
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
