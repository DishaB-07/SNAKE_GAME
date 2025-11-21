let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let box = 20;
let snake = [{ x: 200, y: 200 }];
let food = randomFood();
let direction = null;
let gameLoop;
let speed = 120;
let paused = false;


// Start game
function startGame() {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    if (isMobile()) {
        document.querySelector(".mobile-controls").style.display = "grid";
    }

    gameLoop = setInterval(update, speed);
}

// Get random food position
function randomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (e.key === " ") togglePause();
});

// Mobile button controls
function setDirection(dir) {
    direction = dir;
}

// Main game loop
function update() {
    if (paused) return;

    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }

    // Check collisions
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        collision(head)
    ) {
        gameOver();
    }

    draw();
}

// Draw game objects
function draw() {
    ctx.fillStyle = "#030014";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0ff";
    snake.forEach((s) => ctx.fillRect(s.x, s.y, box, box));

    ctx.fillStyle = "#f0f";
    ctx.fillRect(food.x, food.y, box, box);
}

// Collision detection
function collision(head) {
    return snake.slice(1).some(s => s.x === head.x && s.y === head.y);
}

// GAME OVER HANDLER
function gameOver() {
    clearInterval(gameLoop);

    let score = snake.length - 1;
    let best = localStorage.getItem("bestScore") || 0;

    if (score > best) {
        best = score;
        localStorage.setItem("bestScore", best);
    }

    document.getElementById("finalScore").innerText = "Score: " + score;
    document.getElementById("bestScore").innerText = "Best Score: " + best;

    document.body.classList.add("blur");
    let popup = document.getElementById("gameOver");
    popup.style.display = "block";

    setTimeout(() => {
        popup.classList.add("show");
    }, 20);
}

// Restart game
function restartGame() {
    location.reload();
}

// Return to menu
function returnToMenu() {
    location.reload();
}

// Pause game
function togglePause() {
    paused = !paused;
}

// Detect mobile device
function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Swipe controls (mobile)
let startX, startY;

document.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let dx = e.changedTouches[0].clientX - startX;
    let dy = e.changedTouches[0].clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) direction = "RIGHT";
        else direction = "LEFT";
    } else {
        if (dy > 0) direction = "DOWN";
        else direction = "UP";
    }
});

