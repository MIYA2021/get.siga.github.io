const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruitImage = new Image();
fruitImage.src = 'fruit.png';

const fruitWidth = 80;
const fruitHeight = 80;
const gameTime = 30; // ゲーム時間（秒）

let fruitX = Math.random() * (canvas.width - fruitWidth);
let fruitY = Math.random() * (canvas.height - fruitHeight);

function drawFruit() {
    ctx.drawImage(fruitImage, fruitX, fruitY, fruitWidth, fruitHeight);
}

const scoreElement = document.getElementById('score');
let score = 0;

const timerElement = document.getElementById('time');
let timeLeft = gameTime;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFruit();
    updateTime();
    requestAnimationFrame(gameLoop);
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
    document.getElementById('message').style.display = 'block';
    document.getElementById('resetButton').style.display = 'block';
}

canvas.addEventListener('click', (e) => {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    if (mouseX >= fruitX && mouseX <= fruitX + fruitWidth && mouseY >= fruitY && mouseY <= fruitY + fruitHeight) {
        score++;
        scoreElement.textContent = score;
        generateNewFruit();
        checkScore();
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
    document.getElementById('message').style.display = 'none';
    document.getElementById('resetButton').style.display = 'none';
}

drawFruit(); // 初回の果物表示
gameLoop();
setInterval(generateNewFruit, 5000); // 5秒ごとに新しい位置にフルーツを表示
