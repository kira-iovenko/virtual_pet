const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startOverlay = document.getElementById('start-overlay');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let frames = 0;
let score = 0;
let gameOver = false;
let gameStarted = false; // NEW: controls initial start

// Load images
const birdImg = new Image();
birdImg.src = 'queenie.png';

const pipeImg = new Image();
pipeImg.src = 'pipe-red.png';

const bgImg = new Image();
bgImg.src = 'background-pink.png';

const baseImg = new Image();
baseImg.src = 'base.png';

let baseX = 0;
const baseSpeed = 2;


function drawBackgroundCover(img, ctx, canvasWidth, canvasHeight) {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function drawBase() {
    const baseHeight = 100;
    ctx.drawImage(baseImg, baseX, HEIGHT - baseHeight, WIDTH, baseHeight);
    ctx.drawImage(baseImg, baseX + WIDTH, HEIGHT - baseHeight, WIDTH, baseHeight);
}

function updateBase() {
    baseX -= baseSpeed;
    if (baseX <= -WIDTH) {
        baseX = 0;
    }
}

const bird = {
    x: 50,
    y: HEIGHT / 2 - 40,
    width: 50,
    height: 50,
    gravity: 0.3,
    lift: -5,
    velocity: 0,
    draw() {
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height >= HEIGHT) {
            this.y = HEIGHT - this.height;
            this.velocity = 0;
            if (!gameOver) {
                deathSound.currentTime = 0; // restart sound
                deathSound.play();
                gameOver = true;
            }
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    }
};

class Pipe {
    constructor() {
        this.top = (Math.random() * HEIGHT) / 3 + 20;
        this.gap = 200;
        this.x = WIDTH;
        this.width = 60;
        this.speed = 2;
        this.scored = false;
    }

    draw() {
        ctx.drawImage(pipeImg, this.x, this.top - pipeImg.height, this.width, pipeImg.height);

        ctx.save();
        ctx.translate(this.x, this.top + this.gap + pipeImg.height);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, 0, 0, this.width, pipeImg.height);
        ctx.restore();
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x + this.width < 0;
    }

    hits(bird) {
        const birdLeft = bird.x;
        const birdRight = bird.x + bird.width;
        const birdTop = bird.y;
        const birdBottom = bird.y + bird.height;

        const pipeLeft = this.x;
        const pipeRight = this.x + this.width;
        const gapTop = this.top;
        const gapBottom = this.top + this.gap;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < gapTop) return true;
            if (birdBottom > gapBottom) return true;
        }
        return false;
    }
}

let pipes = [new Pipe()];

// Load jump sound
const jumpSound = new Audio('https://www.soundjay.com/buttons/sounds/button-6.mp3');
jumpSound.volume = 0.5; // optional: reduce volume

// Load death sound
const deathSound = new Audio('https://www.soundjay.com/buttons/sounds/button-4.mp3');
deathSound.volume = 0.7; // adjust as needed


// Controls
function handleJump() {
    if (!gameStarted) {
        gameStarted = true;
        startOverlay.classList.add("fade-out");
        setTimeout(() => {
            startOverlay.style.display = "none";
        }, 500); // match CSS transition time
        loop();
    }

    if (!gameOver) {
        // Play jump sound
        jumpSound.currentTime = 0; // rewind to start so it plays each time
        jumpSound.play();
        bird.flap();
    } else {
        resetGame();
    }
}


window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp') {
        handleJump();
    }
});

window.addEventListener('mousedown', handleJump);
window.addEventListener('touchstart', handleJump);

function resetGame() {
    bird.y = HEIGHT / 2 - 40;
    bird.velocity = 0;
    pipes = [new Pipe()];
    score = 0;
    frames = 0;
    gameOver = false;
    scoreElement.textContent = `Score: ${score}`;
    loop();
}

// Main game loop
function loop() {
    frames++;

    drawBackgroundCover(bgImg, ctx, WIDTH, HEIGHT);

    if (!gameOver) {
        bird.update();
    }
    bird.draw();

    if (frames % 150 === 0 && !gameOver) {
        pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        if (!gameOver) {
            pipes[i].update();
        }
        pipes[i].draw();

        if (pipes[i].hits(bird)) {
            if (!gameOver) {
                deathSound.currentTime = 0; // restart sound
                deathSound.play();
                gameOver = true;
            }
        }


        if (!pipes[i].scored && pipes[i].x + pipes[i].width < bird.x) {
            score++;
            pipes[i].scored = true;
            scoreElement.textContent = `Score: ${score}`;
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }

    updateBase();
    drawBase();

    if (!gameOver) {
        requestAnimationFrame(loop);
    } else {
        drawGameOverScreen();
    }
}

function drawGameOverScreen() {
    const boxWidth = 320;
    const boxHeight = 120;
    const boxX = WIDTH / 2 - boxWidth / 2;
    const boxY = HEIGHT / 2 - boxHeight / 2;

    const radius = 20;

    ctx.fillStyle = 'rgba(241, 187, 222, 0.85)';
    ctx.strokeStyle = '#d14c8b';
    ctx.lineWidth = 3;

    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, radius);

    ctx.fillStyle = '#d14c8b';
    ctx.font = 'bold 48px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(209, 76, 139, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2 - 10);

    ctx.font = '20px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillText('Press Space or Click to Restart', WIDTH / 2, HEIGHT / 2 + 40);
}

// Initialize score display (but DO NOT start loop yet)
scoreElement.textContent = `Score: ${score}`;
