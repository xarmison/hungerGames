const canvasWidth = 1200, canvasHeight = 550;

let x = 30, y = 20, radius = 10;

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("canvasDiv");
    background(0);

    stroke(255);
    circle(x, y, radius);
}

function draw() {     
}
