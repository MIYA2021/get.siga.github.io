const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruitImage = new Image();
fruitImage.src = 'fruit.png';

const fruitWidth = 80;
const fruitHeight = 80;
const gameTime = 15; // ゲーム時間（秒）

let fruitX = Math.random() * (canvas.width - fruitWidth);
let fruitY = Math.random() * (canvas.height - fruitHeight);

let gameStarted = false;
let timeLeft = gameTime;
let lastTimestamp = 0;

function drawFruit() {
    ctx.drawImage(fruitImage, fruitX, fruitY, fruitWidth, fruitHeight);
}

const scoreElement = document.getElementById('score');
let score = 0;

const timerElement = document.getElementById('time');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const congratulationsElement = document.getElementById('congratulations');

function gameLoop(timestamp) {
    if (gameStarted) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
        }

        const elapsedSeconds = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFruit();
        updateTime(elapsedSeconds);
        requestAnimationFrame(gameLoop);
    }
}

function generateNewFruit() {
    fruitX = Math.random() * (canvas.width - fruitWidth);
    fruitY = Math.random() * (canvas.height - fruitHeight);
}

function updateTime(elapsedSeconds) {
    if (timeLeft > 0) {
        timeLeft -= elapsedSeconds;
        timerElement.textContent = timeLeft.toFixed(0);
    } else {
        endGame();
    }
}

function endGame() {
    gameStarted = false;
    if (score >= 20) {
        congratulationsElement.style.display = 'block';
    } else {
        messageElement.style.display = 'block';
    }
    resetButton.style.display = 'block';
}

function startGame() {
    gameStarted = true;
    lastTimestamp = 0;
    score = 0;
    timeLeft = gameTime;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft.toFixed(0);
    messageElement.style.display = 'none';
    congratulationsElement.style.display = 'none';
    resetButton.style.display = 'none';
    generateNewFruit();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (e) => {
    if (gameStarted) {
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        if (mouseX >= fruitX && mouseX <= fruitX + fruitWidth && mouseY >= fruitY && mouseY <= fruitY + fruitHeight) {
            score++;
            scoreElement.textContent = score;
            generateNewFruit();
            checkScore();
        }
    }
});

function checkScore() {
    if (score >= 20) {
        endGame();
    }
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    timeLeft = gameTime;
    timerElement.textContent = timeLeft.toFixed(0);
    messageElement.style.display = 'none';
    congratulationsElement.style.display = 'none';
    resetButton.style.display = 'none';
    startGame();
}

drawFruit(); // 初回の果物表示