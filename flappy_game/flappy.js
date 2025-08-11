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
pipeImg.src = 'pipe.png';

const bgImg = new Image();
bgImg.src = 'background.png';

// Bird (Queenie) properties
const bird = {
    x: 50,
    y: HEIGHT / 2 - 40, // start in middle
    width: 80, // make Queenie big enough
    height: 80,
    gravity: 0.6,
    lift: -10,
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
        this.gap = 140;
        this.x = WIDTH;
        this.width = 60;
        this.speed = 2;
    }

    draw() {
        // Top pipe
        ctx.drawImage(pipeImg, this.x, this.top - pipeImg.height, this.width, pipeImg.height);
        // Bottom pipe
        ctx.drawImage(pipeImg, this.x, this.top + this.gap, this.width, pipeImg.height);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x + this.width < 0;
    }

    hits(bird) {
        if (
            bird.x + bird.width > this.x &&
            bird.x < this.x + this.width &&
            (bird.y < this.top || bird.y + bird.height > this.top + this.gap)
        ) {
            return true;
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

    // Draw background stretched to canvas
    ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

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
