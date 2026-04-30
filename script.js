// ============================================
// 1. CUSTOM CURSOR
// ============================================
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
}
animateOutline();

document.querySelectorAll('a, button, .project-card, input, textarea, .tech-tag, .tl-dot').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ============================================
// 2. DARK MODE TOGGLE
// ============================================
const themeBtn = document.getElementById('theme-toggle');
const icon = themeBtn.querySelector('i');

function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-mode'));
});

setTheme(localStorage.getItem('theme') === 'dark');

// ============================================
// 3. HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ============================================
// 4. HEADER SCROLL EFFECT
// ============================================
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ============================================
// 5. SCROLL PROGRESS BAR
// ============================================
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.getElementById('scroll-bar').style.width = (winScroll / height * 100) + '%';
}, { passive: true });

// ============================================
// 6. ACTIVE NAV LINK
// ============================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            navItems.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ============================================
// 7. TYPING EFFECT
// ============================================
const typingEl = document.getElementById('typing-text');
const words = ['Web Developer', 'IT Enthusiast', 'Data Analyst', 'Network Admin'];
let wIdx = 0, cIdx = 0, deleting = false;

function typeEffect() {
    const word = words[wIdx];
    typingEl.textContent = deleting
        ? word.substring(0, cIdx - 1)
        : word.substring(0, cIdx + 1);

    cIdx = deleting ? cIdx - 1 : cIdx + 1;
    let speed = deleting ? 50 : 120;

    if (!deleting && cIdx === word.length) { deleting = true; speed = 2000; }
    else if (deleting && cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; speed = 400; }

    setTimeout(typeEffect, speed);
}
typeEffect();

// ============================================
// 8. PARTICLE CANVAS
// ============================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const isDark = () => document.body.classList.contains('dark-mode');

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
    };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = isDark() ? '100, 150, 255' : '37, 99, 235';

    particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Connecting lines
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[j].x - p.x;
            const dy = particles[j].y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ============================================
// 9. SCROLL REVEAL + SKILL BARS + COUNTERS
// ============================================
let countersStarted = false;

function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { el.textContent = target; clearInterval(timer); }
            else { el.textContent = Math.floor(current); }
        }, 40);
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');

        // Skill bars
        if (entry.target.classList.contains('about')) {
            setTimeout(() => {
                document.querySelectorAll('.skill-fill').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width') + '%';
                });
            }, 300);
        }

        // Counters (hero)
        if (entry.target.classList.contains('hero')) {
            startCounters();
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-child').forEach(el => revealObserver.observe(el));

// ============================================
// 10. CONTACT FORM SUBMIT (DEMO)
// ============================================
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btnText = submitBtn.querySelector('.btn-text');
        submitBtn.disabled = true;
        btnText.textContent = 'Mengirim...';
        submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

        setTimeout(() => {
            submitBtn.style.display = 'none';
            successMsg.classList.add('show');
            form.reset();

            setTimeout(() => {
                successMsg.classList.remove('show');
                submitBtn.style.display = '';
                submitBtn.disabled = false;
                btnText.textContent = 'Kirim Pesan';
                submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
            }, 4000);
        }, 1500);
    });
}

// ============================================
// 11. BACK TO TOP
// ============================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 12. BLOB PARALLAX (MOUSE)
// ============================================
const blob1 = document.querySelector('.blob-1');
const blob2 = document.querySelector('.blob-2');
const blob3 = document.querySelector('.blob-3');

window.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    blob1.style.transform = `translate(${x}px, ${y}px)`;
    blob2.style.transform = `translate(${-x}px, ${-y}px)`;
    blob3.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
}, { passive: true });