const game = document.getElementById('game-container');
const queenie = document.getElementById('queenie');
let score = 0;
let queenieX = 170;

let keysPressed = {};
let moveSpeed = 4;

let spawnRate = 800;
let spawnIntervalId;

// Track when arrow keys are pressed or released
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    keysPressed[e.key] = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    keysPressed[e.key] = false;
  }
});

// Smooth movement loop
function moveQueenie() {
  if (keysPressed['ArrowLeft'] && queenieX > 0) {
    queenieX -= moveSpeed;
  }
  if (keysPressed['ArrowRight'] && queenieX < 340) {
    queenieX += moveSpeed;
  }

  queenie.style.left = queenieX + 'px';
  requestAnimationFrame(moveQueenie);
}
moveQueenie(); // Start the loop

// Start or restart item spawning
function startSpawningItems() {
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  spawnIntervalId = setInterval(spawnItem, spawnRate);
}

// Spawn falling items
function spawnItem() {
  const item = document.createElement('div');
  item.classList.add('falling-item');

  const isGood = Math.random() < 0.7;
  item.classList.add(isGood ? 'good' : 'bad');
  item.style.backgroundImage = isGood
    ? "url('treat.png')"
    : "url('mud.png')";

  item.style.left = Math.floor(Math.random() * 360) + 'px';
  game.appendChild(item);

  let pos = 0;
  const fallSpeed = 3;
  const fallInterval = setInterval(() => {
    if (pos >= 540) {
      clearInterval(fallInterval);
      item.remove();
    } else {
      pos += fallSpeed;
      item.style.top = pos + 'px';
      checkCollision(item, isGood, fallInterval);
    }
  }, 20);
}

function checkCollision(item, isGood, fallInterval) {
  const itemRect = item.getBoundingClientRect();
  const queenieRect = queenie.getBoundingClientRect();

  if (
    itemRect.bottom >= queenieRect.top &&
    itemRect.left < queenieRect.right &&
    itemRect.right > queenieRect.left
  ) {
    clearInterval(fallInterval);
    item.remove();

    const prevScore = score;
    score = isGood ? score + 1 : Math.max(0, score - 1);
    document.getElementById('score').textContent = score;

    // Every 10 points, increase difficulty
    if (Math.floor(score / 10) > Math.floor(prevScore / 10)) {
      spawnRate = Math.max(150, spawnRate - 100); // Cap at 150ms
      startSpawningItems(); // Restart with new faster rate
    }
  }
}


startSpawningItems(); // Begin the game
