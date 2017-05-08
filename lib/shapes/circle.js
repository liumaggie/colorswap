const Arc = require('./arc');
const Util = require('../util');
const Shape = require('./shape');

class Circle extends Shape {
  constructor(centerX, centerY, radius, spinner, angle) {
    super(centerX, centerY, radius, angle);
    this.spinner = spinner;
    if (angle) {
      this.rotatingAngle = angle;
    }
    this.arcs = [
      this.createArc(Math.PI/4, 7*Math.PI/4, Util.colors().blue),
      this.createArc(7*Math.PI/4, 5*Math.PI/4, Util.colors().purple),
      this.createArc(5*Math.PI/4, 3*Math.PI/4, Util.colors().green),
      this.createArc(3*Math.PI/4, Math.PI/4, Util.colors().yellow),
    ];
  }

  createArc(start, end, color) {
    return new Arc(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.draw(ctx, this.spinner);
    });
  }
}

module.exports = Circle;
