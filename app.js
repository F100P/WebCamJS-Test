let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let main = document.getElementById("maindiv");
// A bit of useful guides
//http://smokingscript.com/pages/webcam-manipulation-with-canvas/

var clock = new Clock(main, 10);
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
        video.srcObject = stream;

        

        video.play();
    });
}


document.getElementById('start').addEventListener('click', () => {
    
    context.drawImage(video, 0 ,0 ,640, 480);
    
    clock.start();
    
    
})
document.getElementById('stop').addEventListener('click', () => {
    
    
    
    clock.stop();
    
    
})
//Draws image every tick
main.addEventListener('ticks', function(){
   
    context.drawImage(video, 0 ,0 ,640, 480);

    // ********MOVE THIS SECTION TO a MODIFI-Function****
    //plan is to have one active video stream and modify it by functions :P 
    const imageData = context.getImageData(0,0,640,480);
    for(let i = 0; i< imageData.data.length; i+=4){
        
        imageData.data[i] = 255-imageData.data[i];
        imageData.data[i + 1] = 255-imageData.data[i + 1];
        imageData.data[i + 2] = 255-imageData.data[i + 2];
        imageData.data[i + 3] = 255;
    }
    //***************************** */
   
    context.putImageData(imageData, 0 ,0)
})
