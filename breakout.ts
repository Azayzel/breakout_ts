// Breakout

// Get Canvas and Context
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

// canvas size
var cHeight: number;
var cWidth: number;

// Ball Position
var x: number;
var y: number;

// Ball Size
var ball: number = 10;

// Paddle
var pHeight: number = 10;
var pWidth: number = 75;

// Starting point of the paddle
var pX: number;

// Here we're adding or subtracting coordinates 
//  to make is appear the ball is moving.
var dx: number = 2;
var dy: number = -2;

// Button controls
var right: Boolean = false;
var left: Boolean = false;

// Score & Lives
var score: number = 0;
var lives: number = 3;

// Bricks
var brickRowCount: number = 3;
var brickColumnCount: number = 5;
var brickWidth: number = 75;
var brickHeight: number = 20;
var brickPadding: number = 10;
var brickOffsetTop: number = 30;
var brickOffsetLeft: number = 30;
var bricks: Array<any> = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


// Our draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ball, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(pX, cHeight-pHeight, pWidth, pHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
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
    ctx.fillText("Score: "+score, 8, 20);
}

// Collision detection for bricks
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    collided(x,y)
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
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
    if(x + dx > cWidth-ball || x + dx < ball) {
        dx = -dx;
    }
    if(y + dy < ball) {
        dy = -dy;
    }
    else if(y + dy > cHeight-ball) {
        if(x > pX && x < pX + pWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = cWidth/2;
                y = cHeight-30;
                dx = 2;
                dy = -2;
                pX = (cWidth-pWidth)/2;
            }
        }
    }
    
    if(right && pX < cWidth-pWidth) {
        pX += 7;
    }
    else if(left && pX > 0) {
        pX -= 7;
    }
    
    x += dx;
    y += dy;
}

// explosions

// Options
const background            = '#333';                    // Background color
const particlesPerExplosion = 20;
const particlesMinSpeed     = 3;
const particlesMaxSpeed     = 6;
const particlesMinSize      = 1;
const particlesMaxSize      = 3;
const explosions            = [];

let fps        = 60;
const interval = 1000 / fps;

let now, delta;
let then = Date.now();

// Optimization for mobile devices
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  fps = 29;
}


// Draw explosion(s)
function drawExplosion() {

  if (explosions.length === 0) {
    return;
  }

  for (let i = 0; i < explosions.length; i++) {

    const explosion = explosions[i];
    const particles = explosion.particles;

    if (particles.length === 0) {
      explosions.splice(i, 1);
      return;
    }

    const particlesAfterRemoval = particles.slice();
    for (let ii = 0; ii < particles.length; ii++) {

      const particle = particles[ii];

      // Check particle size
      // If 0, remove
      if (particle.size <= 0) {
        particlesAfterRemoval.splice(ii, 1);
        continue;
      }

        // make particles squares
      ctx.beginPath();
      ctx.rect(particle.x, particle.y, 6, 6)
        // below if for circle particle
      //ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
      //ctx.closePath();
      ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();

      // Update
      particle.x += particle.xv;
      particle.y += particle.yv;
      particle.size -= .1;
    }

    explosion.particles = particlesAfterRemoval;

  }

}

// Clicked
function collided(x, y) {
  explosions.push(
    new explosion(x, y)
  );

}

// Explosion
function explosion(x, y) {

  this.particles = [];

  for (let i = 0; i < particlesPerExplosion; i++) {
    this.particles.push(
      new particle(x, y)
    );
  }

}

// Particles
function particle(x, y) {
  this.x    = x;
  this.y    = y;
  this.xv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.yv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.size = randInt(particlesMinSize, particlesMaxSize, true);
  this.r    = randInt(113, 222, true);
  this.g    = '00';
  this.b    = randInt(105, 255, true);
}

// Returns random integer
function randInt(min, max, positive) {

  let num;
  if (positive === false) {
    num = Math.floor(Math.random() * max) - min;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  } else {
    num = Math.floor(Math.random() * max) + min;
  }

  return num;

}



// Event Handlers
addEventListener("keydown", downHandler, false);
addEventListener("keyup", upHandler, false);

function downHandler(e: KeyboardEvent){
    switch(e.keyCode)
    {
        case 39:
            right = true;
            break;
        case 37:
            left = true;
            break;
    }
}

function upHandler(e: KeyboardEvent){
    switch(e.keyCode)
    {
        case 39:
            right = false;
            break;
        case 37:
            left = false;
            break;
    }
}



window.onload = () => { 
    canvas = <HTMLCanvasElement>document.getElementById('breakout');
    ctx = canvas.getContext("2d");
    cHeight = canvas.height;
    cWidth = canvas.width;
    x =  cWidth/2;
    y = cHeight-30;
    pX=  (cWidth-pWidth)/2;
    gameLoop();
 }