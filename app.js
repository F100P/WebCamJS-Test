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
    grid = highPassFilter(grid);

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



//*************FUNCTIONS*************** */
//Small test function to see if the generated grid Works as intended
function stripes(){

    let output = [];
      let counter = 0;
  
    let currentRow = [];
    for (let j = 0; j < 480 ; j ++) {
      for (let i = 0; i < 640 ; i ++) {
        if(counter<=9){
            currentRow.push(0);
        }
        else(currentRow.push(255));
        counter++;
        if(counter >=20){
            counter = 0;
        }
      }
      output.push(currentRow);
      currentRow = [];
    }
    return output;
  }

//takes a pixelgrid 640*480 and manipulates a imageData so they show the same;
function gridToImage(imageData, pixelGrid) {
    for (let j = 0; j < 480; j++) {
      for (let i = 0; i < 640; i++) {
          let x = i*4;
          let y = j*640*4;
          
        imageData.data[x + y ] = pixelGrid[j][i]; //red
        imageData.data[x+y+1 ] = pixelGrid[j][i]; //green
        imageData.data[x+y+2 ] = pixelGrid[j][i]; //blue
      }
    }
    return imageData;
  }

  //takes a grayscale image and returns a grid containing each pixel vaule
function makeGridOfImage(imageData) {
    //assumin we know the image is 640x480
    const img = imageData.data;
    let output = [];
  
    let currentRow = [];
    for (let j = 0; j < 480 * 4; j += 4) {
      for (let i = 0; i < 640 * 4; i += 4) {
        currentRow.push(img[i+640*j]);
      }
      output.push(currentRow);
      currentRow = [];
    }
    return output;
  }

  function grayScale(imageData) {
    let grays = [],
      grayMin = 255,
      grayMax = 0;
  
    //Find the value of a pixel
    for (let i = 0; i < imageData.data.length; i += 4) {
      let gray =
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      grays.push(gray);
      grayMin = Math.min(grayMin, gray);
      grayMax = Math.max(grayMax, gray);
    }
  
    let grayDelt = grayMax - grayMin;
  
    for (let i = 0, j = 0; i < imageData.data.length; i += 4) {
      let gray = Math.floor((255 * (grays[j] - grayMin)) / grayDelt);
      //Give each colorchannel the gray-value.
      imageData.data[i] = gray;
      imageData.data[i + 1] = gray;
      imageData.data[i + 2] = gray;
      // for futher implementations read edgedetection, we can use the "kernel" on one of the channls and do the same to every channel
      j++;
    }
    return imageData;
  }
  
  //Invert each of the color channel and returns the manipulated image
function invertedColors(imageData) {
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255 - imageData.data[i]; //red
      imageData.data[i + 1] = 255 - imageData.data[i + 1]; //green
      imageData.data[i + 2] = 255 - imageData.data[i + 2]; //blue
      imageData.data[i + 3] = 255; //alpha
    }
    return imageData;
  }
  
  //Edge detection using highpass filter
  // uses a grayscale pixel grid and returns filtered grid 
  //grid require 640x480
  function highPassFilter(pixelGrid){
    
    const kernel = [[-1,-1,-1],
                    [-1,9,-1],
                    [-1,-1,-1]];
    //iterate image skips edges since no zero-padding
    for(let y = 1; y< 480; y++){
        for(let x= 1; x<640;x++){
            //iterate kernel
            let sum = 0;//kernel sum of pixel
            for(let ky = -1; ky <= 1; ky++){
                for(let kx = -1; kx <= 1; kx++){
                    //Somehow it interperet -1 as a string so a typical consol.log() results in "64 -1".... Stupid
                    let val = pixelGrid[y][x];
                    sum += kernel[ky+1][kx+1];
                }
            }
            //sum = sum*(1/9)*pixelGrid[y][x];
            pixelGrid[y][x]= sum;
        }
    }
    return pixelGrid;
  }
  