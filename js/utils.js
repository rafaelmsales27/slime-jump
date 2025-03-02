export function loadSprite(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // img.src = path;
        img.src = path + "?t=" + new Date().getTime(); // Cache busting
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}

export function makeSprite(context, sprite, pos, scale = 1) {
    return {
        width: sprite.width,
        height: sprite.height,
        pos,
        scale,
        draw() {
            context.drawImage(
                sprite,
                this.pos.x,
                this.pos.y,
                this.width * scale,
                this.height * scale
            );
        },
    };
}

export function makeLayer(context, sprite, pos, scale = 1) {
    return {
        head: makeSprite(context, sprite, pos, scale),
        tail: makeSprite(context, sprite, { x: pos.x + sprite.width * scale, y: pos.y }, scale),
    };
}

export function makeInfiniteScroll(deltaTime, layer, speed) {
    layer.head.pos.x += speed * deltaTime;
    layer.tail.pos.x += speed * deltaTime;

    if (layer.head.pos.x + layer.head.width * layer.head.scale <= 0) {
        layer.head.pos.x = layer.tail.pos.x + layer.tail.width * layer.tail.scale;
    }

    if (layer.tail.pos.x + layer.tail.width * layer.tail.scale <= 0) {
        layer.tail.pos.x = layer.head.pos.x + layer.head.width * layer.head.scale;
    }

    layer.head.draw();
    layer.tail.draw();
}