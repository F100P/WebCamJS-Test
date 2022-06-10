let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let main = document.getElementById("maindiv");
let buttonCanvas = document.querySelector("#buttonCanvas");
let buttonContext = buttonCanvas.getContext("2d");
let displayRunTime = document.querySelector("#runtime")
let prevCanvas = document.querySelector("#prevCanvas");
let prevContext = prevCanvas.getContext("2d");
let runTime = 0;
let displayScore = document.querySelector("#score");
let score = 0;
//Draws image every tick
// This handles the display of the manipulated camera image
main.addEventListener("ticks", function () {
  runTime++;
  
  displayRunTime.innerHTML = "Time Running: " + runTime;
  let prevImgData = prevContext.getImageData(0, 0, 640, 480);
  let prevGrid = makeGridOfImage(prevImgData);

  //prevContext.putImageData(prevImgData, 0, 0);

  context.drawImage(video, 0, 0, 640, 480);
  //variable for manipulateable imagedata
  let imageData = context.getImageData(0, 0, 640, 480);

  //Examle of how imagemanipulation can we performed
  //imageData = invertedColors(imageData);
  imageData = grayScale(imageData);

  let grid = makeGridOfImage(imageData);
  grid = prewittOperator(grid);
  grid = binarize(grid, 50);

  prevContext.putImageData(gridToImage(imageData, grid), 0, 0);
  //grid = removeLonelyPixels(grid);
  grid = removeStationary(grid, prevGrid);
  grid = openingOperation(grid);
  imageData = gridToImage(imageData, grid);

  //check if interact with blue test box
  if(runTime >= 100){
  checkAllZones(grid);
   } //console.log("YOU FUCKING MADE IT DUDE");

  //***************************** */

  context.putImageData(imageData, 0, 0);
});

//kommer inte fungera... koppla zonerna till specifika funktioner....
function checkAllZones(grid) {
  for (key in choordsToCheck){
    //console.log(element)
    checkInteraktion(
      grid,
      choordsToCheck[key],
      50,
    
    );
  };
}

//Create new clock and add it to the main div
var clock = new Clock(main, 10);

//lägg till i createbox så att varje låda som skapas får ett motsvarande område för rörelsedetektion
var choordsToCheck = {};

function createBox(ctx, coordinates, text) {
  ctx.beginPath();
  choordsToCheck[coordinates[4]] = coordinates;

  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#abc";
  ctx.rect(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
  buttonContext.fill();
  ctx.font = "20px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(
    text,
    coordinates[0] + coordinates[2] / 2,
    coordinates[1] + coordinates[3] / 2
  );
}
//createBox(buttonContext, [0, 0, 150, 100, "test"], "test");
createBox(buttonContext, [0, 380, 150, 100, "Start"], "hjelp");
console.log(choordsToCheck);

//Initialize blue button to indicate test touch area...

//initiates the webcamera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });
}

//Gives starting content of manipulation field. Also starts the clock
document.getElementById("start").addEventListener("click", () => {
  context.drawImage(video, 0, 0, 640, 480);
  clock.start();
});

//append clock stop to the stop button
document.getElementById("stop").addEventListener("click", () => {
  clock.stop();
});

function displayPerwitt() {
  context.drawImage(video, 0, 0, 640, 480);

  //variable for manipulateable imagedata
  let imageData = context.getImageData(0, 0, 640, 480);

  //Examle of how imagemanipulation can we performed
  //imageData = invertedColors(imageData);
  imageData = grayScale(imageData);

  let grid = makeGridOfImage(imageData);
  grid = prewittOperator(grid);

  imageData = gridToImage(imageData, grid);

  //***************************** */

  context.putImageData(imageData, 0, 0);
}

function movementDetection() {
  let prevImgData = prevContext.getImageData(0, 0, 640, 480);
  let prevGrid = makeGridOfImage(prevImgData);
  //prevContext.putImageData(prevImgData, 0, 0);

  context.drawImage(video, 0, 0, 640, 480);
  //variable for manipulateable imagedata
  let imageData = context.getImageData(0, 0, 640, 480);

  //first grayscale
  imageData = grayScale(imageData);

  let grid = makeGridOfImage(imageData);
  //prewitt to edgedetect
  grid = prewittOperator(grid);
  //Binary since better safe than sorry
  grid = binarize(grid, 40);

  //Save the original for next previous
  prevContext.putImageData(gridToImage(imageData, grid), 0, 0);

  //smooth out the img
  grid = removeStationary(grid, prevGrid);
  grid = openingOperation(grid);
  imageData = gridToImage(imageData, grid);

  //***************************** */

  context.putImageData(imageData, 0, 0);
}
