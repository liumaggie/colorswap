const Arc = require('./arc');
const Util = require('./util');
const Obstacle = require('./obstacle');

class Circle extends Obstacle {
  constructor(centerX, centerY) {

    this.x = centerX;
    this.y = centerY;
    this.radius = 100;
    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().green),
      new Arc(this.x, this.y, this.radius, Math.PI/2, 0, Util.colors().yellow)
    ];

  }

  shift() {
    this.y += 3;
    this.arcs.forEach((arc) => {
      arc.center = [this.x, this.y];
    });
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.rotate();
      arc.draw(ctx);
    });
  }
}

module.exports = Circle;
