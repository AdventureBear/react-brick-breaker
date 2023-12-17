
//-------------------------
// GLOBAL VARIABLES
//-------------------------
const x = 200;      // starting horizontal position of ball
const y = 150;      // starting vertical position of ball
const dx = 1;       // amount ball should move horizontally
const dy = -3;      // amount ball should move vertically
// variables set in init()
let ctx, width, height, paddlex, bricks, brickWidth;
const paddleh = 10; // paddle height (pixels)
const paddlew = 75; // paddle width (pixels)
const canvasMinX = 0; // minimum canvas x bounds
const canvasMaxX = 0; // maximum canvas x bounds
const intervalId = 0; // track refresh rate for calling draw()
const nrows = 5; // number of rows of bricks
const ncols = 8
; // number of columns of bricks
const brickHeight = 15; // height of each brick
const padding = 1;  // how far apart bricks are spaced

const ballRadius = 10; // size of ball (pixels)
// change colors of bricks -- add as many colors as you like
const brick_colors = ["#DCFFFD", "#52FFEE", "#4FB477", "#3F6634", "#345511"];
const paddlecolor = "black";
const ballcolor = "black";
const backcolor = "grey";

const score = 0;      // store the number of bricks eliminated
const paused = false; // keeps track of whether the game is paused (true) or not (false)
