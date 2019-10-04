const CANVAS_WIDTH = 1200, CANVAS_HEIGHT = 550;
const POP_SIZE = 5, INITIAL_FOODS = 50, INITIAL_POISONS = 50;

let population = [], food = [], poison = [];

function isInsideCircle(point, pos, radius) {
    return pow((point.x - pos.x), 2) + pow((point.y - pos.y), 2) < pow(radius, 2)
}

function setup() {
    frameRate(60);
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent("canvasDiv");
    
    background(0);
    
    for(let i = 0; i < POP_SIZE; i++) 
        population.push(new Specimen());

    for(let i = 0; i < INITIAL_FOODS; i++)
        food.push({position: createVector(
            random(CANVAS_WIDTH),
            random(CANVAS_HEIGHT)
        )});

    for(let i = 0; i < INITIAL_POISONS; i++) 
        poison.push({position: createVector(
            random(CANVAS_WIDTH),
            random(CANVAS_HEIGHT)
        )});

    setInterval( _ => {
        food.push({position: createVector(
            random(CANVAS_WIDTH),
            random(CANVAS_HEIGHT)
        )});
    }, 1000);
    setInterval( _ => {
        poison.push({position: createVector(
            random(CANVAS_WIDTH),
            random(CANVAS_HEIGHT)
        )});
    }, 5000);
}

function draw() {     
    background(0);

    for(let i of food) {
        fill(0, 255, 0);
        noStroke();
        circle(i.position.x, i.position.y, 8);
    }

    for(let j of poison) {
        fill(255, 0, 0);
        noStroke();
        circle(j.position.x, j.position.y, 8);
    }

    for(let coiso of population) {
        coiso.draw();
        coiso.move();
        
        coiso.behavior();
        // coiso.seekFood();
        // coiso.seekPoison();
        // coiso.seekEnemy();      
    }
}
