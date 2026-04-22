const targetDate = new Date("2026-05-27T00:00:00");
const progressStartDate = new Date("2025-08-01T00:00:00");

const startPopup = document.getElementById("startPopup");
const startBtn = document.getElementById("startBtn");
const bgMusic = document.getElementById("bgMusic");

const countdownEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

let countdownInterval = null;
let hasRedirected = false;

/* ===== countdown ===== */
function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

function updateCountdown() {
  const now = new Date();
  const distance = targetDate - now;

  if (distance <= 0) {
    if (countdownEls.days) countdownEls.days.textContent = "000";
    if (countdownEls.hours) countdownEls.hours.textContent = "00";
    if (countdownEls.minutes) countdownEls.minutes.textContent = "00";
    if (countdownEls.seconds) countdownEls.seconds.textContent = "00";

    if (progressFill) progressFill.style.width = "100%";
    if (progressPercent) progressPercent.textContent = "100%";

    if (!hasRedirected) {
      hasRedirected = true;
      setTimeout(() => {
        window.location.href = "../starter/index.html";
      }, 1600);
    }
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  if (countdownEls.days) countdownEls.days.textContent = pad(days, 2);
  if (countdownEls.hours) countdownEls.hours.textContent = pad(hours);
  if (countdownEls.minutes) countdownEls.minutes.textContent = pad(minutes);
  if (countdownEls.seconds) countdownEls.seconds.textContent = pad(seconds);

  const totalDuration = targetDate - progressStartDate;
  const elapsedDuration = now - progressStartDate;

  let progress = (elapsedDuration / totalDuration) * 100;
  progress = Math.max(0, Math.min(progress, 100));

  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
}

function startCountdownLoop() {
  updateCountdown();

  if (!countdownInterval) {
    countdownInterval = setInterval(updateCountdown, 1000);
  }
}

/* ===== popup + music ===== */
async function startExperience() {
  if (bgMusic) {
    try {
      bgMusic.volume = 0;
      await bgMusic.play();

      let volume = 0;
      const fadeAudio = setInterval(() => {
        volume += 0.05;
        if (volume >= 1) {
          volume = 1;
          clearInterval(fadeAudio);
        }
        bgMusic.volume = volume;
      }, 120);
    } catch (error) {
      console.log("Không phát được nhạc:", error);
    }
  }

  if (startPopup) {
    startPopup.style.display = "none";
  }

  startCountdownLoop();
}

if (startBtn) {
  startBtn.addEventListener("click", startExperience);
}

/* ===== particle ===== */
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
  } else {
    console.error("Canvas không tồn tại!");
  }
});

const canvas = document.getElementById("particleCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  if (!canvas) return;

  particles = [];
  const count = Math.max(
    60,
    Math.floor((window.innerWidth * window.innerHeight) / 12000)
  );

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1.5,
      speedY: Math.random() * 1.15 + 0.35,
      speedX: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.2 + 0.12,
    });
  }
}

function drawParticles() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(31, 79, 163, ${p.alpha})`;
    ctx.fill();

    p.y -= p.speedY;
    p.x += p.speedX;

    if (p.y < -20) {
      p.y = canvas.height + 20;
      p.x = Math.random() * canvas.width;
    }

    if (p.x < -20) p.x = canvas.width + 20;
    if (p.x > canvas.width + 20) p.x = -20;
  }

  requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}
