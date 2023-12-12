// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruitImage = new Image();
fruitImage.src = 'fruit.png';

const fruitWidth = 80;
const fruitHeight = 80;

let gameTime = 60; // ゲーム時間（秒）
let timeSpeed = 1; // タイムスピード

let fruitX = Math.random() * (canvas.width - fruitWidth);
let fruitY = Math.random() * (canvas.height - fruitHeight);

let gameStarted = false;
let timeLeft = gameTime;
let lastTimestamp = 0;

let level = 'Easy';
const levelInfoElement = document.getElementById('levelInfo');
const levelButtons = document.getElementById('levelButtons').querySelectorAll('.levelButton');
let levelSelected = false; // レベルが選択されたかどうかのフラグ

const scoreElement = document.getElementById('score');
let score = 0;

const timerElement = document.getElementById('time');
const messageElement = document.getElementById('message');
const congratulationsElement = document.getElementById('congratulations');
const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');

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

function drawFruit() {
    ctx.drawImage(fruitImage, fruitX, fruitY, fruitWidth, fruitHeight);
}

function generateNewFruit() {
    fruitX = Math.random() * (canvas.width - fruitWidth);
    fruitY = Math.random() * (canvas.height - fruitHeight);
}

function updateTime(elapsedSeconds) {
    if (timeLeft > 0) {
        timeLeft -= elapsedSeconds * timeSpeed;
        timerElement.textContent = formatTime(timeLeft);
    } else {
        endGame();
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toFixed(0).padStart(2, '0')}`;
}

function endGame() {
    gameStarted = false;

    if (level === 'Hard') {
        messageElement.style.display = 'block';
    } else {
        if (score === 20 && level === 'Easy') {
            congratulationsElement.style.display = 'block';
        } else if (level === 'Intermediate' && score === 15) {
            congratulationsElement.style.display = 'block';
        } else {
            messageElement.style.display = 'block';
        }
    }

    resetButton.style.display = 'block';
    enableLevelButtons();
}

function disableLevelButtons() {
    levelButtons.forEach(button => button.disabled = true);
}

function enableLevelButtons() {
    levelButtons.forEach(button => button.disabled = false);
}

function selectLevel(selectedLevel) {
    if (!levelSelected) {
        level = selectedLevel;
        levelSelected = true;
        disableLevelButtons();
        levelInfoElement.textContent = `レベル: ${level}`;
        startGame();
    }
}

function startGame() {
    gameStarted = true;
    lastTimestamp = 0;
    score = 0;

    if (level === 'Hard') {
        gameTime = 180; // ハードモード：3分
        timeSpeed = 2.0; // タイムスピードを速くする
    } else if (level === 'Intermediate') {
        gameTime = 60; // Intermediateモード：1分
        timeSpeed = 1.2; // タイムスピードを通常より速めに
    } else {
        gameTime = 60; // イージーモード：1分
        timeSpeed = 0.8; // タイムスピードを通常より遅めに
    }

    timeLeft = gameTime;
    scoreElement.textContent = score;
    timerElement.textContent = formatTime(timeLeft);
    messageElement.style.display = 'none';
    congratulationsElement.style.display = 'none';
    resetButton.style.display = 'none';
    updateLevel();
    generateNewFruit();
    requestAnimationFrame(gameLoop);
}

function updateLevel() {
    levelInfoElement.textContent = `レベル: ${level}`;
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
    updateLevel();
    if (level === 'Hard' && timeLeft <= 0) {
        endGame();
    } else if (level !== 'Hard' && score === 20 && timeLeft >= 0) {
        endGame();
    }
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    timeLeft = gameTime;
    timerElement.textContent = formatTime(timeLeft);
    messageElement.style.display = 'none';
    congratulationsElement.style.display = 'none';
    resetButton.style.display = 'none';
    levelSelected = false; // レベル選択をリセット
}

document.getElementById('startButton').addEventListener('click', () => {
    resetGame();
});

// 初期化
resetGame();