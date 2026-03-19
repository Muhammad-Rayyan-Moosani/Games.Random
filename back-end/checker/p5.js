// Game state
let gameState = "start";
let ball;
let score = 0;
let ground;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    // Initialize ball
    ball = {
        x: width / 2,
        y: 50,
        diameter: 40,
        velocity: 0,
        gravity: 0.5
    };

    // Ground level
    ground = height - 50;
}

function draw() {
    background(135, 206, 235); // Sky blue

    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "playing") {
        drawGame();
        updateGame();
    } else if (gameState === "gameover") {
        drawGameOver();
    }
}

function drawStartScreen() {
    // Title
    fill(255);
    stroke(0);
    strokeWeight(4);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("FALLING BALL", width / 2, height / 3);

    // Instructions
    textSize(32);
    noStroke();
    text("Watch the ball fall!", width / 2, height / 2);

    textSize(24);
    text("PRESS SPACE TO START", width / 2, height / 2 + 60);

    // Controls
    textSize(20);
    text("No controls - just watch!", width / 2, height / 2 + 120);
}

function drawGame() {
    // Draw ground
    fill(101, 67, 33); // Brown
    noStroke();
    rect(0, ground, width, height - ground);

    // Draw grass on ground
    fill(34, 139, 34);
    rect(0, ground - 10, width, 10);

    // Draw ball
    fill(255, 0, 0); // Red ball
    stroke(139, 0, 0); // Dark red outline
    strokeWeight(3);
    circle(ball.x, ball.y, ball.diameter);

    // Draw score (distance fallen)
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(24);
    text("Distance: " + Math.floor(score) + "m", 20, 20);
}

function updateGame() {
    // Apply gravity
    ball.velocity += ball.gravity;
    ball.y += ball.velocity;

    // Update score (distance fallen)
    if (ball.y < ground - ball.diameter / 2) {
        score += 0.1;
    }

    // Check if ball hit the ground
    if (ball.y + ball.diameter / 2 >= ground) {
        ball.y = ground - ball.diameter / 2;
        ball.velocity = 0;
        gameState = "gameover";
    }

    // Keep ball in bounds horizontally
    ball.x = constrain(ball.x, ball.diameter / 2, width - ball.diameter / 2);
}

function drawGameOver() {
    // Continue showing game state
    drawGame();

    // Semi-transparent overlay
    fill(0, 0, 0, 150);
    noStroke();
    rect(0, 0, width, height);

    // Game Over text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("BALL LANDED!", width / 2, height / 2 - 60);

    textSize(32);
    text("Final Distance: " + Math.floor(score) + "m", width / 2, height / 2 + 20);

    textSize(24);
    text("PRESS SPACE TO RESTART", width / 2, height / 2 + 80);
}

function keyPressed() {
    if (key === ' ') {
        if (gameState === "start") {
            gameState = "playing";
        } else if (gameState === "gameover") {
            // Reset game
            ball.y = 50;
            ball.velocity = 0;
            score = 0;
            gameState = "playing";
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ground = height - 50;
}

// made by  with p5js and Claude Sonnet 4.5
