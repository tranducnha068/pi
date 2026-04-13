const targetDate = new Date('2026-05-30T00:00:00');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');

const countdownEls = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

function updateCountdown() {
  const now = new Date();
  const distance = targetDate - now;

  if (distance <= 0) {
    countdownEls.days.textContent = '00';
    countdownEls.hours.textContent = '00';
    countdownEls.minutes.textContent = '00';
    countdownEls.seconds.textContent = '00';
    progressFill.style.width = '100%';
    progressPercent.textContent = '100%';

    setTimeout(() => {
      window.location.href = '../starter/index.html';
    }, 1800);
    return true;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  countdownEls.days.textContent = pad(days, 2);
  countdownEls.hours.textContent = pad(hours);
  countdownEls.minutes.textContent = pad(minutes);
  countdownEls.seconds.textContent = pad(seconds);

  const manualProgress = 83;
  progressFill.style.width = `${manualProgress}%`;
  progressPercent.textContent = `${manualProgress}%`;
  return false;
}

updateCountdown();
const countdownInterval = setInterval(() => {
  const done = updateCountdown();
  if (done) clearInterval(countdownInterval);
}, 1000);

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 80,
    size: Math.random() * 3 + 1,
    speedY: Math.random() * 1.2 + 0.4,
    speedX: (Math.random() - 0.5) * 0.6,
    alpha: Math.random() * 0.28 + 0.08,
  };
}

function initParticles() {
  particles.length = 0;
  const total = Math.min(90, Math.floor(window.innerWidth / 16));
  for (let i = 0; i < total; i += 1) {
    particles.push(createParticle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.y -= particle.speedY;
    particle.x += particle.speedX;

    if (particle.y < -20) {
      Object.assign(particle, createParticle());
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(31, 95, 191, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});
