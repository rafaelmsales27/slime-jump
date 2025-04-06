class ParallaxLayer {
    constructor(context, sprite, initialX, scale = 1, speed = 0) {
        this.ctx = context;
        this.sprite = sprite;
        this.scale = scale;
        this.speed = speed;
        this.width = sprite.width * scale;
        this.height = sprite.height * scale;

        // Create two background instances for seamless looping
        this.head = {
            x: initialX,
            y: 0,
            width: this.width,
            height: this.height
        };

        this.tail = {
            x: initialX + this.width,
            y: 0,
            width: this.width,
            height: this.height
        };
    }

    update(deltaTime) {
        const offset = Math.round(this.speed * deltaTime);
        this.head.x += offset;
        this.tail.x += offset;

        // Wrap positions when out of view
        if (this.head.x + this.width <= 0) {
            this.head.x = this.tail.x + this.width;
        }
        if (this.tail.x + this.width <= 0) {
            this.tail.x = this.head.x + this.width;
        }
    }

    draw() {
        // Draw head
        this.ctx.drawImage(
            this.sprite,
            this.head.x,
            this.head.y,
            this.width,
            this.height
        );

        // Draw tail
        this.ctx.drawImage(
            this.sprite,
            this.tail.x,
            this.tail.y,
            this.width,
            this.height
        );
    }
}

export class ParallaxBackground {
    constructor(context) {
        this.context = context;
        this.layers = [];
    }

    addLayer(sprite, initialX, scale = 1, speed = 0) {
        const layer = new ParallaxLayer(
            this.context,
            sprite,
            initialX,
            scale,
            speed
        );
        this.layers.push(layer);
    }

    updateAll(deltaTime) {
        this.layers.forEach(layer => layer.update(deltaTime));
    }

    drawAll() {
        this.layers.forEach(layer => layer.draw());
    }
}