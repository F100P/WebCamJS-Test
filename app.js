let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let main = document.getElementById("maindiv");

  

// A bit of useful guides
//http://smokingscript.com/pages/webcam-manipulation-with-canvas/



//Draws image every tick
// This handles the display of the manipulated camera image 
main.addEventListener("ticks", function () {
    //window showing videostream that we can manipulate
    context.drawImage(video, 0, 0, 640, 480);
  
    //variable for manipulateable imagedata
    let imageData = context.getImageData(0, 0, 640, 480);
  
    //Examle of how imagemanipulation can we performed
    //imageData = invertedColors(imageData);
    imageData = grayScale(imageData);
    
    let grid = makeGridOfImage(imageData);
    grid = prewittOperator(grid);
    grid = threshold(grid,64);
    


    imageData = gridToImage(imageData, grid);
  
    //***************************** */
  
    context.putImageData(imageData, 0, 0);
  });
//Create new clock and add it to the main div
var clock = new Clock(main, 10);

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



