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
        if((event.key === 'ArrowUp') && this.game.keys.indexOf(event.key) === -1) {
          this.game.keys.push(event.key);
        }
      });

      window.addEventListener('keyup', event => {
        if(this.game.keys.indexOf(event.key) > -1) {
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
      this.x = 20;
      this.y = 200;
      this.speedY = 1;
    }

    update() {
      this.y += this.speedY;
      if(this.game.keys.includes('ArrowUp')) {
        this.speedY = -10; //TODO implement jump
      }
    }

    // "context" instead of "drawingContext" because we can draw the player on another canvas other than the main one
    draw(context) {
      context.fillRect(this.x, this.y, this.width, this.height)
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
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.InputHandler = new InputHandler(this);
      this.keys = [];
    }

    update(){
      this.player.update();
    }

    draw(context){
      this.player.draw(context);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  
  function animate() {
    drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(drawingContext);
    requestAnimationFrame(animate); // Endless loop bacause I am passing the parent
  }

  animate();
})