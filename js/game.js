window.addEventListener('load', function () {
  // Canva consfiguration
  const canvas = document.getElementById('mainCanva');
  const context = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;

  // Player configuration
  const playerWidth = 100;
  const playerHeight = 50;
  let playerPosition = { x: 50, y: 50 };
  let playerVelocity = 0;
  let playerAcceleration = 0;

  let keys = {};

  function inputHandler() {
    window.addEventListener('keydown', function (event) {
      keys[event.key] = true;
    });

    window.addEventListener('keyup', function (event) {
      keys[event.key] = false;
    });
  }

  function updateState(deltaTime) {
    if(keys['ArrowDown']) {
      playerPosition.y += 1;
    }
  }

  function drawElements() {
    context.fillRect(playerPosition.x, playerPosition.y, playerWidth, playerHeight)
  }

  function jump(t) {
    playerPosition.y += playerVelocity * t + 1 / 2 * playerAcceleration * t * t;
    playerVelocity += playerAcceleration * t;
  }
  //TODO implement jump
  // rembember to make jump not floaty 
  // make game remember if player have pressed jump right before touching the ground 
  // and execute jump right after it touches the ground. 
  // pos += vel*t + 1/2*acc*t*t
  // vel += acc*t

  //! For debbuging purposes (Remove later)
  function drawGrid() {
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x = x + 25) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
      context.fillText(x, x, 10);
    }

    for (let y = 0; y <= canvas.height; y = y + 25) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
      context.fillText(y, 0, y + 10);
    }
  }

  let lastTime = 0;
  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    inputHandler();
    updateState(deltaTime);
    drawElements();
    drawGrid();
    requestAnimationFrame(gameLoop); // Recursively call gameLoop
  }
  gameLoop(0);
})