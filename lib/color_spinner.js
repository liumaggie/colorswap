const Util = require('./util');
const Arc = require('./arc');
const Obstacle = require('./obstacle');

class ColorSpinner extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 5;
    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().green),
      new Arc(this.x, this.y, this.radius, Math.PI/2, 0, Util.colors().yellow)
    ];
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.draw(ctx, true);
    });
  }
}

module.exports = ColorSpinner;
