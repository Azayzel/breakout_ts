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