class SpriteAnimation {
    constructor(sprite, frameWidth, frameHeight, frameCount, animationSpeed) {
        this.sprite = sprite;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.animationSpeed = animationSpeed;
        this.currentFrame = 0;
        this.elapsedTime = 0;
    }

    // update(deltaTime) {
    //   this.elapsedTime += deltaTime;
    //   if (this.elapsedTime >= this.animationSpeed) {
    //     this.elapsedTime = 0;
    //     this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    //     console.log(this.currentFrame);
    //   }
    // }

    update(deltaTime) {
        // console.log(`Received deltaTime: ${deltaTime}ms`); 
        this.elapsedTime += deltaTime;
        // console.log(`Elapsed time: ${this.elapsedTime}/${this.animationSpeed}`); 

        if (this.elapsedTime >= this.animationSpeed) {
            // console.log("Updating frame"); 
            this.elapsedTime -= this.animationSpeed;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
    }


    draw(context, x, y, scale = 1) {
        // console.log('Drawing sprite at:', x, y); 
        // console.log('Current frame:', this.currentFrame);
        // console.log('Sprite dimensions:', this.frameWidth, this.frameHeight);

        const frameX = this.currentFrame * this.frameWidth;
        const frameY = 0; // assuming all frames are on the same row
        context.drawImage(
            this.sprite,
            frameX,
            frameY,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth * scale,
            this.frameHeight * scale
        );
    }
}

export default SpriteAnimation;