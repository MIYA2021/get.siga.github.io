const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruitImage = new Image();
fruitImage.src = 'fruit.png';

const fruitWidth = 80;
const fruitHeight = 80;
const gameTime = 30; // ゲーム時間（秒）

let fruitX = Math.random() * (canvas.width - fruitWidth);
let fruitY = Math.random() * (canvas.height - fruitHeight);

let gameStarted = false;
let timeLeft = gameTime;

function drawFruit() {
    ctx.drawImage(fruitImage, fruitX, fruitY, fruitWidth, fruitHeight);
}

const scoreElement = document.getElementById('score');
let score = 0;

const timerElement = document.getElementById('time');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

function gameLoop() {
    if (gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFruit();
        updateTime();
        requestAnimationFrame(gameLoop);
    }
}

function generateNewFruit() {
    fruitX = Math.random() * (canvas.width - fruitWidth);
    fruitY = Math.random() * (canvas.height - fruitHeight);
}

function updateTime() {
    if (timeLeft > 0) {
        timeLeft -= 1;
        timerElement.textContent = timeLeft;
    } else {
        endGame();
    }
}

function endGame() {
    gameStarted = false;
    messageElement.style.display = 'block';
    resetButton.style.display = 'block';
}

function startGame() {
    gameStarted = true;
    score = 0;
    timeLeft = gameTime;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    messageElement.style.display = 'none';
    resetButton.style.display = 'none';
    generateNewFruit();
    gameLoop();
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
    timerElement.textContent = timeLeft;
    messageElement.style.display = 'none';
    resetButton.style.display = 'none';
    startGame();
}

drawFruit(); // 初回の果物表示
