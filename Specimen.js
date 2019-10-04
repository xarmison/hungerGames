class Specimen {
  constructor() {
    this.radius = int(random(9, 15));

    this.position = createVector(
      int(random(CANVAS_WIDTH)),
      int(random(CANVAS_HEIGHT))
    );

    this.velocity = createVector(int(random(-5, 5)), int(random(-5, 5)));

    this.acceleration = createVector(0, 0);

    this.color = [
      int(random(10, 255)),
      int(random(10, 255)),
      int(random(10, 255))
    ];

    this.visionRadius = 100;

    this.maxSpeed = 5;
    this.maxForce = 0.5;

    this.dna = {
      foodWeight: random(0, 1),
      poisonWeight: random(-1, 1),
      enemyWeight: random(0, 1)
    };
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
      str(
        this.dna.foodWeight +
          " " +
          this.dna.poisonWeight +
          " " +
          this.dna.enemyWeight
      ),
      this.position.x,
      this.position.y,
      70,
      80
    );
  }

  move() {
    if (this.position.x > CANVAS_WIDTH || this.position.x < 0){
        this.velocity.x *= -1;
    }
    if (this.position.y > CANVAS_HEIGHT || this.position.y < 0)
      this.velocity.y *= -1;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }

  behavior() {
    let foodSteer = this.eat(food, 4, 1);
    let poisonSteer = this.eat(poison, 4, -1);
    // let enemySteer = this.eat(population);

    foodSteer.mult(this.dna.foodWeight);
    poisonSteer.mult(this.dna.poisonWeight);
    // enemySteer.mult(this.dna.enemyWeight);

    this.acceleration.add(foodSteer);
    this.acceleration.add(poisonSteer);
    // this.acceleration.add(enemySteer);
  }

  eat(targerts, radius, nutritionValue) {
    let record = Infinity,
      closest = null;
    for (let target of targerts) {
      // Verifica se o target está dentro do campo de visão do espécieme
      if (isInsideCircle(target.position, this.position, this.visionRadius)) {
        let dist = this.position.dist(target.position);

        if (dist < record) {
          record = dist;
          closest = target;
        }

        stroke(255, 0, 255);
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
        if(){
        targerts.splice(targerts.indexOf(closest), 1);
        // sqrt(..) incrementa a área proporcionalmente a área da comida 
        let increment = sqrt(pow(radius, 2) + pow(this.radius, 2)) - this.radius;
        this.radius = this.radius + (nutritionValue)*(increment);
        }
    }

    if (closest) return this.seek(closest.position);
    else return createVector(0, 0);
  }

  seek(target) {
    // Vetor apontando da posição para o alvo
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);

    return steer;
  }

  seekFood() {
    for (let i of food) {
      if (isInsideCircle(i.position, this.position, this.visionRadius)) {
        this.acceleration.add(this.seek(i.position));

        if (isInsideCircle(i.position, this.position, this.radius)) {
          // food = food.filter(j => j != i);
          food.splice(food.indexOf(i), 1);

          this.radius = sqrt(16 + pow(this.radius, 2));
        }

        stroke(0, 255, 0);
        line(i.position.x, i.position.y, this.position.x, this.position.y);
      }
    }
  }

  seekPoison() {
    for (let i of poison) {
      if (isInsideCircle(i.position, this.position, this.visionRadius)) {
        this.acceleration.add(this.seek(i.position));

        if (isInsideCircle(i.position, this.position, this.radius)) {
          // poison = poison.filter(j => j != i);
          poison.splice(poison.indexOf(i), 1);

          if (this.radius <= 4) {
            population = population.filter(specimen => specimen != this);
            return;
          } else this.radius -= 1;
        }

        stroke(255, 0, 0);
        line(i.position.x, i.position.y, this.position.x, this.position.y);
      }
    }
  }

  seekEnemy() {
    for (let i of population) {
      if (i.position.equals(this.position) && i.radius == this.radius) continue;

      if (isInsideCircle(i.position, this.position, this.visionRadius)) {
        if (i.radius < this.radius) {
          this.acceleration.add(this.seek(i.position));
          if (this.position.dist(i.position) < this.radius) {
            if (i.radius > this.radius) {
              // population = population.filter(specimen => specimen != this);
              population.splice(population.indexOf(this), 1);

              i.radius = sqrt(pow(i.radius, 2) + pow(this.radius, 2));
              i.visionRadius += this.radius * 0.5;
            } else {
              // population = population.filter(specimen => specimen != i);
              population.splice(population.indexOf(i), 1);

              this.radius = sqrt(pow(i.radius, 2) + pow(this.radius, 2));
              this.visionRadius += i.radius * 0.5;
            }
          }
        }

        stroke(255, 255, 0);
        line(i.position.x, i.position.y, this.position.x, this.position.y);
      }
    }
  }
}
