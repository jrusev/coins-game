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

function draw() {
    if (keys && keys[37]) { x += -delta; }
    if (keys && keys[39]) { x += +delta; }
    if (keys && keys[38]) { y += -delta; }
    if (keys && keys[40]) { y += +delta; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    requestAnimationFrame(draw);
}
