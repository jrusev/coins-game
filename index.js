window.addEventListener("load", main, false);

const width = 20;
const height = 20;
const color = "blue";
const delta = 5;
const coinColor = "orange";
const coinMakeChance = 0.01;
const coinDeleteChance = 0.001;
const keys = {};

let canvas, ctx;
let coins = [];
let x = 10;
let y = 120;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);
    document.addEventListener('keydown', e => keys[e.keyCode] = true)
    document.addEventListener('keyup', e => keys[e.keyCode] = false)
    draw();
}

function isAllowed(x, y) {
    return x >= 0 && x <= canvas.width - width && y >= 0 && y <= canvas.height - height;
}

function maybeMakeCoin() {
    if (Math.random() > coinMakeChance) {
        return;
    }
    const x = Math.random() * (canvas.width - width);
    const y = Math.random() * (canvas.height - height);
    coins.push({x, y});
}

function maybeRemoveCoins() {
    coins = coins.filter(c => Math.random() > coinDeleteChance);
}

function isCollision(coin) {
    return x + width >= coin.x && x <= coin.x + width && y + width >= coin.y && y <= coin.y + height;
}

function maybeEatCoins() {
    coins = coins.filter(coin => !isCollision(coin));
}

function drawCoins() {
    ctx.fillStyle = coinColor;
    const r = width / 2;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawCoins();
    requestAnimationFrame(draw);
}
