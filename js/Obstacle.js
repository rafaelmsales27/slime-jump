class Obstacle {
    static obstacles = [];
    timeElapsedObstacle;

    constructor(width, height, obstableInterval) {
        this.x;
        this.y;
        this.width = width;
        this.height = height;
        this.obstableInterval = obstableInterval;
    }

    generateObstacle() {
        const obstaclePosition = { x: canvas.width, y: canvas.height - this.height - 85 };
        obstacles.push(obstaclePosition);
    }

    updateObstacles(deltaTime) {
        timeElapsedObstacle += deltaTime;
        if (timeElapsedObstacle >= this.obstableInterval) {
            generateObstacle();
            timeElapsedObstacle = 0;
        }

        obstacles.forEach((obstacle, index) => {
            this.x -= obstacleVelocity * deltaTime;
            if (this.x < -this.width) {
                obstacles.splice(index, 1); // Remove obstacle if it moves off the screen
                score++;
            }
        });
    }

    drawObstacles(context) {
        context.fillStyle = 'red';
        obstacles.forEach(obstacle => {
            context.fillRect(this.x, this.y, this.width, this.height);
            // TODO Import obstacle animation
            // obstacleAnimation.draw(context, this.x - this.width - 10, this.y - this.height);
        });
    }
}