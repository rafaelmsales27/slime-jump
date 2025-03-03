import { loadSprite, makeSprite, makeLayer, makeInfiniteScroll } from "./utils.js";

const container = document.querySelector(".container");

new ResizeObserver(() => {
  document.documentElement.style.setProperty(
    "--scale",
    Math.min(
      container.parentElement.offsetWidth / container.offsetWidth,
      container.parentElement.offsetHeight / container.offsetHeight
    )
  );
}).observe(container.parentElement);

async function main() {
  const [layer1, layer2, layer3, layer4] = await Promise.all([
    loadSprite("./assets/images/background/1.Background.png"),
    loadSprite("./assets/images/background/2.Trees_back.png"),
    loadSprite("./assets/images/background/3.Trees_front.png"),
    loadSprite("./assets/images/background/4.Ground.png")
  ]);

  const canvas = document.getElementById('mainCanvas');
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  canvas.width = 480;
  canvas.height = 270;

  const iamgeScaleFactor = 2;

  const firstLayer = makeSprite(context, layer1, { x: 0, y: -100 }, iamgeScaleFactor);
  const secondLayer = makeLayer(context, layer2, { x: 0, y: -100 }, iamgeScaleFactor);
  const thirdLayer = makeLayer(context, layer3, { x: 0, y: -100 }, iamgeScaleFactor);
  const forthLayer = makeLayer(context, layer4, { x: 0, y: -100 }, iamgeScaleFactor);

  // Player configuration
  const playerWidth = 50;
  const playerHeight = 50;
  let playerPosition = { x: 50, y: 350 };
  let playerVelocity = 0;
  let jumpStrength = 350;
  let isTouchingGround = false;

  let gravity = 500;
  let keys = {};

  let howManyJumps = 0;

  function inputHandler() {
    window.addEventListener('keydown', function (event) {
      keys[event.key] = true;
    });

    window.addEventListener('keyup', function (event) {
      keys[event.key] = false;
    });

    window.addEventListener('mousedown', function (event) {
      keys['click'] = true;
    });

    window.addEventListener('mouseup', function (event) {
      keys['click'] = false;
    });
  }

  const bottomLine = canvas.height - playerHeight - 90;

  function updateState(deltaTime) {
    // apply dynamics
    deltaTime /= 1000; // Convert to seconds

    playerPosition.y += playerVelocity * deltaTime + 0.5 * gravity * deltaTime * deltaTime;
    playerVelocity += gravity * deltaTime;

    // lower boundary
    if (playerPosition.y > (bottomLine)) {
      playerPosition.y = bottomLine;
      isTouchingGround = true;
      playerVelocity = 0;
    }
    // upper boundary
    if (playerPosition.y < 0) {
      playerPosition.y = 0;
    }

    if (keys['ArrowUp'] || keys[' '] || keys['click'] || keys['Enter']) {
      jump();
    }

    updateObstacles(deltaTime);
  }

  function jump() {
    if (isTouchingGround) {
      playerVelocity = -jumpStrength;
      isTouchingGround = false;
      howManyJumps++;
    }
  }

  // Obstacle configuration
  const obstacleWidth = 50;
  const obstacleHeight = 50;
  const obstableInterval = 5;
  const obstacleVelocity = 150;
  let timeElapsedObstacle = 0;
  let obstacles = [];

  function generateObstacle() {
    const obstaclePosition = { x: canvas.width, y: canvas.height - bottomLine};
    obstacles.push(obstaclePosition);
  }

  function updateObstacles(deltaTime) {
    timeElapsedObstacle += deltaTime;
    if (timeElapsedObstacle >= obstableInterval) {
      generateObstacle();
      timeElapsedObstacle = 0;
    }

    obstacles.forEach((obstacle, index) => {
      obstacle.x -= obstacleVelocity * deltaTime;
      if (obstacle.x < -obstacleWidth) {
        obstacles.splice(index, 1); // Remove obstacle if it moves off the screen
      }
    });
  }

  function drawObstacles() {
    context.fillStyle = 'red';
    obstacles.forEach(obstacle => {
      context.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
  }

  function drawElements(deltaTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Background draw
    firstLayer.draw();
    makeInfiniteScroll(deltaTime, secondLayer, -0.1);
    makeInfiniteScroll(deltaTime, thirdLayer, -0.25);
    makeInfiniteScroll(deltaTime, forthLayer, -0.4);

    // Player draw
    context.fillStyle = 'blue';
    context.fillRect(playerPosition.x, playerPosition.y, playerWidth, playerHeight);

    drawObstacles();

    // //! Debug purposes
    // if (isTouchingGround) {
    context.fillStyle = "black";
    context.font = "14px Arial";
    //   context.fillText("On Ground", playerPosition.x, playerPosition.y - 10);
    // }

    // //! Debug purposes
    // context.fillText("Vel", 400, 300);
    // context.fillText(Math.round(playerVelocity), 400, 315);
  }

  // //! For debbuging purposes (Remove later)
  // function drawGrid() {
  //   context.strokeStyle = '#e0e0e0';
  //   context.lineWidth = 1;

  //   for (let x = 0; x <= canvas.width; x = x + 25) {
  //     context.beginPath();
  //     context.moveTo(x, 0);
  //     context.lineTo(x, canvas.height);
  //     context.stroke();
  //     context.fillText(x, x, 10);
  //   }

  //   for (let y = 0; y <= canvas.height; y = y + 25) {
  //     context.beginPath();
  //     context.moveTo(0, y);
  //     context.lineTo(canvas.width, y);
  //     context.stroke();
  //     context.fillText(y, 0, y + 10);
  //   }
  // }

  let lastTime = 0;
  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    updateState(deltaTime);
    drawElements(deltaTime);
    // drawGrid();
    requestAnimationFrame(gameLoop); // Recursively call gameLoop
  }

  inputHandler();
  gameLoop(0);
}

main();