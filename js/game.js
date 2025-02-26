window.addEventListener('load', function () {
  // Canva consfiguration
  const canvas = document.getElementById('mainCanva');
  const drawingContext = canvas.getContext('2d'); // Allow drawing and animation of elements ina HTML canva
  canvas.width = 500;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener('keydown', event => {
        if ((event.key === 'ArrowUp' || event.key === ' ') && this.game.keys.indexOf(event.key) === -1) {
          this.game.keys.push(event.key);
        }
      });

      window.addEventListener('keyup', event => {
        if (this.game.keys.indexOf(event.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(event.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 47 * 2;
      this.height = 32 * 2;
      this.positionX = 20;
      this.positionY = 200;
      this.gravity = 1;
      this.onGround = false;
    }

    update() {
      this.positionY += this.gravity;

      if (this.positionY > (canvas.height - this.height) - 100) {
        this.positionY = canvas.height - this.height - 100;
        this.velocityY = 0.0;
        this.onGround = true;
      }

      if (this.positionY < 0) {
        this.positionY = 0;
        this.gravity = 1; // Reset gravity to fall down
      }

      if (this.game.keys.includes('ArrowUp') || this.game.keys.includes(' ')) {
        this.gravity = -2;
        //TODO implement jump
        // rembember to make jump not floaty 
        // make game remember if player have pressed jump right before touching the ground 
        // and execute jump right after it touches the ground. 
        // pos += vel*t + 1/2*acc*t*t
        // vel += acc*t
      }
    }

    // "context" instead of "drawingContext" because we can draw the player on another canvas other than the main one
    draw(context) {
      context.fillRect(this.positionX, this.positionY, this.width, this.height)
    }
  }

  class Obstacles {

  }

  class Layer {

  }

  class Background {

  }

  class UI {

  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.InputHandler = new InputHandler(this);
      this.keys = [];
    }

    update() {
      this.player.update();
    }

    draw(context) {
      this.player.draw(context);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    game.update(lastTime);
    game.draw(drawingContext);
    requestAnimationFrame(animate); // Endless loop bacause I am passing the parent
  }

  animate(0);
})