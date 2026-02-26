// 1. PRE-LOADER
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const bar = document.querySelector('.loader-bar');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => { loader.classList.add('loader-hidden'); }, 500);
        } else {
            width += 10;
            bar.style.width = width + '%';
        }
    }, 100);
});

// 2. CURSOR TRACKING
const cursor = document.querySelector('.custom-cursor');
const dot = document.querySelector('.cursor-dot');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
});

// 3. CURSOR HOVER EFFECTS
const hoverables = document.querySelectorAll('a, button, .project-card, .price-card, .exp-card');
hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursor.style.background = 'rgba(197, 160, 89, 0.1)';
    });
    item.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'transparent';
    });
});

// 4. PORTFOLIO MAGNET EFFECT
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 20;
        const y = (e.clientY - top - height / 2) / 20;
        card.querySelector('img').style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('img').style.transform = `scale(1) translate(0, 0)`;
    });
});

// 5. SCROLL REVEAL OBSERVER
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.exp-card, .project-card, .team-card, .price-card, .contact-box').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// 6. BACKGROUND PARALLAX
window.addEventListener('scroll', () => {
    const bg = document.querySelector('.master-bg');
    bg.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
});