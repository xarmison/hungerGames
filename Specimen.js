class Specimen {
  	constructor() {
		this.radius = 10;

		this.position = createVector(
			int(random(CANVAS_WIDTH)),
			int(random(CANVAS_HEIGHT))
		);

		this.velocity = createVector(
			int(random(-5, 5)), 
			int(random(-5, 5))
		);

		this.acceleration = createVector(0, 0);

		this.dna = {
			foodWeight: random(-1, 1),
			poisonWeight: random(-1, 1),
			enemyWeight: random(-1, 1),
			accelerationWeight: random(0.5, 1),
			visionWeight: random(1, 3)
		};

		this.visionRadius = 3 * this.radius * this.dna.visionWeight;
		this.maxSpeed = 5;
		this.maxForce = 0.5;
		this.fitness = 0;

		// Define a cor de acordo com as caracteristicas
		if (this.dna.foodWeight > this.dna.poisonWeight && this.dna.foodWeight > this.dna.enemyWeight)
			this.color = [66, 245, 114];
		else if (this.dna.poisonWeight > this.dna.foodWeight && this.dna.poisonWeight > this.dna.enemyWeight)
			this.color = [245, 87, 66];
		else if (this.dna.enemyWeight > this.dna.foodWeight && this.dna.enemyWeight > this.dna.poisonWeight)
			this.color = [66, 188, 245];
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
				this.radius += 2 * nutritionValue * increment;
				
				// Limita superiormente o raio de visão
				this.visionRadius += 1.2 * nutritionValue * increment;
				this.visionRadius = this.visionRadius > 500 ? 500 : this.visionRadius;

				// Diminui a velocidade
				if (this.maxSpeed > 0.1)
					this.maxSpeed -= 0.5 * nutritionValue * increment;
				else
					this.maxSpeed = 0.1;
			} else {
				this.die();	
			}
		}

		if (closest) 
			return this.seek(closest.position);
		else 
			return createVector(0, 0);
	}

	// Remove da população
	die() {
		this.fitness += 1 + this.radius;
		
		// Condição arbitrária
		if (this.fitness <= 11)
			this.fitness = 0;

		individuals.dead.push(this);
		individuals.population.splice(individuals.population.indexOf(this), 1);
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
		for (let i of individuals.population) {
			// Se os raios são iguais nada deve ser feito
			if (i.position.equals(this.position) && i.radius == this.radius) 
				continue;
			
			if (isInsideCircle(i.position, this.position, this.visionRadius)) {
				if (i.radius < this.radius) {
					closest = i;
					if (this.position.dist(i.position) < this.radius) {
						if (i.radius > this.radius) {
							let increment = sqrt(pow(i.radius, 2) + pow(this.radius, 2)) - i.radius;				
							i.radius += increment;
							i.visionRadius += 1.2 * increment;

							this.die();

						} else {
							let increment = sqrt(pow(i.radius, 2) + pow(this.radius, 2)) - this.radius;				
							this.radius += increment;
							this.visionRadius += 1.2 * increment;

							i.die();
						}
					}
				}

				stroke(255, 0, 255);
				line(i.position.x, i.position.y, this.position.x, this.position.y);
			}
		}

		if (closest){
			if (closest.radius < this.radius) 
				return this.seek(closest.position);
			else
				return this.seek(closest.position).mult(-1);
		}
		else 
			return createVector(0, 0); 
	}

	// Muda aleatoriamente uma caracteristica
	mutate(mutationRate) {
		let mutou = 0;
		if (random(1) < mutationRate){
			this.dna.accelerationWeight = random(0.5, 1);
			mutou++;
		}

		if (random(1) < mutationRate){
			this.dna.enemyWeight = random(-1, 1);
			mutou++;
		}
		
		if (random(1) < mutationRate){ 
			this.dna.poisonWeight = random(-1, 1);
			mutou++;
		}
		
		if (random(1) < mutationRate){ 
			this.dna.foodWeight = random(-1, 1);
			mutou++;
		}
		
		if (random(1) < mutationRate){ 
			this.dna.visionWeight = random(1, 2);
			mutou++;
		}
		if(mutou) console.log("mutou");
		
		// Atualiza a cor
		if (this.dna.foodWeight > this.dna.poisonWeight && this.dna.foodWeight > this.dna.enemyWeight)
			this.color = [66, 245, 114];
		else if (this.dna.poisonWeight > this.dna.foodWeight && this.dna.poisonWeight > this.dna.enemyWeight)
			this.color = [245, 87, 66];
		else if (this.dna.enemyWeight > this.dna.foodWeight && this.dna.enemyWeight > this.dna.poisonWeight)
			this.color = [66, 188, 245];
	}	

	// Gera um novo individuo com 50% de herdar cada caracteristica
	crossover(partner) {
		let child = new Specimen();

		if (random(1) < 0.5) 
			child.dna.accelerationWeight = this.dna.accelerationWeight;
		else 
			child.dna.accelerationWeight = partner.dna.accelerationWeight;

		if (random(1) < 0.5) 
			child.dna.enemyWeight = this.dna.enemyWeight;
		else 
			child.dna.enemyWeight = partner.dna.enemyWeight;
		
		if (random(1) < 0.5) 
			child.dna.poisonWeight = this.dna.poisonWeight;
		else 
			child.dna.poisonWeight = partner.dna.poisonWeight;
		
		if (random(1) < 0.5) 
			child.dna.foodWeight = this.dna.foodWeight;
		else 
			child.dna.foodWeight = partner.dna.foodWeight;

		if (random(1) < 0.5) 
			child.dna.visionWeight = this.dna.visionWeight;
		else 
			child.dna.visionWeight = partner.dna.visionWeight;

		return child;
	}
}
