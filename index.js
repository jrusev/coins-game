window.addEventListener("load", main, false);

var canvas, ctx;
var width = 20
var height = 20
var color = "blue"
var x = 10
var y = 120
var delta = 5;
var keys;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);
    document.addEventListener('keydown', function (e) {
        keys = (keys || []);
        keys[e.keyCode] = (e.type == "keydown");
    })
    document.addEventListener('keyup', function (e) {
        keys[e.keyCode] = (e.type == "keydown");
    })    
    draw();
}

function isAllowed(x, y) {
    return x >= 0 && x <= canvas.width - width && y >= 0 && y <= canvas.height - height
}

function draw() {
    dx = dy = 0
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
