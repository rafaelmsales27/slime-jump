import { Obstacle } from './Obstacle.js';
import { Player } from './Player.js';
import { input } from './InputHandler.js';
import { ParallaxBackground } from './ParallaxBackground.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
        canvas.width = 480;
        canvas.height = 270;

        this.score = 0;
        this.isGameOver = false;
        this.keys = {};

        this.gameVelocity = 0.2;

        this.player = new Player(
            50, // x
            canvas.height - 100, // y (bottomLine)
            57, // width
            35, // height
            0, // initial velocityY
            350 // jumpStrength
        );

        const obstacleSpawnInterval = 3000;
        this.obstacle = new Obstacle(
            30, // width
            50, // height
            obstacleSpawnInterval
        );

        this.lastTime = 0;

    
        this.parallaxBackground = new ParallaxBackground(this.context);

        const background = new Image();
        background.src = './assets/images/background/1.Background.png';

        const treesBack = new Image();
        treesBack.src = './assets/images/background/2.Trees_back.png';

        const treesFront = new Image();
        treesFront.src = './assets/images/background/3.Trees_front.png';

        const ground = new Image();
        ground.src = './assets/images/background/4.Ground.png';

        this.parallaxBackground.addLayer(
            background, // sprite
            0, // initialX
            1, // scale
            0 // speed
        );

        this.parallaxBackground.addLayer(
            treesBack,
            0,
            1,
            -this.gameVelocity / 4
        );

        this.parallaxBackground.addLayer(
            treesFront,
            0,
            1,
            -this.gameVelocity / 2
        );

        this.parallaxBackground.addLayer(
            ground,
            0,
            1,
            -this.gameVelocity
        );
    }

    drawElements(deltaTime) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.parallaxBackground.drawAll(deltaTime);

        this.player.draw(this.context);

        this.obstacle.draw(this.context);

        // UI.draw();
    }

    updateState(deltaTime) {
        input.update();
        this.player.update(deltaTime);
        if (input.isKeyPressed(' ')) {
            this.player.jump();
        }

        this.parallaxBackground.updateAll(deltaTime);

        this.obstacle.update(deltaTime);

        this.checkCollisions();

        if (this.isGameOver && input.isKeyPressed('r')) {
            this.restartGame();
        }
    }

    gameLoop(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        this.updateState(deltaTime);
        this.drawElements(deltaTime);
        // drawGrid();
        if (this.gameOver) {
            this.gameVelocity = 0;
        } else {
            requestAnimationFrame(gameLoop); // Recursively call gameLoop
        }
    }

    gameOver() {
        // TODO: Handle game-over logic
        this.isGameOver = true;
        // Stop music and play game over sfx
    }

    restartGame() {
        this.isGameOver = false;
        this.score = 0;

        this.player = new Player(this);
        this.obstacle = new Obstacle(this);
        // ... reset other game objects
        this.start();
    }


    checkCollisions() {
        this.obstacle.obstacles.forEach(obstacle => {
            if (
                this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.width > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y
            ) {
                this.gameOver();
            }
        });
    }

    start() {
        requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
    }
}