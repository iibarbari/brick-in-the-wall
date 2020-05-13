var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var Game = {};

var x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
var y = canvas.height - 60 + Math.floor(Math.random() * 21) - 10;
var dx = 5;
var dy = -5;
var ballRadius = 30;
var paddleHeight = 15;
var paddleWidth = 150;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickPadding = 10;
var brickOffsetTop = 50;
var brickOffsetLeft = 30;
var brickWidth = (canvas.width - brickOffsetLeft * 2) / brickColumnCount - brickPadding;
var brickHeight = 25;
var bricks = [];
var defaultColor = '#0095dd';
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var isPaused = false;
var ball = new Image();

ball.src= 'src/ricardo.jpg';

Game.reset = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

Game.createBricks = () => {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                brickX: 0,
                brickY: 0,
                status: 1
            };
        }
    }
};

Game.drawBall = () => {
    // context.beginPath();
    context.drawImage(ball, x, y, ballRadius, ballRadius);
    // context.fillStyle = defaultColor;
    // context.fill();
    // context.closePath();
};

Game.drawPaddle = () => {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = defaultColor;
    context.fill();
    context.closePath();
};

Game.drawScore = () => {
    context.font = '16px Arial';
    context.fillStyle = defaultColor;
    context.textAlign = 'left';
    context.fillText(`Score is: ${score}`, brickOffsetLeft, brickOffsetTop / 1.5);
};

Game.drawLives = () => {
    var text = lives === 3 ? '<3 <3 <3' : lives === 2 ? '<3 <3' : '<3';

    context.font = '16px Arial';
    context.fillStyle = defaultColor;
    context.textAlign = 'right';
    context.fillText(`Lives: ${text}`, canvas.width - (brickOffsetLeft + brickPadding), brickOffsetTop / 1.5);

};

Game.drawLevel = () => {
    context.font = '16px Arial';
    context.fillStyle = defaultColor;
    context.textAlign = 'center';
    context.fillText(`Level ${level}`, canvas.width / 2, brickOffsetTop / 1.5);
};

Game.positionBall = () => {
    x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
    y = canvas.height - 60 + Math.floor(Math.random() * 21) - 10;
    paddleX = (canvas.width - paddleWidth) / 2;
};

Game.checkIfBallHitsTheCorners = () => {
    x += dx;
    y += dy;

    if (y + dy - ballRadius < 0) {
        dy = -dy;
    } else if (y + dy + ballRadius > canvas.height) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives -= 1;

            if (lives === 0) {
                alert('Game Over');
                document.location.reload();
            } else {
                Game.positionBall();
            }

        }
    }

    if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
        dx = -dx;
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }

    if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
};

Game.drawBricks = () => {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            var brickX = ((brickWidth + brickPadding) * c) + brickOffsetLeft;
            var brickY = ((brickHeight + brickPadding) * r) + brickOffsetTop;
            var {
                status
            } = bricks[c][r];

            bricks[c][r].brickX = brickX;
            bricks[c][r].brickY = brickY;

            if (status === 1) {
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = defaultColor;
                context.fill();
                context.closePath();
            }
        }
    }
};

Game.collisionDetection = () => {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            var {
                brickX,
                brickY,
                status
            } = bricks[c][r];

            if (status === 1) {
                if (x > brickX && x < brickX + brickWidth && y > brickY && y < brickY + brickHeight) {
                    dy = -dy;
                    bricks[c][r].status = 0;
                    score += 1;

                    if (score === brickColumnCount * brickRowCount * level) {
                        // if (score === 2 * level) {
                        if (level === maxLevel) {
                            alert('You win');
                            document.location.reload();
                        } else {
                            level++;
                            brickRowCount++;
                            Game.createBricks();
                            dx += 1;
                            dy = -(Math.abs(dy) + 1);
                            Game.positionBall();
                            Game.drawPauseScreen();
                            isPaused = true;

                            setTimeout(() => {
                                isPaused = false;
                                Game.init();
                            }, 3000);
                        }

                    }
                }
            }
        }
    }

};

Game.drawPauseScreen = () => {
    context.beginPath();
    context.fillStyle = defaultColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '22px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(`Level ${level - 1} completed starting next level...`, canvas.width / 2, canvas.height / 2);
    context.closePath();
};

Game.keyUpHandler = e => {
    if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false;
    }
};

Game.keyDownHandler = e => {
    if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true;
    }
};

Game.mouseMoveHandler = e => {
    var relativeX = e.clientX - canvas.offsetLeft;

    if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
};

Game.listenEvents = () => {
    document.addEventListener('keyup', e => Game.keyUpHandler(e));
    document.addEventListener('keydown', e => Game.keyDownHandler(e));
    document.addEventListener('mousemove', e => Game.mouseMoveHandler(e));
};

Game.draw = () => {
    Game.reset();
    Game.drawBall();
    Game.drawPaddle();
    Game.drawBricks();
    Game.drawScore();
    Game.drawLives();
    Game.drawLevel();
    Game.checkIfBallHitsTheCorners();
    Game.listenEvents();
    Game.collisionDetection();

    if (!isPaused) {
        requestAnimationFrame(Game.draw);
    }
};

Game.init = () => {
    Game.createBricks();
    Game.draw();
};

Game.init();
