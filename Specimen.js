class Specimen {
    constructor() {
        this.radius = 20;
        
        this.pos = createVector(
            random(0, canvasWidth), 
            random(0, canvasHeight)
        );

        this.velocity = random(0, 50);

        this.color = color(
            random(0, 255), 
            random(0, 255), 
            random(0, 255)
        );
    }

    draw() {
        stroke(255);
        fill(this.color);
        circle(x, y, radius);
    }
}