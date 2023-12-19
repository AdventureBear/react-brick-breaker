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

    const [paused, setPaused] = useState<boolean>(false);
    const [paddleX, setPaddleX] = useState<number>(width/2)
    const [bricks, setBricks] = useState<boolean[][]>([]);
    const [x, setX] = useState( 200)
    const [y, setY] = useState( 200)
    const [dx, setDx] = useState( 1)
    const [dy, setDy] = useState( -3)
    const [gameOver, setGameOver] = useState(false  )
    const rowheight = brickHeight + padding;
    const colwidth = brickWidth + padding;
    const [score, setScore] = useState(0);

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
            const handleKeyDown = () => {

                    setPaused(prev => !prev); // Toggle pause state
            };

            window.addEventListener("keydown", handleKeyDown);
            const updateGame = () => {
                if (!paused) {
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
                window.removeEventListener("keydown", handleKeyDown)
            };
        }, [paused, paddleX, bricks, x, y]);




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

    function init(){
        setBricks(initBricks());
        setGameOver(false)
        setPaused(false)
        setX(200)
        setY(200)
        setDy(-3)
        setScore(0)
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

            // Calculate row and column for collision detection
            const currentRow = Math.floor(y / rowheight);
            const currentCol = Math.floor(x / colwidth);
            console.log(currentRow, currentCol)

            //check for brick collision

                if (y < nrows * rowheight && currentRow >= 0 && currentCol >= 0 && bricks[currentRow][currentCol]) {
                    setDy(-dy)
                    bricks[currentRow][currentCol] = false;

                    //update score
                    setScore(score+1)
                }



            //contain the ball by rebounding it off the walls of the canvas
            // side walls
            if (x + ballRadius  + dx > width || x - ballRadius + dx < 0)
                setDx(-dx);

            // top
            if (y - ballRadius + dy < 0) {
                setDy(-dy);

            //bottom
            } else if (y + ballRadius + dy > height - paddleH) {
                //paddle
                if (x > paddleX && x < paddleX + paddleW) {
                    setDy(-dy);
                }
            }
            //bottom edge
            if (y + dy > height) {
                //game over, so stop the animation
                setGameOver(true)
                return
            }
            setX((prev)=> prev + dx);
            setY((prev)=> prev + dy);


            }
            setBricks([...bricks]);
        }

        if (gameOver) {
            // console.log("stopping animation")
            if (animation.current) {
                // console.log("animation current", animation)
                cancelAnimationFrame(animation.current);
            }
        }





    return (
        <>
            <div>
                <canvas
                    ref={canvasRef}
                />
            </div>

            <p>Mouse moves platform &bull; Press any key to pause</p>

                <button onClick={init}>Play again</button>

                <div id="score">{score}</div>

        </>
    );
}

export default BrickBreaker
