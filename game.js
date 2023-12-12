// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruitImage1 = new Image();
const fruitImage2 = new Image();
fruitImage1.src = 'fruit1.png';
fruitImage2.src = 'fruit2.png';

const fruitWidth = 80;
const fruitHeight = 80;

let gameTime = 60; // ゲーム時間（秒）
let timeSpeed = 1; // タイムスピード

let fruitX1 = Math.random() * (canvas.width - fruitWidth);
let fruitY1 = Math.random() * (canvas.height - fruitHeight);

let fruitX2 = Math.random() * (canvas.width - fruitWidth);
let fruitY2 = Math.random() * (canvas.height - fruitHeight);

let gameStarted = false;
let timeLeft = gameTime;
let lastTimestamp = 0;

let level = 'Intermediate';
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
        drawFruits();
        updateTime(elapsedSeconds);
        requestAnimationFrame(gameLoop);
    }
}

function drawFruits() {
    ctx.drawImage(fruitImage1, fruitX1, fruitY1, fruitWidth, fruitHeight);
    ctx.drawImage(fruitImage2, fruitX2, fruitY2, fruitWidth, fruitHeight);
}

function generateNewFruits() {
    fruitX1 = Math.random() * (canvas.width - fruitWidth);
    fruitY1 = Math.random() * (canvas.height - fruitHeight);

    fruitX2 = Math.random() * (canvas.width - fruitWidth);
    fruitY2 = Math.random() * (canvas.height - fruitHeight);
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
        if (score === 25 && level === 'Intermediate') {
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
        gameTime = 10; // Intermediateモード：10秒
        timeSpeed = 1; // タイムスピードを通常に戻す
    } else {
        gameTime = 60; // イージーモード：1分
        timeSpeed = 1; // タイムスピードを通常に戻す
    }

    timeLeft = gameTime;
    scoreElement.textContent = score;
    timerElement.textContent = formatTime(timeLeft);
    messageElement.style.display = 'none';
    congratulationsElement.style.display = 'none';
    resetButton.style.display = 'none';
    updateLevel();
    generateNewFruits();
    requestAnimationFrame(gameLoop);
}

function updateLevel() {
    levelInfoElement.textContent = `レベル: ${level}`;
}

canvas.addEventListener('click', (e) => {
    if (gameStarted) {
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        if ((mouseX >= fruitX1 && mouseX <= fruitX1 + fruitWidth && mouseY >= fruitY1 && mouseY <= fruitY1 + fruitHeight) ||
            (mouseX >= fruitX2 && mouseX <= fruitX2 + fruitWidth && mouseY >= fruitY2 && mouseY <= fruitY2 + fruitHeight)) {
            score++;
            scoreElement.textContent = score;
            generateNewFruits();
            checkScore();
        }
    }
});

function checkScore() {
    updateLevel();
    if (level === 'Hard' && timeLeft <= 0) {
        endGame();
    } else if (level !== 'Hard' && score === 25 && timeLeft >= 0) {
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