window.addEventListener('load', function () {
  // Canva consfiguration
  const canvas = document.getElementById('mainCanvas');
  const context = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;

  // Player configuration
  const playerWidth = 100;
  const playerHeight = 50;
  let playerPosition = { x: 50, y: 350 };
  let playerVelocity = 0;
  let gravity = 200;
  let jumpStrength = 500;
  let isTouchingGround = false;
  let keys = {};

  function inputHandler() {
    window.addEventListener('keydown', function (event) {
      keys[event.key] = true;
    });

    window.addEventListener('keyup', function (event) {
      keys[event.key] = false;
    });
  }

  const bottomLine = canvas.height - playerHeight;

  function updateState(deltaTime) {
    // apply dynamics (gravity)
    deltaTime /= 1000; // Convert to seconds
    playerPosition.y += playerVelocity * deltaTime + 0.5 * gravity * deltaTime * deltaTime;
    playerVelocity += gravity * deltaTime;

    // lower boundry
    if (playerPosition.y > (bottomLine)){
      playerPosition.y = bottomLine;
      isTouchingGround = true;
    }
    // upper boundry
    if (playerPosition.y < 0){
      playerPosition.y = 0;
    }

    if (keys['ArrowUp']) {
      jump();
    }
  }

  function jump() {    
    //TODO implement jump
    // rembember to make jump not floaty 
    // make game remember if player have pressed jump right before touching the ground 
    // and execute jump right after it touches the ground. 
    // pos += vel*t + 1/2*acc*t*t
    // vel += acc*t
    if(isTouchingGround) {
      playerVelocity -= jumpStrength;
      isTouchingGround = false;
    }
  }

  function drawElements() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'blue';
    context.fillRect(playerPosition.x, playerPosition.y, playerWidth, playerHeight)
    //! Debug purposes
    if (isTouchingGround) {
      context.fillStyle = "black";
      context.font = "14px Arial";
      context.fillText("On Ground", playerPosition.x, playerPosition.y - 10);
    }
  }

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

  // function reScaleScreen(){
  //   window.addEventListener('resize', function(event){
  //     canvas.width = event.currentTarget.innerWidth;
  //     canvas.height = event.currentTarget.innerHeight;
  //   });
  // }

  let lastTime = 0;
  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // reScaleScreen();
    inputHandler();
    updateState(deltaTime);
    drawElements();
    drawGrid();
    requestAnimationFrame(gameLoop); // Recursively call gameLoop
  }
  gameLoop(0);
})