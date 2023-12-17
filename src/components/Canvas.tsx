import { useRef, useEffect } from 'react';

interface Props {
    width: number,
    height: number
}


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

export function Canvas({width, height}:Props) {
    const canvasRef = useRef(null);

    //-------------------------
// FUNCTION DECLARATIONS
//-------------------------
// initialize game
    function init() {
        console.log("Initializing")
        //get a reference to the canvas
        ctx = $('#canvas')[0].getContext("2d");
        width = $("#canvas").width();
        height = $("#canvas").height();
        paddlex = width / 2;
        brickWidth = (width/ncols) - 1;
        canvasMinX = $("#canvas").offset().left;
        canvasMaxX = canvasMinX + width;
        score = 0;
        // run draw function every 10 milliseconds to give
        // the illusion of movement
        init_bricks();
        start_animation();
    }

    function reload() {
        console.log("reloading")
        x = 200;      // starting horizontal position of ball
        y = 150;      // starting vertical position of ball
        dx = 1;       // amount ball should move horizontally
        dy = -3;      // amount ball should move vertically
        init();
    }

// used to draw the ball
    function circle(x,y,r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }

// used to draw each brick & the paddle
    function rect(x,y,w,h) {
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.closePath();
        ctx.fill();
    }

// clear the screen in between drawing each animation
    function clear() {
        ctx.clearRect(0, 0, width, height);
        rect(0,0,width,height);
    }

// What do to when the mouse moves within the canvas
    function onMouseMove(evt) {
        // set the paddle position if the mouse position
        // is within the borders of the canvas
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            paddlex = Math.max(evt.pageX - canvasMinX - (paddlew/2), 0);
            paddlex = Math.min(width - paddlew, paddlex);
        }
    }

    function onKeyPress(evt) {
        evt.preventDefault();
        pause()
    }

    function pause() {
        if (paused) { // if paused, begin animation again
            start_animation();
        } else { // if unpaused, clear the animation
            stop_animation();
        }
        paused = !paused;
    }

// initialize array of bricks to be visible (true)

    function init_bricks() {
        bricks = new Array(nrows);
        for (i=0; i < nrows; i++) { // for each row of bricks
            bricks[i] = new Array(ncols);
            for (j=0; j < ncols; j++) { // for each column of bricks
                bricks[i][j] = true;
            }
        }
    }

// render the bricks
    function draw_bricks() {
        for (i=0; i < nrows; i++) { // for each row of bricks
            for (j=0; j < ncols; j++) { // for each column of bricks
                // set the colors to alternate through
                // all colors in brick_colors array
                // modulus (%, aka remainder) ensures the colors
                // rotate through the whole range of brick_colors
                ctx.fillStyle = brick_colors[(i+j) % brick_colors.length];
                if (bricks[i][j]) {
                    rect((j * (brickWidth + padding)) + padding,
                        (i * (brickHeight + padding)) + padding,
                        brickWidth, brickHeight);
                } // else if bricks[i][j] is false it's already been hit
            }
        }
    }

    function draw() {
        // before drawing, change the fill color
        ctx.fillStyle = backcolor;
        clear();
        ctx.fillStyle = ballcolor;
        //draw the ball
        circle(x, y, ballRadius);
        ctx.fillStyle = paddlecolor;
        //draw the paddle
        rect(paddlex, height-paddleh, paddlew, paddleh);
        draw_bricks();

        //check if we have hit a brick
        rowheight = brickHeight + padding;
        colwidth = brickWidth + padding;
        row = Math.floor(y/rowheight);
        col = Math.floor(x/colwidth);
        //if so reverse the ball and mark the brick as broken
        if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
            dy = -dy;
            bricks[row][col] = false;

            //update score
            score = score + 1
        }

        //contain the ball by rebouding it off the walls of the canvas
        if (x + dx > width || x + dx < 0)
            dx = -dx;

        if (y + dy < 0) {
            dy = -dy;
        } else if (y + dy > height - paddleh) {
            // check if the ball is hitting the
            // paddle and if it is rebound it
            if (x > paddlex && x < paddlex + paddlew) {
                dy = -dy;
            }
        }
        if (y + dy > height) {
            //game over, so stop the animation
            stop_animation();
        }
        x += dx;
        y += dy;
    }

    function update_score_text() {
        // You can send data to your HTML
        // just like setting styles in CSS
        // Put <div id="score"></div> in
        // your HTML for this text to display
        $('#score').text("Score: " + score);
    }

    function start_animation() {
        intervalId = setInterval(()=> {
            draw()
            update_score_text()
        }, 10);
    }

    function stop_animation() {
        clearInterval(intervalId);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.fillStyle = 'red';
        context.fillRect(0, 0, width, height);

        const clickHandler = () => {
            context.fillStyle = 'blue';
            context.fillRect(0, 0, width, height);
        };

        canvas.addEventListener('click', clickHandler);

        return () => {
            canvas.removeEventListener('click', clickHandler);
        };
    }, []);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
        );
}