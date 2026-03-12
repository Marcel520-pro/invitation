/* ---- Cursor ---- */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = (mx - 9) + 'px';
    cursor.style.top = (my - 9) + 'px';
});
function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = (tx - 20) + 'px';
    trail.style.top = (ty - 20) + 'px';
    requestAnimationFrame(animateTrail);
}
animateTrail();

/* ---- Particles ---- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#ff6eb4', '#d896ff', '#ffb3c6', '#ff3d8b', '#ffd700'];
function mkPt() {
    return {
        x: Math.random() * W,
        y: Math.random() * H + H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: Math.random()
    };
}
for (let i = 0; i < 80; i++) {
    const p = mkPt();
    p.y = Math.random() * H;
    pts.push(p);
}
function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a * 0.7;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.c;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) pts[i] = mkPt();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---- Parallax ---- */
const p1 = document.getElementById('parallax1');
const p2 = document.getElementById('parallax2');
window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (p1) p1.style.transform = `translateY(${sy * 0.3}px)`;
    if (p2) p2.style.transform = `translateY(${sy * 0.15}px)`;
});

/* ---- Countdown ---- */
const eventDate = new Date("April 17, 2026 00:00:00").getTime();
function updateCountdown() {
    const distance = eventDate - Date.now();
    if (distance < 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => document.getElementById(id).textContent = '0');
        return;
    }
    document.getElementById('days').textContent = Math.floor(distance / 86400000);
    document.getElementById('hours').textContent = Math.floor((distance % 86400000) / 3600000);
    document.getElementById('minutes').textContent = Math.floor((distance % 3600000) / 60000);
    document.getElementById('seconds').textContent = Math.floor((distance % 60000) / 1000);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---- Music ---- */
window.toggleMusic = function () {
    const m = document.getElementById('music');
    if (m.paused) m.play(); else m.pause();
};

/* ---- Download ---- */
window.downloadInvitation = function () {
    const a = document.createElement('a');
    a.href = 'Invitation.pdf';
    a.download = 'Invitation_Irene_Avril2026.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/* ---- Gallery parallax on mouse ---- */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', e => {
        const rect = item.getBoundingClientRect();
        const rx = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const ry = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        item.style.transform = `perspective(800px) rotateY(${rx}deg) rotateX(${-ry}deg) translateY(-8px) scale(1.01)`;
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

/* ---- Scroll-reveal (simple IntersectionObserver) ---- */
const reveals = document.querySelectorAll('.gallery-item, .section-header');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = e.target.classList.contains('gallery-item')
                ? 'translateY(0)'
                : '';
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
reveals.forEach(el => {
    if (el.classList.contains('gallery-item')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.7s cubic-bezier(.22,1,.36,1)';
    }
    observer.observe(el);
});