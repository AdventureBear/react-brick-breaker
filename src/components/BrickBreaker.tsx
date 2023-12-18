import {useRef, useEffect, useState} from 'react'

const width = 500
const height = 300
const paddleH = 10; // paddle height (pixels)
const paddleW = 75; // paddle width (pixels)
const paddleColor = "black";
const ncols = 8
const brickWidth = (width/ncols) - 1;
const nrows = 5; // number of rows of bricks
const brickHeight = 15; // height of each brick
const padding = 1;  // how far apart bricks are spaced
const brick_colors = ["#DCFFFD", "#52FFEE", "#4FB477", "#3F6634", "#345511"];
const ballRadius = 10; // size of ball (pixels)
const ballColor = "black"


function BrickBreaker() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const animation = useRef<number>();

    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [paddleX, setPaddleX] = useState<number>(width/2)
    const [bricks, setBricks] = useState<boolean[][]>([]);
    const [x, setX] = useState( 200)
    const [y, setY] = useState( 200)
    const [dx, setDx] = useState( 1)
    const [dy, setDy] = useState( -3)


    // Function to initialize bricks
        const initBricks = () => {
            const initialBricks = new Array<boolean[]>(nrows);
            for (let i = 0; i < nrows; i++) {
                initialBricks[i] = new Array<boolean>(ncols).fill(true);
            }
            return initialBricks;
        };



        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            if (!context) return

            contextRef.current = context;

            const handleMouseMove = (event: MouseEvent) => {
                console.log(event.clientX)
                const canvasBounds = canvas.getBoundingClientRect();
                const newX = event.clientX - canvasBounds.x - paddleW / 2;
                setPaddleX(newX);
            };

            canvas.addEventListener('mousemove', handleMouseMove);

            setBricks(initBricks());

            return () => {
                canvas.removeEventListener('mousemove', handleMouseMove);
            };

        }, []);

        useEffect(() => {

            const updateGame = () => {
                if (!isPaused) {
                    // Game logic here



                    // Redraw the canvas
                    draw()
                    // Continue the loop
                    animation.current = requestAnimationFrame(updateGame);
                }
            };

            animation.current = requestAnimationFrame(updateGame);

            return () => {
                if (animation.current) {
                    cancelAnimationFrame(animation.current);
                }
            };
        }, [isPaused, paddleX, bricks, x, y]);

    // render the bricks
    function drawBricks(context: CanvasRenderingContext2D) {
        for (let i = 0; i < nrows; i++) {
            for (let j = 0; j < ncols; j++) {
                if (bricks[i][j]) {
                    context.fillStyle = brick_colors[(i + j) % brick_colors.length];
                    const x = (j * (brickWidth + padding)) + padding;
                    const y = (i * (brickHeight + padding)) + padding;
                    context.fillRect(x, y, brickWidth, brickHeight);
                }
            }
        }
    }

    function circle(context: CanvasRenderingContext2D, x: number,y: number,r: number) {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

    function draw() {
        if (contextRef.current) {
            const context = contextRef.current;

            // Clear the canvas
            context.clearRect(0, 0, width, height);

            // Draw the paddle
            context.fillStyle = paddleColor;
            context.fillRect(paddleX, height - paddleH, paddleW, paddleH);

            // Draw the bricks
            drawBricks(context)

            //Draw the ball
            context.fillStyle = ballColor;
            circle(context, x, y, ballRadius)

            context.fill();

            //contain the ball by rebouding it off the walls of the canvas
            if (x + dx > width || x + dx < 0)
                setDx(-dx);

            if (y + dy < 0) {
                setDy(-dy);

            } else if (y + dy > height - paddleH) {
                // check if the ball is hitting the
                // paddle and if it is rebound it
                if (x > paddleX && x < paddleX + paddleW) {
                    setDy(-dy);
                }
            }
            if (y + dy > height) {
                //game over, so stop the animation
                // stop_animation();
            }
            setX((prev)=> prev + dx);
            setY((prev)=> prev + dy);

            }
        }


    return (
        <canvas
            ref={canvasRef}
        />
    );
}

export default BrickBreaker
