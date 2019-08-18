window.addEventListener("load", main, false);

const width = 20;
const height = 20;
const coinWidth = 20;
const coinHeight = 20;
const color = "blue";
const delta = 5;
const coinColor = "orange";
const coinMakeChance = 0.01;
const coinDeleteChance = 0.001;
const textFont = "18px Arial";
const textColor = "#0095DD";
const textX = 8;
const textY = 20;
const keys = {};
const coinSound = new Audio('coin.wav');
const gameOverSound = new Audio('game-over.wav');
const canvasWidth = 640;
const canvasHeight = 360;

let canvas, ctx;
let coins = [];
let x, y;
let eaten = 0;
let timeLeft = 30;
let finished = false;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    x = canvasWidth / 2;
    y = canvasHeight / 2;

    document.body.appendChild(canvas);
    document.addEventListener('keydown', e => keys[e.keyCode] = true)
    document.addEventListener('keyup', e => keys[e.keyCode] = false)

    setInterval(timer, 1000);

    draw();
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

function drawCoins() {
    ctx.fillStyle = coinColor;
    const r = coinWidth / 2;
    for (let coin of coins) {
        ctx.beginPath();
        ctx.arc(coin.x + r, coin.y + r, r, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

function drawPlayer() {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawText() {
    ctx.font = textFont;
    ctx.fillStyle = textColor;
    ctx.fillText(`Coins: $${10*eaten}`, textX, textY);
    ctx.fillText(`Time: ${timeLeft}`, canvasWidth - 100, textY);
}

function gameOver() {
    ctx.font = "28px Arial";
    ctx.fillText("Game over!", canvasWidth / 2 - 80, canvasHeight / 2);
    gameOverSound.play();
}

function updateState() {
    maybeMakeCoin();
    maybeRemoveCoins();

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
