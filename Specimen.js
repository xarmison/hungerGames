class Specimen {
  	constructor() {
		this.radius = int(random(9, 15));

		this.position = createVector(
			int(random(CANVAS_WIDTH)),
			int(random(CANVAS_HEIGHT))
		);

		this.velocity = createVector(
			int(random(-5, 5)), 
			int(random(-5, 5))
		);

		this.acceleration = createVector(0, 0);

		this.color = [
			int(random(10, 255)),
			int(random(10, 255)),
			int(random(10, 255))
		];

		this.dna = {
			foodWeight: random(-1, 1),
			poisonWeight: random(-1, 1),
			enemyWeight: random(-1, 1),
			accelerationWeight: random(0.5, 1),
			visionWeight: random(1, 2)
		};

		this.visionRadius = 3 * this.radius * this.dna.visionWeight;
		this.maxSpeed = 5;
		this.maxForce = 0.5;
		this.fitness = 0;
  }

	draw() {					
		stroke(this.color);
		fill(this.color);
		circle(this.position.x, this.position.y, 2 * this.radius);

		noFill();
		stroke(255);
		circle(this.position.x, this.position.y, 2 * this.visionRadius);

		fill(255);
		text(
			str(`${this.radius.toFixed(3)}\n`) +
			str(`${this.dna.foodWeight.toFixed(3)}\n`) +
			str(`${this.dna.poisonWeight.toFixed(3)}\n`) +
			str(`${this.dna.enemyWeight.toFixed(3)}`),
			this.position.x,this.position.y,
			70, 80
		);
	}

	move() {
		// Bounce in x 
		if (this.position.x >= CANVAS_WIDTH) {
			this.position.x = CANVAS_WIDTH;
			this.velocity.x *= -1;
		} else if (this.position.x <= 0) {
			this.position.x = 0;
			this.velocity.x *= -1;
		}
		
		// Bounce in y
		if (this.position.y >= CANVAS_HEIGHT) {
			this.position.y = CANVAS_HEIGHT;
			this.velocity.y *= -1;
		} else if (this.position.y <= 0) {
			this.position.y = 0;
			this.velocity.y *= -1;
		}

		this.acceleration.mult(this.dna.accelerationWeight);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);

		this.position.add(this.velocity);

		this.acceleration.mult(0);
	}

	behavior() {
		let foodSteer = this.eat(food, 1);
		let poisonSteer = this.eat(poison, -1);
		let enemySteer = this.seekEnemy();

		foodSteer.mult(this.dna.foodWeight);
		poisonSteer.mult(this.dna.poisonWeight);
		enemySteer.mult(this.dna.enemyWeight);

		this.acceleration.add(foodSteer);
		this.acceleration.add(poisonSteer);
		this.acceleration.add(enemySteer);
	}

	eat(targerts, nutritionValue) {
		let record = Infinity, closest = null;
		for (let target of targerts) {

			// Verifica se o target está dentro do campo de visão do espécieme
			if (isInsideCircle(target.position, this.position, this.visionRadius)) {
				let dist = this.position.dist(target.position);

				if (dist < record) {
					record = dist;
					closest = target;
				}

				stroke(255);
				line(
					target.position.x,
					target.position.y,
					this.position.x,
					this.position.y
				);
			}
		}

		// Verifica se o target mais próximo está dentro do espécieme
		if (record < this.radius) {
			if (this.radius > closest.radius) {
				// Remove do array de targets
				targerts.splice(targerts.indexOf(closest), 1);

				// Incrementa a área proporcionalmente a área do target
				let increment = sqrt(pow(closest.radius, 2) + pow(this.radius, 2)) - this.radius;				
				this.radius += nutritionValue * increment;
				
				// Limita superiormente o raio de visão
				this.visionRadius += 1.2 * nutritionValue * increment;
				this.visionRadius = this.visionRadius > 500 ? 500 : this.visionRadius;

				// Diminui a velocidade
				if (this.maxSpeed > 0.5)
					this.maxSpeed -= 0.01 * nutritionValue * increment;
			} else {
				this.die();	
			}
		}

		if (closest) 
			return this.seek(closest.position);
		else 
			return createVector(0, 0);
	}

	die() {
		// Remove da população quando for muito pequeno e tentar comer veneno
		dead.push(this);
		population.splice(population.indexOf(this), 1);
	}

	seek(target) {
		// Vetor apontando da posição para o alvo
		let desired = p5.Vector.sub(target, this.position);
		desired.setMag(this.maxSpeed);

		let steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);

		return steer;
	}

	seekEnemy() {
		let closest = null;
		for (let i of population) {
			// Se os raios são iguais nada deve ser feito
			if (i.position.equals(this.position) && i.radius == this.radius) 
				continue;
			
			if (isInsideCircle(i.position, this.position, this.visionRadius)) {
				if (i.radius < this.radius) {
					closest = i;
					if (this.position.dist(i.position) < this.radius) {
						if (i.radius > this.radius) {
							// population.splice(population.indexOf(this), 1);
							this.die();

							let increment = sqrt(pow(i.radius, 2) + pow(this.radius, 2)) - i.radius;				
							i.radius += increment;
							i.visionRadius += 1.2 * increment;

						} else {
							// population.splice(population.indexOf(i), 1);
							i.die();

							let increment = sqrt(pow(i.radius, 2) + pow(this.radius, 2)) - this.radius;				
							this.radius += increment;
							this.visionRadius += 1.2 * increment;
						}
					}
				}

				stroke(255, 0, 255);
				line(i.position.x, i.position.y, this.position.x, this.position.y);
			}
		}

		if (closest) 
			return this.seek(closest.position);
		else 
			return createVector(0, 0); 
	}
}
