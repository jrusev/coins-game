window.addEventListener("load", main, false);

const canvasWidth = 640;
const canvasHeight = 360;
const width = 20;
const height = 20;
const coinWidth = 20;
const coinHeight = 20;
const heroColor = "blue";
const delta = 5;
const coinColor = "orange";
const coinMakeChance = 0.01;
const coinDeleteChance = 0.001;
const smallFontSize = 18;
const largeFontSize = 42;
const textFont = "Arial";
const textColor = "#0095DD";
const textX = smallFontSize;
const textY = smallFontSize;
const keys = {};
const gameDurationSec = 30;
const coinSound = new Audio('coin.wav');
const gameOverSound = new Audio('game-over.wav');
const useCoinImage = true;
const useHeroImage = true;
const imageFiles = [
    {name: 'coin', path: 'coin.png'},
    {name: 'hero', path: 'hero.png'}
];

let canvas, ctx;
let coins = [];
let x, y;
let eaten = 0;
let timeLeft;
let finished = false;
let images;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    x = canvasWidth / 2;
    y = canvasHeight / 2;
    timeLeft = gameDurationSec;

    document.body.appendChild(canvas);
    document.addEventListener('keydown', e => keys[e.keyCode] = true);
    document.addEventListener('keyup', e => keys[e.keyCode] = false);

    images = loadImages(imageFiles, () => {
        setInterval(timer, 1000);
        draw();
    });
}

function loadImages(files, onAllLoaded) {
    let count = files.length;
    const onload = () => --count === 0 && onAllLoaded();
    const images = {};
    for (let file of files) {
        const img = new Image();
        img.src = file.path;
        img.onload = onload;
        images[file.name] = img;
    }
    return images;
}

function timer() {
    timeLeft -= 1;
    if (!timeLeft) {
       clearInterval(timer);
       finished = true;
    }
}

function isAllowed(x, y) {
    return x >= 0 && x <= canvasWidth - width && y >= 0 && y <= canvasHeight - height;
}

function maybeMakeCoin() {
    if (Math.random() > coinMakeChance) {
        return;
    }
    const x = Math.random() * (canvasWidth - width);
    const y = Math.random() * (canvasHeight - height);
    coins.push({x, y});
}

function maybeRemoveCoins() {
    coins = coins.filter(c => Math.random() > coinDeleteChance);
}

function isCollision(coin) {
    return (
        x + width >= coin.x
        && x <= coin.x + coinWidth
        && y + height >= coin.y
        && y <= coin.y + coinHeight);
}

function maybeEatCoins() {
    const numCoinsBefore = coins.length;
    coins = coins.filter(coin => !isCollision(coin));
    if (numCoinsBefore > coins.length) {
        coinSound.play();
        eaten += numCoinsBefore - coins.length;
    }
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, 0, 2 * Math.PI, false);
    ctx.fill();
}

function drawCoins() {
    for (let coin of coins) {
        if (useCoinImage) {
            ctx.drawImage(images.coin, coin.x, coin.y, coinWidth, coinWidth);
        } else {
            drawCircle(coin.x, coin.y, coinWidth / 2, coinColor);
        }
    }
}

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawPlayer() {
    if (useHeroImage) {
        ctx.drawImage(images.hero, x, y);
    } else {
        drawRect(x, y, heroColor)
    }
}

function drawText() {
    ctx.font = `${smallFontSize}px ${textFont}`;
    ctx.fillStyle = textColor;
    ctx.fillText(`Coins: $${10*eaten}`, textX, textY);
    ctx.fillText(`Time: ${timeLeft}`, canvasWidth - 5*smallFontSize, textY);
}

function gameOver() {
    ctx.font = `${largeFontSize}px ${textFont}`;
    ctx.fillText("GAME OVER!", canvasWidth / 2 - 2.7*largeFontSize, canvasHeight / 2);
    gameOverSound.play();
}

function moveHero() {
    let dx = 0;
    let dy = 0;
    if (keys[37]) { dx = -delta; }
    if (keys[39]) { dx = +delta; }
    if (keys[38]) { dy = -delta; }
    if (keys[40]) { dy = +delta; }
    if (isAllowed(x + dx, y + dy)) {
        x += dx;
        y += dy;
    }
}

function updateState() {
    maybeMakeCoin();
    maybeRemoveCoins();
    moveHero();
    maybeEatCoins();
}

function draw() {
    updateState();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPlayer();
    drawCoins();
    drawText();
    if (finished) {
        gameOver();
    } else {
        requestAnimationFrame(draw);
    }
}
