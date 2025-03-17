// function loadBackground(path) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     // img.src = path;
//     img.src = path + "?t=" + new Date().getTime(); // Cache busting
//     img.onload = () => resolve(img);
//     img.onerror = (err) => reject(err);
//   });
// }

// function makeBackground(context, sprite, pos, scale = 1) {
//   return {
//     width: sprite.width,
//     height: sprite.height,
//     pos,
//     scale,
//     draw() {
//       context.drawImage(
//         sprite,
//         this.pos.x,
//         this.pos.y,
//         this.width * scale,
//         this.height * scale
//       );
//     },
//   };
// }

// function makeLayer(context, sprite, pos, scale = 1) {
//   return {
//     head: makeBackground(context, sprite, pos, scale),
//     tail: makeBackground(context, sprite, {
//       x: Math.round(pos.x + sprite.width * scale),
//       y: pos.y
//     }, scale),
//   };
// }

// function makeInfiniteScroll(deltaTime, layer, speed) {
//   layer.head.pos.x += Math.round(speed * deltaTime);
//   layer.tail.pos.x += Math.round(speed * deltaTime);

//   if (layer.head.pos.x + layer.head.width * layer.head.scale <= 0) {
//     layer.head.pos.x = Math.round(layer.tail.pos.x + layer.tail.width * layer.tail.scale);
//   }

//   if (layer.tail.pos.x + layer.tail.width * layer.tail.scale <= 0) {
//     layer.tail.pos.x = Math.round(layer.head.pos.x + layer.head.width * layer.head.scale);
//   }

//   layer.head.draw();
//   layer.tail.draw();
// }

// const container = document.querySelector(".container");

// new ResizeObserver(() => {
//   document.documentElement.style.setProperty(
//     "--scale",
//     Math.min(
//       container.parentElement.offsetWidth / container.offsetWidth,
//       container.parentElement.offsetHeight / container.offsetHeight
//     )
//   );
// }).observe(container.parentElement);

// // TODO add visual loader while loading files
// // Asset Loading
// const assetManager = {
//   images: {},
//   sounds: {},
//   loadImages: function (imagePaths) {
//     const promises = Object.entries(imagePaths).map(([key, path]) => {
//       return loadBackground(path).then(img => {
//         this.images[key] = img;
//       });
//     });
//     return Promise.all(promises);
//   },
//   loadSounds: function (soundPaths) {
//     const promises = Object.entries(soundPaths).map(([key, path]) => {
//       return new Promise((resolve, reject) => {
//         const audio = new Audio(path);
//         audio.addEventListener('canplaythrough', () => {
//           this.sounds[key] = audio;
//           resolve();
//         });
//         audio.addEventListener('error', (err) => {
//           reject(err);
//         });
//       });
//     });
//     return Promise.all(promises);
//   },
//   getImage: function (key) {
//     return this.images[key];
//   },
//   getSound: function (key) {
//     return this.sounds[key];
//   },
//   // TODO separate audio playing from assetmanager??
//   playSound: function (key) {
//     if (this.sounds[key]) {
//       this.sounds[key].currentTime = 0; // Reset to start
//       this.sounds[key].play();
//     }
//   },
//   stopSound: function (key) {
//     if (this.sounds[key]) {
//       this.sounds[key].pause();
//       this.sounds[key].currentTime = 0;
//     }
//   },
//   playMusic: function (key) {
//     if (this.sounds[key]) {
//       this.sounds[key].loop = true;
//       this.sounds[key].play();
//     }
//   },
//   stopMusic: function (key) {
//     if (this.sounds[key]) {
//       this.sounds[key].pause();
//       this.sounds[key].currentTime = 0;
//     }
//   }
// };

// async function main() {
//   const imagePaths = {
//     layer1: "./assets/images/background/1.Background.png",
//     layer2: "./assets/images/background/2.Trees_back.png",
//     layer3: "./assets/images/background/3.Trees_front.png",
//     layer4: "./assets/images/background/4.Ground.png",
//     playerImage: "./assets/images/characters/slime/Run.png",
//     obstableImage: "./assets/images/characters/warrior/Run.png",
//   };

//   const soundPaths = {
//     jump: "./assets/sounds/slime-jump-1.mp3",
//     // gameOver: "./assets/sounds/game_over.wav",
//     backgroundMusic: "./assets/sounds/slime-song-2.mp3",
//   };

//   try {
//     await Promise.all([
//       assetManager.loadImages(imagePaths),
//       assetManager.loadSounds(soundPaths)
//     ]);
//   } catch (e) {
//     console.error("error loading assets", e);
//     return;
//   }

//   const canvas = document.getElementById('mainCanvas');
//   const context = canvas.getContext('2d');
//   context.imageSmoothingEnabled = false;
//   canvas.width = 480;
//   canvas.height = 270;

//   const iamgeScaleFactor = 2;

//   const firstLayer = makeBackground(context, assetManager.getImage('layer1'), { x: 0, y: -100 }, iamgeScaleFactor);
//   const secondLayer = makeLayer(context, assetManager.getImage('layer2'), { x: 0, y: -100 }, iamgeScaleFactor);
//   const thirdLayer = makeLayer(context, assetManager.getImage('layer3'), { x: 0, y: -100 }, iamgeScaleFactor);
//   const forthLayer = makeLayer(context, assetManager.getImage('layer4'), { x: 0, y: -100 }, iamgeScaleFactor);

//   // Player configuration
//   const playerWidth = 60;
//   const playerHeight = 35;
//   let playerPosition = { x: 50, y: 350 };
//   let playerVelocity = 0;
//   let jumpStrength = 350;
//   let isTouchingGround = false;

//   // Player Sprite config
//   const playerImage = assetManager.getImage('playerImage');
//   const numberOfPlayerSprites = 7;
//   const playerSpriteMaxHeight = playerImage.height;
//   const playerSpriteMaxWidth = playerImage.width / numberOfPlayerSprites;
//   const playerSpriteHeight = 35;
//   const playerSpriteWidth = 60;
//   const playerSpriteX = 0;
//   const playerSprite = 0;

//   let gravity = 500;
//   let keys = {};

//   let gameInitialVelocity = 0.2;
//   let gameVelocity = gameInitialVelocity;

//   let score = 0;

//   let gameOver = false;

//   function inputHandler() {
//     window.addEventListener('keydown', function (event) {
//       if ((event.key === 'r' || event.key === 'R') && gameOver) {
//         restartGame();
//       }
//     });

//     window.addEventListener('keydown', function (event) {
//       keys[event.key] = true;
//     });

//     window.addEventListener('keyup', function (event) {
//       keys[event.key] = false;
//     });

//     // window.addEventListener('mousedown', function (event) {
//     //   keys['click'] = true;
//     // });

//     // window.addEventListener('mouseup', function (event) {
//     //   keys['click'] = false;
//     // });

//     canvas.addEventListener('touchstart', (event) => {
//       event.preventDefault();
//       keys['touch'] = true;
//       if (gameOver) {
//         restartGame();
//       }
//     });

//     canvas.addEventListener('touchend', (event) => {
//       event.preventDefault();
//       keys['touch'] = false;
//     });
//   }

//   const bottomLine = canvas.height - playerHeight - 90;

//   function updateState(deltaTime) {
//     // apply dynamics
//     deltaTime /= 1000; // Convert to seconds

//     playerPosition.y += playerVelocity * deltaTime + 0.5 * gravity * deltaTime * deltaTime;
//     playerVelocity += gravity * deltaTime;

//     // lower boundary
//     if (playerPosition.y > (bottomLine)) {
//       playerPosition.y = bottomLine;
//       isTouchingGround = true;
//       playerVelocity = 0;
//     }
//     // upper boundary
//     if (playerPosition.y < 0) {
//       playerPosition.y = 0;
//     }

//     if (keys['ArrowUp'] || keys[' '] || keys['click'] || keys['Enter'] || keys['touch']) {
//       jump();
//     }

//     checkCollision();

//     updateObstacles(deltaTime);
//   }

//   function jump() {
//     if (isTouchingGround) {
//       playerVelocity = -jumpStrength;
//       isTouchingGround = false;
//       // jump sound
//     }
//   }

//   function checkCollision() {
//     obstacles.forEach((obstacle) => {
//       if (
//         playerPosition.x + playerWidth >= obstacle.x &&
//         playerPosition.x <= obstacle.x + obstacleWidth &&
//         playerPosition.y + playerHeight >= obstacle.y &&
//         playerPosition.y <= obstacle.y + obstacleHeight
//       ) {
//         gameOver = true;
//         // audio.stopMusic();
//       }
//     });
//   }

//   // Obstacle configuration
//   const obstacleWidth = 50;
//   const obstacleHeight = 50;
//   const obstableInterval = 5;
//   const obstacleVelocity = gameVelocity * 1000;
//   let timeElapsedObstacle = 0;
//   let obstacles = [];

//   function generateObstacle() {
//     const obstaclePosition = { x: canvas.width, y: canvas.height - obstacleHeight - 90 };
//     obstacles.push(obstaclePosition);
//   }

//   function updateObstacles(deltaTime) {
//     timeElapsedObstacle += deltaTime;
//     if (timeElapsedObstacle >= obstableInterval) {
//       generateObstacle();
//       timeElapsedObstacle = 0;
//     }

//     obstacles.forEach((obstacle, index) => {
//       obstacle.x -= obstacleVelocity * deltaTime;
//       if (obstacle.x < -obstacleWidth) {
//         obstacles.splice(index, 1); // Remove obstacle if it moves off the screen
//         score++;
//       }
//     });
//   }

//   function drawObstacles() {
//     context.fillStyle = 'red';
//     obstacles.forEach(obstacle => {
//       context.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
//     });
//   }

//   function drawText() {
//     // context.fillStyle = "#009FA8";
//     context.fillStyle = "red";
//     context.textAlign = "left";
//     context.font = "16px Bangers, Arial";
//     context.fillText("Score: ", 10, 20);
//     context.fillText(score, 55, 20);

//     if (gameOver) {
//       // context.fillStyle = "#009FA8";
//       context.textAlign = "center";
//       context.fillStyle = "red";
//       context.font = "42px Bangers, Arial";
//       context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
//       context.font = "16px Bangers, Arial";
//       context.fillText("Press 'R' or touch to restart", canvas.width / 2, canvas.height / 2 + 20);
//     }
//   }

//   function drawElements(deltaTime) {
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     // Background draw
//     firstLayer.draw();
//     makeInfiniteScroll(deltaTime, secondLayer, -gameVelocity / 4); // 0.05
//     makeInfiniteScroll(deltaTime, thirdLayer, -gameVelocity / 2); // 0.1
//     makeInfiniteScroll(deltaTime, forthLayer, -gameVelocity); // 0.2

//     // Player draw
//     context.fillStyle = 'blue';
//     context.fillRect(playerPosition.x, playerPosition.y, playerWidth, playerHeight);
//     context.drawImage(
//       playerImage,
//       26,
//       93,
//       playerSpriteWidth,
//       playerSpriteHeight,
//       playerPosition.x,
//       playerPosition.y,
//       playerSpriteWidth,
//       playerSpriteHeight
//     );

//     drawObstacles();

//     drawText();

//     // //! Debug purposes
//     // if (isTouchingGround) {
//     // context.fillStyle = "black";
//     // context.font = "14px Bangers, Arial";
//     //   context.fillText("On Ground", playerPosition.x, playerPosition.y - 10);
//     // }

//     // //! Debug purposes
//     // context.fillText("Vel", 400, 300);
//     // context.fillText(Math.round(playerVelocity), 400, 315);
//   }

//   // //! For debbuging purposes (Remove later)
//   // function drawGrid() {
//   //   context.strokeStyle = '#e0e0e0';
//   //   context.lineWidth = 1;

//   //   for (let x = 0; x <= canvas.width; x = x + 25) {
//   //     context.beginPath();
//   //     context.moveTo(x, 0);
//   //     context.lineTo(x, canvas.height);
//   //     context.stroke();
//   //     context.fillText(x, x, 10);
//   //   }

//   //   for (let y = 0; y <= canvas.height; y = y + 25) {
//   //     context.beginPath();
//   //     context.moveTo(0, y);
//   //     context.lineTo(canvas.width, y);
//   //     context.stroke();
//   //     context.fillText(y, 0, y + 10);
//   //   }
//   // }

//   function restartGame() {
//     playerPosition = { x: 50, y: 350 };
//     playerVelocity = 0;
//     isTouchingGround = false;
//     gameVelocity = gameInitialVelocity;
//     score = 0;
//     gameOver = false;
//     obstacles = [];
//     // play music
//     gameLoop(performance.now());
//   }

//   let lastTime = 0;
//   function gameLoop(timeStamp) {
//     const deltaTime = timeStamp - lastTime;
//     lastTime = timeStamp;
//     updateState(deltaTime);
//     drawElements(deltaTime);
//     // drawGrid();
//     if (gameOver) {
//       gameVelocity = 0;
//     } else {
//       requestAnimationFrame(gameLoop); // Recursively call gameLoop
//     }
//   }

//   inputHandler();
//   gameLoop(0);
// }

// main();

import { CollisionSystem } from "systems/collision.js"
import { AnimationSystem } from "systems/animation.js"
import { AssetManager } from "systems/asset-manager.js"
import { AudioManager } from "systems/audio-manager.js"
import { UIManager } from "ui/ui-manager.js"

// Main controller
class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.entities = [];
    this.lastTime = 0;
    this.gameState = 'menu'; // menu, playing, paused, gameOver
    this.score = 0;
    // this.highScore = parseInt(localStorage.getItem('highScore') || 0);
    
    // Systems
    this.collisionSystem = new CollisionSystem(this);
    this.animationSystem = new AnimationSystem();
    this.assetManager = new AssetManager();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(this);
    
    // Events
    this.setupEventListeners();
    
    // Load assets
    this.loadAssets();
  }
  
  loadAssets() {
    return this.assetManager.loadAll([
      { type: 'image', id: 'player', src: 'assets/images/XXXXXXXXXXXX.png' },
      { type: 'image', id: 'enemy', src: 'assets/images/XXXXXXXXXXXX.png' },
      { type: 'image', id: 'background1', src: 'assets/images/XXXXXXXXXXXX.png' },
      { type: 'image', id: 'background2', src: 'assets/images/XXXXXXXXXXXX.png' },
      { type: 'image', id: 'background3', src: 'assets/images/XXXXXXXXXXXX.png' },
      { type: 'audio', id: 'bgMusic', src: 'assets/audio/XXXXXXXXXXXX.mp3' },
      { type: 'audio', id: 'jump', src: 'assets/audio/XXXXXXXXXXXX.wav' },
      { type: 'audio', id: 'collision', src: 'assets/audio/XXXXXXXXXXXX.wav' }
    ]).then(() => {
      this.init();
    });
  }
  
  init() {
    // Create game objects
    this.background = new ParallaxBackground(this);
    this.player = new Player(this, 100, this.canvas.height - 150);
    this.entities.push(this.player);
    
    // Start game loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (this.gameState === 'menu' && e.code === 'Space') {
        this.startGame();
      } else if (this.gameState === 'playing') {
        if (e.code === 'Space') {
          this.player.jump();
        } else if (e.code === 'Escape') {
          this.togglePause();
        }
      } else if (this.gameState === 'paused' && e.code === 'Escape') {
        this.togglePause();
      } else if (this.gameState === 'gameOver' && e.code === 'Space') {
        this.restart();
      }
    });
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', () => {
      if (this.gameState === 'menu') {
        this.startGame();
      } else if (this.gameState === 'playing') {
        this.player.jump();
      } else if (this.gameState === 'gameOver') {
        this.restart();
      }
    });
  }
  
  startGame() {
    this.gameState = 'playing';
    this.score = 0;
    this.audioManager.play('bgMusic', { loop: true });
    this.spawnEnemies();
  }
  
  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      this.audioManager.pause('bgMusic');
    } else {
      this.gameState = 'playing';
      this.audioManager.resume('bgMusic');
    }
  }
  
  gameOver() {
    this.gameState = 'gameOver';
    this.audioManager.stop('bgMusic');
    this.audioManager.play('collision');
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
    }
  }
  
  restart() {
    // Clear all entities except player
    this.entities = this.entities.filter(entity => entity instanceof Player);
    
    // Reset player
    this.player.reset();
    
    // Start game
    this.startGame();
  }
  
  spawnEnemies() {
    if (this.gameState !== 'playing') return;
    
    // Create a random enemy
    const enemy = new Enemy(
      this,
      this.canvas.width + 50,
      this.canvas.height - 100 - Math.random() * 50
    );
    
    this.entities.push(enemy);
    
    // Schedule next spawn
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => this.spawnEnemies(), delay);
  }
  
  update(deltaTime) {
    if (this.gameState !== 'playing') return;
    
    // Update all entities
    this.entities.forEach(entity => entity.update(deltaTime));
    
    // Clean up entities that are marked for removal
    this.entities = this.entities.filter(entity => !entity.markedForRemoval);
    
    // Check collisions
    this.collisionSystem.checkCollisions();
    
    // Update background
    this.background.update(deltaTime);
    
    // Update score
    this.score += deltaTime * 0.01;
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.background.draw(this.ctx);
    
    // Draw all entities
    this.entities.forEach(entity => entity.draw(this.ctx));
    
    // Draw UI based on game state
    this.uiManager.draw();
  }
  
  gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    // Update and render
    this.update(deltaTime);
    this.render();
    
    // Continue the loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}