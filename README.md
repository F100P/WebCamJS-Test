# WebCamJS-Test
This is a web-app which i used to learn how to interact with a webcamera using JS.
To achive this I used image prossesing to process the camera stream to work as a motiondetector.
I later used this to create a little game in the same spirit as Eye-Toy. 

## More about
The page consist of 4 canvases. one that shows the live camerafeed. On top of it you have the buttonCanvas with all the buttons for you to interact with. 
underneath the game canvas we can find the interaction canvas. This shows the "image" that interact with the buttons. This image is the result of grayscale, edgedetection, binarization, removal of stationary active pixels and closing. In other words, motiondetection. 
Underneath this canvas you can find the image before removal of stationary active pixels and closing.


## Running
To run it i used live server in VS-code but do as you usally do when running a html/js project. be sure to accept the request to access you webcamera in the browser.
When you launch the app you will see the main game window with a startbutton on the lower right corner. move your hand over the square to begin the game. When the game begin you have 10 seconds to "catch" as many "*"-squares as you can.
Once your 10 seconds of playtime is over you will see your score. To play again just reload the page.

## Futher implementations
Adding more games and cleaning up the code would be nice... (its a mess right now);