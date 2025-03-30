class Player {

    constructor(x, y, width, height, velocity, jumpStrength) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.jumpStrength = jumpStrength;
        this.isTouchingGround = false;
    }

    update(deltaTime) {
        // Dynamics
        const GRAVITY = 500;
        this.y += this.velocity * deltaTime + 0.5 * GRAVITY * deltaTime * deltaTime;
        this.velocity += GRAVITY * deltaTime;

        // lower boundary
        if (this.y > (bottomLine)) {
            this.y = bottomLine;
            isTouchingGround = true;
            this.velocity = 0;
        }
        // upper boundary
        if (this.y < 0) {
            this.y = 0;
        }

        if (keys['ArrowUp'] || keys[' '] || keys['click'] || keys['Enter'] || keys['touch']) {
            jump();
        }
        checkCollision();
    }

    draw(context) {
        context.fillStyle = 'blue';
        context.fillRect(this.x, this.y, this.width, this.height);
        // TODO Import player animation
        // playerAnimation.draw(context, this.x - this.width / 2, this.y - this.height - bottomLine + 90);
    }

    jump() {
        if (isTouchingGround) {
            this.velocity = -jumpStrength;
            isTouchingGround = false;
            // jump sound
        }
    }
}