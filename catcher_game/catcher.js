const catcherMusic = new Audio('https://www.soundjay.com/free-music/sounds/midnight-ride-01a.mp3');
catcherMusic.loop = true;
catcherMusic.volume = 0.4;

const game = document.getElementById('game-container');
const queenie = document.getElementById('queenie');
const startOverlay = document.getElementById('start-overlay');
const startGameBtn = document.getElementById('startGameBtn');
const livesEl = document.getElementById('lives-container');
const scoreEl = document.getElementById('score');

let score = 0;
let lives = 3;
let queenieX = 170;
let keysPressed = {};
let moveSpeed = 3;
let spawnRate = 800;
let fallSpeed = 4;

let spawnIntervalId;
let difficultyTimer;
let gameActive = false; // <-- New flag to track if game is running

// Track arrow key presses ONLY when game is active
document.addEventListener('keydown', (e) => {
    if (!gameActive) return; 
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keysPressed[e.key] = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (!gameActive) return; 
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keysPressed[e.key] = false;
    }
});

// Smooth movement loop only moves when gameActive is true
function moveQueenie() {
    if (gameActive) {
        if (keysPressed['ArrowLeft'] && queenieX > 0) {
            queenieX -= moveSpeed;
        }
        if (keysPressed['ArrowRight'] && queenieX < 340) {
            queenieX += moveSpeed;
        }
        queenie.style.left = queenieX + 'px';
    }
    requestAnimationFrame(moveQueenie);
}

// Lives display
function updateLivesDisplay() {
    livesEl.textContent = '❤️'.repeat(lives);
}

// Start or restart item spawning
function startSpawningItems() {
    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(spawnItem, spawnRate);
}

// Increase difficulty over time
function startDifficultyIncrease() {
    difficultyTimer = setInterval(() => {
        spawnRate = Math.max(200, spawnRate - 50);
        fallSpeed = Math.min(10, fallSpeed + 0.3);
        startSpawningItems(); // Apply new spawn rate
    }, 7000); // Every 7 seconds
}

// Spawn item
function spawnItem() {
    if (!gameActive) return; // Stop spawning if game inactive
    const item = document.createElement('div');
    item.classList.add('falling-item');

    const isGood = Math.random() < 0.5;
    item.classList.add(isGood ? 'good' : 'bad');
    item.style.backgroundImage = isGood
        ? "url('treat.png')"
        : "url('mud.png')";
    item.style.left = Math.floor(Math.random() * 360) + 'px';
    item.style.top = '0px';
    game.appendChild(item);

    let pos = 0;
    const fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            item.remove();
            return;
        }
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

// Check for collision
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
            lives--;
            updateLivesDisplay();
            if (lives <= 0) {
                endGame();
                return;
            }
        }

        scoreEl.textContent = score;
    }
}

// Game Over
function endGame() {
    gameActive = false;  // <-- Disable player control
    clearInterval(spawnIntervalId);
    clearInterval(difficultyTimer);
    catcherMusic.pause();

    // Remove all falling items
    document.querySelectorAll('.falling-item').forEach(item => item.remove());

    // Show Game Over screen
    document.getElementById('game-over-overlay').style.display = 'flex';
}

// Start button logic
startGameBtn.addEventListener('click', () => {
    startOverlay.style.display = 'none';
    gameActive = true;   // <-- Enable player control
    updateLivesDisplay();
    moveQueenie();
    catcherMusic.play().catch(() => console.log('Autoplay blocked'));
    startSpawningItems();
    startDifficultyIncrease();
});

// Retry button logic
document.getElementById('retryBtn').addEventListener('click', () => {
    // Reset game state
    lives = 3;
    score = 0;
    queenieX = 170;
    keysPressed = {};
    scoreEl.textContent = score;
    spawnRate = 800;
    fallSpeed = 4;
    updateLivesDisplay();

    document.getElementById('game-over-overlay').style.display = 'none';
    queenie.style.left = queenieX + 'px'; // Reset Queenie position

    gameActive = true; // <-- Re-enable player control

    catcherMusic.currentTime = 0;
    catcherMusic.play().catch(() => console.log('Autoplay blocked'));
    startSpawningItems();
    startDifficultyIncrease();
});

// Start the movement loop once so it runs continuously, but movement only happens if gameActive
moveQueenie();