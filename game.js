const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruitImage = new Image();
fruitImage.src = 'fruit.png';

const fruitWidth = 80;
const fruitHeight = 80;

let fruitX = Math.random() * (canvas.width - fruitWidth);
let fruitY = Math.random() * (canvas.height - fruitHeight);

function drawFruit() {
    ctx.drawImage(fruitImage, fruitX, fruitY, fruitWidth, fruitHeight);
}

const scoreElement = document.getElementById('score');
let score = 0;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFruit();
    requestAnimationFrame(gameLoop);
}

function generateNewFruit() {
    fruitX = Math.random() * (canvas.width - fruitWidth);
    fruitY = Math.random() * (canvas.height - fruitHeight);
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
        document.getElementById('message').style.display = 'block';
        document.getElementById('resetButton').style.display = 'block';
    }
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    document.getElementById('message').style.display = 'none';
    document.getElementById('resetButton').style.display = 'none';
}

drawFruit(); // 初回の果物表示
gameLoop();
setInterval(generateNewFruit, 5000); // 5秒ごとに新しい位置にフルーツを表示
