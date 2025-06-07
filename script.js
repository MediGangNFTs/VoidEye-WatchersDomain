const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let eye = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 50,
  pupilSize: 10,
  blinkTimer: 0,
  blinkInterval: 200,
  idleAngle: 0,
};

let orb = {
  x: canvas.width / 2,
  y: canvas.height / 1.5,
  radius: 15,
  isDragging: false,
};

let mouse = { x: orb.x, y: orb.y };

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
  orb.isDragging = true;
});

canvas.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  mouse.x = touch.clientX;
  mouse.y = touch.clientY;
});

canvas.addEventListener("touchend", () => {
  orb.isDragging = false;
});

function drawEye() {
  // Outer eye
  ctx.beginPath();
  ctx.arc(eye.x, eye.y, eye.radius, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(eye.x, eye.y, eye.radius / 2, eye.x, eye.y, eye.radius);
  gradient.addColorStop(0, "#222");
  gradient.addColorStop(1, "#000");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();

  // Glow
  ctx.shadowColor = "red";
  ctx.shadowBlur = 30;

  // Pupil (diamond or blink line)
  ctx.beginPath();
  if (eye.blinkTimer > 0) {
    ctx.moveTo(eye.x - 10, eye.y);
    ctx.lineTo(eye.x + 10, eye.y);
  } else {
    ctx.moveTo(eye.x, eye.y - eye.pupilSize);
    ctx.lineTo(eye.x + eye.pupilSize, eye.y);
    ctx.lineTo(eye.x, eye.y + eye.pupilSize);
    ctx.lineTo(eye.x - eye.pupilSize, eye.y);
    ctx.closePath();
  }
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawOrb() {
  ctx.beginPath();
  ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
  const orbGradient = ctx.createRadialGradient(orb.x, orb.y, 5, orb.x, orb.y, orb.radius);
  orbGradient.addColorStop(0, "white");
  orbGradient.addColorStop(1, "#00f0ff");
  ctx.fillStyle = orbGradient;
  ctx.fill();
  ctx.closePath();
}

function updateEye() {
  let dx = mouse.x - eye.x;
  let dy = mouse.y - eye.y;
  eye.x += dx * 0.02;
  eye.y += dy * 0.02;

  eye.blinkTimer -= 1;
  if (Math.random() < 0.005) eye.blinkTimer = 5;
}

function updateOrb() {
  if (orb.isDragging) {
    orb.x += (mouse.x - orb.x) * 0.3;
    orb.y += (mouse.y - orb.y) * 0.3;
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateEye();
  updateOrb();
  drawEye();
  drawOrb();
  requestAnimationFrame(loop);
}

loop();