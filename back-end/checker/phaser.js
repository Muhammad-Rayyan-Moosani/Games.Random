// Game configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Global variables
let gameState = 'start';
let ball;
let ground;
let startScreenObjects = [];
let gameOverText;
let scoreText;
let score = 0;

function create() {
    if (gameState === 'start') {
        showStartScreen(this);
    }

    // Handle space key to start game
    this.input.keyboard.on('keydown-SPACE', () => {
        if (gameState === 'start') {
            startScreenObjects.forEach(obj => obj.destroy());
            startScreenObjects = [];
            gameState = 'playing';
            startGame(this);
        } else if (gameState === 'gameover') {
            restartGame(this);
        }
    });

    // Handle click to start/restart
    this.input.on('pointerdown', () => {
        if (gameState === 'start') {
            startScreenObjects.forEach(obj => obj.destroy());
            startScreenObjects = [];
            gameState = 'playing';
            startGame(this);
        } else if (gameState === 'gameover') {
            restartGame(this);
        }
    });
}

function showStartScreen(scene) {
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;

    // Game title
    const title = scene.add.text(centerX, centerY - 100, 'FALLING BALL', {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#FF6B6B',
        fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    startScreenObjects.push(title);

    // Objective
    const objective = scene.add.text(centerX, centerY, 'Watch the ball fall to the ground!', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#4ECDC4'
    });
    objective.setOrigin(0.5);
    startScreenObjects.push(objective);

    // Instructions
    const instructions = scene.add.text(centerX, centerY + 60, 'PRESS SPACE or CLICK TO START', {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#FFE66D'
    });
    instructions.setOrigin(0.5);
    startScreenObjects.push(instructions);
}

function startGame(scene) {
    // Create ground
    ground = scene.add.rectangle(
        scene.cameras.main.width / 2,
        scene.cameras.main.height - 50,
        scene.cameras.main.width,
        100,
        0x8B4513
    );
    scene.physics.add.existing(ground, true); // true makes it static

    // Create ball at top of screen
    ball = scene.add.circle(
        scene.cameras.main.width / 2,
        100,
        30,
        0xFF6B6B
    );
    scene.physics.add.existing(ball);
    ball.body.setBounce(0.7); // Makes ball bounce when it hits ground
    ball.body.setCollideWorldBounds(false); // Allow ball to fall through world bounds

    // Add collision between ball and ground
    scene.physics.add.collider(ball, ground, onBallHitGround);

    // Score display
    scoreText = scene.add.text(20, 20, 'Distance: 0', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#333333'
    });

    score = 0;
}

function onBallHitGround() {
    // Game ends when ball hits ground
    if (gameState === 'playing') {
        gameState = 'gameover';
        showGameOver(ball.scene);
    }
}

function showGameOver(scene) {
    // Hide game objects
    if (ball) ball.setVisible(false);

    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;

    // Game over background
    const overlay = scene.add.rectangle(
        centerX,
        centerY,
        scene.cameras.main.width,
        scene.cameras.main.height,
        0x000000,
        0.7
    );

    // Game over text
    gameOverText = scene.add.text(centerX, centerY - 80, 'BALL HIT THE GROUND!', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#FF6B6B',
        fontStyle: 'bold'
    });
    gameOverText.setOrigin(0.5);

    // Final score
    const finalScore = scene.add.text(centerX, centerY, 'Distance Fallen: ' + Math.floor(score), {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#FFE66D'
    });
    finalScore.setOrigin(0.5);

    // Restart instructions
    const restart = scene.add.text(centerX, centerY + 80, 'PRESS SPACE or CLICK TO RESTART', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#4ECDC4'
    });
    restart.setOrigin(0.5);
}

function restartGame(scene) {
    // Clear everything and restart
    scene.scene.restart();
    gameState = 'start';
    score = 0;
}

function update() {
    if (gameState !== 'playing') return;

    // Track how far ball has fallen
    if (ball && ball.y > 100) {
        score = ball.y - 100;
        if (scoreText) {
            scoreText.setText('Distance: ' + Math.floor(score));
        }
    }
}

// made by  with phaser and Claude Sonnet 4.5
