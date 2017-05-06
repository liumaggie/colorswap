const Arc = require('./arc');
const Util = require('./util');
const Obstacle = require('./obstacle');

class Circle extends Obstacle {
  constructor(centerX, centerY, radius, spinner) {
    super(centerX, centerY, radius);
    this.spinner = spinner;
    this.arcs = [
      this.createArc(0, 3*Math.PI/2, Util.colors().blue),
      this.createArc(3*Math.PI/2, Math.PI, Util.colors().purple),
      this.createArc(Math.PI, Math.PI/2, Util.colors().green),
      this.createArc(Math.PI/2, 2*Math.PI, Util.colors().yellow),
    ];
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      if (!this.spinner) {
        arc.rotate();
      }
      arc.draw(ctx, this.spinner);
    });
  }
}

module.exports = Circle;
