let CANVAS_WIDTH = 1200, CANVAS_HEIGHT = 550;
const windowOffset = 300;
const POP_SIZE = 50, INITIAL_FOODS = 50, INITIAL_POISONS = 5;
const MUTATION_RATE = 0, GENOCIDE_TIME = 10;

let food = [], poison = [];

let individuals;

function isInsideCircle(point, pos, radius) {
	return pow(point.x - pos.x, 2) + pow(point.y - pos.y, 2) < pow(radius, 2);
}

function setup() {
	frameRate(60);
	CANVAS_WIDTH = windowWidth - windowOffset;
	CANVAS_HEIGHT = windowHeight - windowOffset;
	let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	canvas.parent("canvasDiv");

	individuals = new Population(MUTATION_RATE, POP_SIZE);

	background(0);

	for (let i = 0; i < INITIAL_FOODS; i++)
		food.push({
			position: createVector(
				random(CANVAS_WIDTH), 
				random(CANVAS_HEIGHT)
			),
			radius: 4
		});

	for (let i = 0; i < INITIAL_POISONS; i++)
		poison.push({
			position: createVector(
				random(CANVAS_WIDTH), 
				random(CANVAS_HEIGHT)
			),
			radius: 4
		});
	
	// Cria uma comida nova a cada intervalo
	setInterval(_ => {
		food.push({
			position: createVector(
				random(CANVAS_WIDTH), 
				random(CANVAS_HEIGHT)
			),
			radius: 4
		});
	}, 250);

	// Cria um veneno novo a cada intervalo
	setInterval(_ => {
		poison.push({
			position: createVector(
				random(CANVAS_WIDTH), 
				random(CANVAS_HEIGHT)
			),
			radius: 4
		});
	}, 500);

	// Diminui o raio de todos 
	setInterval(_ => {
		for (let coiso of individuals.population) {
			if (coiso.radius < 4)
				coiso.die();
	
			coiso.radius -= 0.5;
			coiso.fitness += 1;
		}
	}, 1000);

	// Genocidio
	setInterval(_ => individuals.genocide(), GENOCIDE_TIME*1000);
}

function draw() {
	background(0);

	for (let i of food) {
		fill(0, 255, 0);
		noStroke();
		circle(i.position.x, i.position.y, 2 * i.radius);
	}

	for (let j of poison) {
		fill(255, 0, 0);
		noStroke();
		circle(j.position.x, j.position.y, 2 * j.radius);
	}

	if (individuals.population.length) {
		for (let coiso of individuals.population) {
			coiso.draw();
			coiso.move();
			coiso.behavior();
		}
	} else {
		individuals.naturalSelection();
		individuals.generate();	

		console.log(`Generation: ${individuals.generation}`);
		
		background(0);

		food = [];
		for (let i = 0; i < INITIAL_FOODS; i++)
			food.push({
				position: createVector(
					random(CANVAS_WIDTH), 
					random(CANVAS_HEIGHT)
				),
				radius: 4
			});
		
		poison = [];
		for (let i = 0; i < INITIAL_POISONS; i++)
			poison.push({
				position: createVector(
					random(CANVAS_WIDTH), 
					random(CANVAS_HEIGHT)
				),
				radius: 4
			})
	}	
}

function windowResized() {
	CANVAS_WIDTH = windowWidth - windowOffset;
	CANVAS_HEIGHT = windowHeight - windowOffset;
	resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}