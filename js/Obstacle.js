export class Obstacle {
    constructor(width, height, obstableInterval) {
        this.x;
        this.y;
        this.width = width;
        this.height = height;
        this.obstableInterval = obstableInterval;
        this.timeElapsedObstacle = 0;
        this.obstacles = [];
    }

    generate() {
        const obstaclePosition = { x: canvas.width, y: canvas.height - this.height - 85 };
        this.obstacles.push(obstaclePosition);
    }

    update(deltaTime) {
        this.timeElapsedObstacle += deltaTime;
        if (this.timeElapsedObstacle >= this.obstableInterval) {
            generateObstacle();
            this.timeElapsedObstacle = 0;
        }

        this.obstacles.forEach((obstacle, index) => {
            this.x -= obstacleVelocity * deltaTime;
            if (this.x < -this.width) {
                this.obstacles.splice(index, 1); // Remove obstacle if it moves off the screen
                score++;
            }
        });
    }

    draw(context) {
        context.fillStyle = 'red';
        this.obstacles.forEach(obstacle => {
            context.fillRect(this.x, this.y, this.width, this.height);
            // TODO Import obstacle animation
            // obstacleAnimation.draw(context, this.x - this.width - 10, this.y - this.height);
        });
    }
}