const game = document.getElementById('game-container');
const queenie = document.getElementById('queenie');
let score = 0;
let queenieX = 170;

// Move Queenie with arrow keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && queenieX > 0) {
    queenieX -= 20;
  } else if (e.key === 'ArrowRight' && queenieX < 340) {
    queenieX += 20;
  }
  queenie.style.left = queenieX + 'px';
});

// Spawn falling items
function spawnItem() {
  const item = document.createElement('div');
  item.classList.add('falling-item');

  // Randomly choose good or bad
  const isGood = Math.random() < 0.7;
  item.classList.add(isGood ? 'good' : 'bad');
  item.style.backgroundImage = isGood
  ? "url('../images/need-bath.png')"
  : "url('../images/need-food.png')";


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
    if (isGood) {
      score++;
    } else {
      score = Math.max(0, score - 1);
    }
    document.getElementById('score').textContent = score;
  }
}

// Game loop
setInterval(spawnItem, 1000);
