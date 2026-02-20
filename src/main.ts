const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// fixed size
canvas.width = 800;
canvas.height = 500;

// controls
const keys = new Set<string>();
addEventListener("keydown", e => keys.add(e.key.toLowerCase()));
addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));

// paddles
const paddleW = 10;
const paddleH = 100;
const paddleSpeed = 6;

let p1y = canvas.height / 2 - paddleH / 2;
let p2y = canvas.height / 2 - paddleH / 2;

// ball
const ballR = 8;
let bx = canvas.width / 2;
let by = canvas.height / 2;
let bvx = 4;
let bvy = 3;

function resetBall() {
    bx = canvas.width / 2;
    by = canvas.height / 2;
    bvx = Math.random() < 0.5 ? -4 : 4;
    bvy = (Math.random() * 8) - 4;
}


function update() {
    // move paddles
    if (keys.has("r")) p1y -= paddleSpeed;
    if (keys.has("f")) p1y += paddleSpeed;
    if (keys.has("u")) p2y -= paddleSpeed;
    if (keys.has("j")) p2y += paddleSpeed;

    // clamp paddles
    p1y = Math.max(0, Math.min(canvas.height - paddleH, p1y));
    p2y = Math.max(0, Math.min(canvas.height - paddleH, p2y));

    // move ball
    bx += bvx;
    by += bvy;

    // bounce top/bottom
    if (by < ballR || by > canvas.height - ballR) {
        bvy *= -1;
    }

    // paddle positions
    const p1x = 20;
    const p2x = canvas.width - 20 - paddleW;

    // collision with paddles
    const hitP1 =
        bx - ballR < p1x + paddleW &&
        by > p1y &&
        by < p1y + paddleH;

    const hitP2 =
        bx + ballR > p2x &&
        by > p2y &&
        by < p2y + paddleH;

    if (hitP1 && bvx < 0) bvx *= -1;
    if (hitP2 && bvx > 0) bvx *= -1;

    // out of bounds
    if (bx < 0) resetBall();
    if (bx > canvas.width) resetBall();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    // paddles
    ctx.fillRect(20, p1y, paddleW, paddleH);
    ctx.fillRect(canvas.width - 20 - paddleW, p2y, paddleW, paddleH);

    // ball
    ctx.beginPath();
    ctx.arc(bx, by, ballR, 0, Math.PI * 2);
    ctx.fill();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
