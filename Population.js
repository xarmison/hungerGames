class Population {
    constructor() {
        this.generation = 0;

        this.mutationRate = 0.01;

        this.population = [];
        for (let i = 0; i < POP_SIZE; i++) 
		    this.population.push(new Specimen());
        
        this.dead = [];

        this.matingPool = [];
    }

    naturalSelection() {
        let maxFitness = this.dead[this.dead.length - 1].fitness;

        for (let i of this.dead) {
            let fitness = map(i.fitness, 0, maxFitness, 0, 1);

            for (let j = 0; j < floor(fitness * 10); j++) 
                this.matingPool.push(i);
        }
    }

    generate() {
        for (let i = 0; i < POP_SIZE; i++) {
            let partner1_index = floor(random(this.matingPool.length - 1));
            let partner2_index = floor(random(this.matingPool.length - 1));
            
            let partner1 = this.matingPool[partner1_index];
            let partner2 = this.matingPool[partner2_index];

            // Não usando proteção
            let child = partner1.crossover(partner2);
            child.mutate(this.mutationRate);
            
            this.population[i] = child;
        }

        this.generation += 1;
    }

    genocide() {
        // Coloca o melhor no fim do array        
        this.population.sort((a, b) => a.fitness > b.fitness);
        
        for (let i of this.population) 
            this.dead.push(i)
        
        this.population = [];        
    }

}