window.addEventListener('load', function () {
  // Canva consfiguration
  const canvas = document.getElementById('mainCanva');
  const drawingContext = canvas.getContext('2d'); // Allow drawing and animation of elements ina HTML canva
  canvas.width = 500;
  canvas.height = 500;

  //TODO implement jump
  // rembember to make jump not floaty 
  // make game remember if player have pressed jump right before touching the ground 
  // and execute jump right after it touches the ground. 
  // pos += vel*t + 1/2*acc*t*t
  // vel += acc*t
})