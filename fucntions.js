//*************FUNCTIONS*************** */
//Small test function to see if the generated grid Works as intended
function stripes() {
  let output = [];
  let counter = 0;

  let currentRow = [];
  for (let j = 0; j < 480; j++) {
    for (let i = 0; i < 640; i++) {
      if (counter <= 9) {
        currentRow.push(0);
      } else currentRow.push(255);
      counter++;
      if (counter >= 20) {
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
      let x = i * 4;
      let y = j * 640 * 4;

      imageData.data[x + y] = pixelGrid[j][i]; //red
      imageData.data[x + y + 1] = pixelGrid[j][i]; //green
      imageData.data[x + y + 2] = pixelGrid[j][i]; //blue
    }
  }

  return imageData;
}

//takes a grayscale image and returns a grid containing each pixel vaule
function makeGridOfImage(imageData) {
  //assumin we know the image is 640x480
  const img = imageData.data;
  let output = [];
  //test variable
  let min = 0;
  let currentRow = [];
  for (let j = 0; j < 480 * 4; j += 4) {
    for (let i = 0; i < 640 * 4; i += 4) {
      currentRow.push(img[i + 640 * j]);
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
function highPassFilter(pixelGrid) {
  const kernel = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1],
  ];

  //iterate image skips edges since no zero-padding
  for (let y = 1; y < 479; y++) {
    for (let x = 1; x < 639; x++) {
      //iterate kernel
      let sum = 0; //kernel sum of pixel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          //Somehow it interperet -1 as a string so a typical consol.log() results in "64 -1".... Stupid
          let posY = y + ky;
          let posX = x + kx;
          let val = pixelGrid[posY][posX];
          sum += (1 / 9) * kernel[ky + 1][kx + 1] * val;
        }
      }

      pixelGrid[y][x] = sum;
    }
  }
  return pixelGrid;
}
function findSmallestValue(pixelGrid) {
  let max = 0;
  let min = 0;
  for (let y = 0; y < 480; y++) {
    for (let x = 0; x < 640; x++) {
      if (pixelGrid[y][x] > max) {
        max = pixelGrid[y][x];
      }
      if (pixelGrid[y][x] < min) {
        min = pixelGrid[y][x];
      }
    }
  }
  console.log("Största värdet :" + max + "  minsta värdet:" + min);
}
//Edge detection
function prewittOperator(pixelGrid) {
  //
  const xAxis = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const yAxis = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  let pixelGridY = pixelGrid.map(function (arr) {
    return arr.slice();
  });
  let pixelGridX = pixelGrid.map(function (arr) {
    return arr.slice();
  });

  for (let y = 1; y < 479; y++) {
    for (let x = 1; x < 639; x++) {
      //set sumX/Y to 0 each pixel
      let sumY = 0; //kernel sum of pixel
      let sumX = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          //Do the perwitt x and y on the same iteration
          let posY = y + ky;

          let posX = x + kx;

          //Något här fungerar inte som det ska...
          let val = pixelGrid[posY][posX];

          //if(posX == 1 && posY ==1){console.log(pixelGrid[1][1] +" and "+pixelGrid[posY][posX] + " at coordinate " + posY +" : " + posX + "  kx=" + kx + "  ky=" +ky + " x n y ="+ x + " " +y)}

          sumY += val * yAxis[ky + 1][kx + 1];
          sumX += val * xAxis[ky + 1][kx + 1];
        }
      }

      pixelGridY[y][x] = sumY;
      pixelGridX[y][x] = sumX;
    }
  }

  //might do this in its own function, but combine the value of perwitt x and y
  for (let y = 0; y < 480; y++) {
    for (let x = 0; x < 640; x++) {
      pixelGrid[y][x] = Math.sqrt(
        Math.pow(pixelGridY[y][x], 2) + Math.pow(pixelGridX[y][x], 2)
      );
    }
  }

  return pixelGrid;
}

//sets all pixels in given pixelgrid that has a lower value than threshold to 0
function threshold(pixelGrid, thresValue) {
  for (let y = 0; y < 480; y++) {
    for (let x = 0; x < 640; x++) {
      if (pixelGrid[y][x] < thresValue) {
        pixelGrid[y][x] = 0;
      }
    }
  }
  return pixelGrid;
}
//Binarize given pixelgrid using the threshold. result grid has pixelvaules 0 or 255
function binarize(pixelGrid, thresValue) {
  for (let y = 0; y < 480; y++) {
    for (let x = 0; x < 640; x++) {
      if (pixelGrid[y][x] < thresValue) {
        pixelGrid[y][x] = 0;
      } else pixelGrid[y][x] = 255;
    }
  }
  return pixelGrid;
}

//Removes small and lonely pixel clusters. max 4px big. recommended to use binarized grid.
function removeLonelyPixels(pixelGrid) {
  for (let y = 1; y < 479; y++) {
    for (let x = 1; x < 639; x++) {
      //iterate kernel
      let sum = 0; //kernel sum of pixel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          //Somehow it interperet -1 as a string so a typical consol.log() results in "64 -1".... Stupid
          let posY = y + ky;
          let posX = x + kx;
          let val = pixelGrid[posY][posX];
          if (val > 0) {
            sum++;
          }
        }
      }
      if (sum <= 4) {
        pixelGrid[y][x] = 0;
      }
    }
  }
  return pixelGrid;
}

//Problemet är att den glömmer bort vad den har tagit bort så när det kommer ny information så glömmer den bort att ta bort det XD
//prev måste vara en obehandlad version av new
function removeStationary(grid, prevGrid) {
  tempGrid = prevGrid.map(function (arr) {
    return arr.slice();
  });

  if (prevGrid[0][0]) {
    for (let y = 0; y < 480; y++) {
      for (let x = 0; x < 640; x++) {
        grid[y][x] -= tempGrid[y][x];

        //grid[y][x] -= prevGrid[y][x]*0.5
      }
    }
  }
  return grid;
}

function erosionOperation(pixelGrid) {
  let structElement = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];

  tempGrid = pixelGrid.map(function (arr) {
    return arr.slice();
  });

  for (let y = 1; y < 479; y++) {
    for (let x = 1; x < 639; x++) {
      //iterate kernel
      let sum = 0; //kernel sum of pixel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          //Somehow it interperet -1 as a string so a typical consol.log() results in "64 -1".... Stupid
          let posY = y + ky;
          let posX = x + kx;
          let val = pixelGrid[posY][posX];
          if (val > 0) {
            sum++;
          }
        }
      }
      if (sum != 9) {
        tempGrid[y][x] = 0;
      } else {
        tempGrid[y][x] = 255;
      }
    }
  }
  return tempGrid;
}

function dilationOperation(pixelGrid) {
  tempGrid = pixelGrid.map(function (arr) {
    return arr.slice();
  });

  for (let y = 1; y < 479; y++) {
    for (let x = 1; x < 639; x++) {
      //iterate kernel
      let sum = 0; //kernel sum of pixel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          //Somehow it interperet -1 as a string so a typical consol.log() results in "64 -1".... Stupid
          let posY = y + ky;
          let posX = x + kx;
          let val = pixelGrid[posY][posX];
          if (val > 0) {
            sum++;
          }
        }
      }
      if (sum > 0) {
        tempGrid[y][x] = 255;
      } else {
        tempGrid[y][x] = 0;
      }
    }
  }
  return tempGrid;
}

function closingOperation(pixelGrid) {
  return erosionOperation(dilationOperation(pixelGrid));
}

function openingOperation(pixelGrid) {
  return dilationOperation(erosionOperation(pixelGrid));
}

//checks a area for interaction returns true if numbers of active pixels exceeds threshold
function checkInteraktion(pixelGrid, TL, BL, TR, BR, thresHold) {
  let sum = 0;
  for (let y = TL; y < BR; y++) {
    for (let x = BL; x < TR; x++) {
      if (pixelGrid[y][x] > 0) {
        sum++;
      }
    }
 
  }
  
  if (sum >= thresHold) {
    return true;
  } else {
    return false;
  }
}
