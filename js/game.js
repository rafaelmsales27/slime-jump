import Obstacle from './Obstacle.js';
import Player from './Player.js';

class Game {
    constructor() {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        canvas.width = 480;
        canvas.height = 270;

        this.score = 0;
        this.isGameOver = false;
        this.keys = {};

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

        this.initEventListeners();
    }

    drawElements(deltaTime) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Background draw
        firstLayer.draw();
        makeInfiniteScroll(deltaTime, secondLayer, -gameVelocity / 4); // 0.05
        makeInfiniteScroll(deltaTime, thirdLayer, -gameVelocity / 2); // 0.1
        makeInfiniteScroll(deltaTime, forthLayer, -gameVelocity); // 0.2

        Player.draw();

        Obstacle.drawAll();

        UI.draw();
    }

    updateState(deltaTime) {
        this.player.update(deltaTime);
        this.obstacle.updateAll(deltaTime);
        this.checkCollisions();
    }

    lastTime = 0;
    gameLoop(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        updateState(deltaTime);
        drawElements(deltaTime);
        // drawGrid();
        if (gameOver) {
            gameVelocity = 0;
        } else {
            requestAnimationFrame(gameLoop); // Recursively call gameLoop
        }
    }

    gameOver() {
        // TODO: Handle game-over logic
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

export default Game;