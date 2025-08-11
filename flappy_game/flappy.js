const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let frames = 0;
let score = 0;
let gameOver = false;

// Load images
const birdImg = new Image();
birdImg.src = 'queenie.png';

const pipeImg = new Image();
pipeImg.src = 'pipe-red.png';

const bgImg = new Image();
bgImg.src = 'background-pink.png';

const baseImg = new Image();
baseImg.src = 'base.png';

// Horizontal position for scrolling base
let baseX = 0;

// Use pipe speed for base scrolling speed to keep synced
const baseSpeed = 2;

// Function to draw background covering entire canvas with cropping but no distortion
function drawBackgroundCover(img, ctx, canvasWidth, canvasHeight) {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        // Canvas wider: scale width to canvas, crop top/bottom
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    } else {
        // Canvas taller: scale height to canvas, crop left/right
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function drawBase() {
    // Draw two base images side by side for seamless scrolling
    const baseHeight = 100; // adjust if your base image height differs
    ctx.drawImage(baseImg, baseX, HEIGHT - baseHeight, WIDTH, baseHeight);
    ctx.drawImage(baseImg, baseX + WIDTH, HEIGHT - baseHeight, WIDTH, baseHeight);
}

function updateBase() {
    baseX -= baseSpeed;
    if (baseX <= -WIDTH) {
        baseX = 0;
    }
}

// Bird (Queenie) properties
const bird = {
    x: 50,
    y: HEIGHT / 2 - 40, // start in middle
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

        // Ground collision
        if (this.y + this.height >= HEIGHT) {
            this.y = HEIGHT - this.height;
            this.velocity = 0;
            gameOver = true;
        }
        // Ceiling collision
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap() {
        this.velocity = this.lift;
    }
};

// Pipe class
class Pipe {
    constructor() {
        this.top = (Math.random() * HEIGHT) / 3 + 20;
        this.gap = 200;
        this.x = WIDTH;
        this.width = 60;
        this.speed = 2;
    }

    draw() {
        // Draw top pipe normally
        ctx.drawImage(pipeImg, this.x, this.top - pipeImg.height, this.width, pipeImg.height);

        // Save context state before flipping
        ctx.save();

        // Move context to bottom pipe position plus its height (because we flip vertically)
        ctx.translate(this.x, this.top + this.gap + pipeImg.height);

        // Flip vertically (scale Y by -1)
        ctx.scale(1, -1);

        // Draw the pipe at (0, 0) in flipped context, with given width and height
        ctx.drawImage(pipeImg, 0, 0, this.width, pipeImg.height);

        // Restore context to original state
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

        // Only check when horizontally inside pipe range
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Hits top pipe if above gap
            if (birdTop < gapTop) {
                return true;
            }
            // Hits bottom pipe if below gap
            if (birdBottom > gapBottom) {
                return true;
            }
        }
        return false;
    }
}

let pipes = [new Pipe()];

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp') {
        if (!gameOver) bird.flap();
        else resetGame();
    }
});

window.addEventListener('mousedown', () => {
    if (!gameOver) bird.flap();
    else resetGame();
});

// Reset game
function resetGame() {
    bird.y = HEIGHT / 2 - 40;
    bird.velocity = 0;
    pipes = [new Pipe()];
    score = 0;
    frames = 0;
    gameOver = false;
    loop();
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.font = '30px Arial';
    ctx.lineWidth = 2;
    ctx.fillText(`Score: ${score}`, 10, 50);
    ctx.strokeText(`Score: ${score}`, 10, 50);
}

// Game loop
function loop() {
    frames++;

    // Draw background with cover scaling
    drawBackgroundCover(bgImg, ctx, WIDTH, HEIGHT);

    // Update & draw bird
    if (!gameOver) {
        bird.update();
    }
    bird.draw();

    // Spawn pipes
    if (frames % 150 === 0 && !gameOver) {
        pipes.push(new Pipe());
    }

    // Update & draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        if (!gameOver) {
            pipes[i].update();
        }
        pipes[i].draw();

        if (pipes[i].hits(bird)) {
            gameOver = true;
        }

        if (!pipes[i].scored && pipes[i].x + pipes[i].width < bird.x) {
            score++;
            pipes[i].scored = true;
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }

    // Update and draw base
    updateBase();
    drawBase();

    drawScore();

    if (!gameOver) {
        requestAnimationFrame(loop);
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', WIDTH / 2 - 130, HEIGHT / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press Space or Click to Restart', WIDTH / 2 - 140, HEIGHT / 2 + 40);
    }
}

// Start game right away for testing
loop();
