// Breakout
// Get Canvas and Context
var canvas;
var ctx;
// canvas size
var cHeight;
var cWidth;
// Ball Position
var x;
var y;
// Ball Size
var ball = 10;
// Paddle
var pHeight = 10;
var pWidth = 75;
// Starting point of the paddle
var pX;
// Here we're adding or subtracting coordinates 
//  to make is appear the ball is moving.
var dx = 2;
var dy = -2;
// Button controls
var right = false;
var left = false;
// Score & Lives
var score = 0;
var lives = 3;
// Bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
// Our draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ball, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(pX, cHeight - pHeight, pWidth, pHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}
// Collision detection for bricks
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    collided(x, y);
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, cWidth, cHeight);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawExplosion();
    if (x + dx > cWidth - ball || x + dx < ball) {
        dx = -dx;
    }
    if (y + dy < ball) {
        dy = -dy;
    }
    else if (y + dy > cHeight - ball) {
        if (x > pX && x < pX + pWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = cWidth / 2;
                y = cHeight - 30;
                dx = 2;
                dy = -2;
                pX = (cWidth - pWidth) / 2;
            }
        }
    }
    if (right && pX < cWidth - pWidth) {
        pX += 7;
    }
    else if (left && pX > 0) {
        pX -= 7;
    }
    x += dx;
    y += dy;
}
// explosions
// Options
var background = '#333'; // Background color
var particlesPerExplosion = 20;
var particlesMinSpeed = 3;
var particlesMaxSpeed = 6;
var particlesMinSize = 1;
var particlesMaxSize = 3;
var explosions = [];
var fps = 60;
var interval = 1000 / fps;
var now, delta;
var then = Date.now();
// Optimization for mobile devices
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    fps = 29;
}
// Draw explosion(s)
function drawExplosion() {
    if (explosions.length === 0) {
        return;
    }
    for (var i = 0; i < explosions.length; i++) {
        var explosion_1 = explosions[i];
        var particles = explosion_1.particles;
        if (particles.length === 0) {
            explosions.splice(i, 1);
            return;
        }
        var particlesAfterRemoval = particles.slice();
        for (var ii = 0; ii < particles.length; ii++) {
            var particle_1 = particles[ii];
            // Check particle size
            // If 0, remove
            if (particle_1.size <= 0) {
                particlesAfterRemoval.splice(ii, 1);
                continue;
            }
            ctx.beginPath();
            ctx.arc(particle_1.x, particle_1.y, particle_1.size, Math.PI * 2, 0, false);
            ctx.closePath();
            ctx.fillStyle = 'rgb(' + particle_1.r + ',' + particle_1.g + ',' + particle_1.b + ')';
            ctx.fill();
            // Update
            particle_1.x += particle_1.xv;
            particle_1.y += particle_1.yv;
            particle_1.size -= .1;
        }
        explosion_1.particles = particlesAfterRemoval;
    }
}
// Clicked
function collided(x, y) {
    explosions.push(new explosion(x, y));
}
// Explosion
function explosion(x, y) {
    this.particles = [];
    for (var i = 0; i < particlesPerExplosion; i++) {
        this.particles.push(new particle(x, y));
    }
}
// Particle
function particle(x, y) {
    this.x = x;
    this.y = y;
    this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.size = randInt(particlesMinSize, particlesMaxSize, true);
    this.r = randInt(113, 222, true);
    this.g = '00';
    this.b = randInt(105, 255, true);
}
// Returns an random integer, positive or negative
// between the given value
function randInt(min, max, positive) {
    var num;
    if (positive === false) {
        num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    }
    else {
        num = Math.floor(Math.random() * max) + min;
    }
    return num;
}
// Event Handlers
addEventListener("keydown", downHandler, false);
addEventListener("keyup", upHandler, false);
function downHandler(e) {
    switch (e.keyCode) {
        case 39:
            right = true;
            break;
        case 37:
            left = true;
            break;
    }
}
function upHandler(e) {
    switch (e.keyCode) {
        case 39:
            right = false;
            break;
        case 37:
            left = false;
            break;
    }
}
window.onload = function () {
    canvas = document.getElementById('breakout');
    ctx = canvas.getContext("2d");
    cHeight = canvas.height;
    cWidth = canvas.width;
    x = cWidth / 2;
    y = cHeight - 30;
    pX = (cWidth - pWidth) / 2;
    gameLoop();
};
//# sourceMappingURL=breakout.js.map