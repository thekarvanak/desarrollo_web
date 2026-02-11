var c = document.getElementById("myArkanoid");
var ctx = c.getContext("2d");

var radius = 10;
var puntoX = c.width / 2;
var puntoY = c.height - 10;

var dx  = 2;
var dy = -2;

var paddlex = c.width / 2;
var paddley = c.height - 10;
var paddlew = 60;
var paddleh = 12;

var rightMove = false;
var leftMove = false;

var brickRows = 3;
var brickCOlumns = 5;

var brickWidth = 60;
var brickHeight = 20;

var brickPadding = 12;
var brickOfSetTop = 30;
var brickOfSetLeft = 100;

var bricks = [];

function initBricks() {
    bricks = [];
    for(let i = 0; i < brickCOlumns; i++) {
        bricks[i] = [];
        for(let j = 0; j < brickRows; j++) {
            bricks[i][j] = {x:0, y:0, drawBrick:true}
        }
    }
}

initBricks();

var score = 0;
var lives = 5;

document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function KeyDownHandler(e) {
    if(e.keyCode == 37) {
        leftMove = true;
    } else {
        if(e.keyCode == 39) {
            rightMove = true;
        }
    }
}

function KeyUpHandler(e) {
    if(e.keyCode == 37) {
        leftMove = false;
    } else {
        if(e.keyCode == 39) {
            rightMove = false;
        }
    }
}

function mouseMoveHandler(e) {
    var mouseRelativeX = e.clientX - c.offsetLeft;
    if(mouseRelativeX > 0 && mouseRelativeX < c.width) {
        paddlex = mouseRelativeX - paddlew / 2;
    }
}

console.log("mi variable puntoX es : " + puntoX);
console.log("mi variable puntoY es : " + puntoY);
console.log("mi variable radius es : " + radius);

function drawBall() {
    ctx.beginPath();
    ctx.arc(puntoX, puntoY, radius, 0, 2*Math.PI);
    ctx.fillStyle = "#0066cc";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlex, paddley, paddlew, paddleh);
    ctx.fillStyle = "#ff3300";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let i = 0; i < brickCOlumns; i++) {
        for(let j = 0; j < brickRows; j++) {
            if(bricks[i][j].drawBrick) {
                var bx = (i * (brickWidth + brickPadding)) + brickOfSetLeft;
                var by = (j * (brickHeight + brickPadding)) + brickOfSetTop;
                bricks[i][j].x = bx;
                bricks[i][j].y = by;
                ctx.beginPath();
                ctx.rect(bx, by, brickWidth, brickHeight);
                ctx.fillStyle = "#ff3300";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function detectHits() {
    for(let i = 0; i < brickCOlumns; i++) {
        for(let j = 0; j < brickRows; j++) {
            var brick = bricks[i][j];
            if(bricks[i][j].drawBrick) {
                if(puntoX > brick.x && puntoX < brick.x + brickWidth
                    && puntoY > brick.y && puntoY < brick.y + brickHeight) {
                        dy = -dy;
                        brick.drawBrick = false;
                        score++;
                        if(score == brickCOlumns * brickRows) {
                            alert("Eres el mejor!");
                        }
            }
            }
        }
    }
}

function drawScore() {
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.fillText("Score: " + score, 10, 30);
}

function drawLives() {
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#FF4444";
    ctx.fillText("Lives: " + lives, c.width - 100, 30);
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawPaddle();
    drawBall();
    drawBricks();
    detectHits();
    drawScore();
    drawLives();

    if(puntoX + dx > c.width - radius || puntoX + dx < radius) {
        dx = -dx;
    }
    if(puntoY + dy < radius) {
        dy = -dy;
    } else {
        if(puntoY + dy > c.height - radius) {
            if(puntoX > paddlex && puntoX < paddlex + paddlew) {
                dy = -dy;
            } else {
                lives--;
                if(lives < 1) {
                    gameOver();
                    return;
                } else {
                    puntoX = c.width / 2;
                    puntoY = c.height - 10;
                    dx = 2;
                    dy = -2;
                    paddlex = c.width / 2;
                }
            }
        }
    }

    if(leftMove && paddlex > 0) {
        paddlex -= 8;
    }
    if(rightMove && paddlex < (c.width - paddlew)) {
        paddlex += 8;
    }

    puntoX += dx;
    puntoY += dy;
    requestAnimationFrame(draw);
}

function gameOver() {
    document.getElementById("myArkanoidGameOver").style.display = "block";
}

draw();






document.getElementById('canvasSize').addEventListener('input', function(e) {
    const newWidth = parseInt(e.target.value);
    const newHeight = Math.round(newWidth * 0.714);
    const scale = newWidth / 560; 

    c.width = newWidth;
    c.height = newHeight;

    document.getElementById('myArkanoid').width = newWidth;
    document.getElementById('myArkanoid').height = newHeight;
    document.getElementById('myArkanoidGameOver').width = newWidth;
    document.getElementById('myArkanoidGameOver').height = newHeight;

    document.getElementById('sizeValue').textContent = newWidth + 'px';

    paddlew = 60 * scale;
    paddleh = 12 * scale;
    paddlex = c.width / 2 - paddlew / 2;
    paddley = c.height - 10 * scale;
    
    brickWidth = 60;
    brickHeight = 20;
    brickPadding = 12;
    
    const availableWidth = c.width - 100;
    brickCOlumns = Math.floor(availableWidth / (brickWidth + brickPadding));
    
    const availableHeight = c.height * 0.4;
    brickRows = Math.max(3, Math.floor(availableHeight / (brickHeight + brickPadding)));
    
    brickOfSetTop = 30;
    brickOfSetLeft = (c.width - (brickCOlumns * (brickWidth + brickPadding))) / 2;
    
    radius = 10;
    puntoX = c.width / 2;
    puntoY = c.height - 10 * scale;
    dx = 2 * scale;
    dy = -2 * scale;
    
    initBricks();
    score = 0;
    lives = 5;
});