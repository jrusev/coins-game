window.addEventListener("load", main, false);

const width = 20;
const height = 20;
const color = "blue";
const delta = 5;
const keys = {};

let canvas, ctx;
let x = 10;
let y = 120;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);
    document.addEventListener('keydown', function (e) {
        keys[e.keyCode] = (e.type == "keydown");
    })
    document.addEventListener('keyup', function (e) {
        keys[e.keyCode] = (e.type == "keydown");
    })    
    draw();
}

function isAllowed(x, y) {
    return x >= 0 && x <= canvas.width - width && y >= 0 && y <= canvas.height - height;
}

function draw() {
    let dx = 0;
    let dy = 0;
    if (keys && keys[37]) { dx = -delta; }
    if (keys && keys[39]) { dx = +delta; }
    if (keys && keys[38]) { dy = -delta; }
    if (keys && keys[40]) { dy = +delta; }
    if (isAllowed(x + dx, y + dy)) {
        x += dx;
        y += dy;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
    requestAnimationFrame(draw);
}
