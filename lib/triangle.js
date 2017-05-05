const Obstacle = require('./obstacle');
const Line = require('./line');
const Util = require('./util');

class Triangle extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 100;

    this.lines = [
      new Line(this.x, this.y, this.radius, 0, 2*Math.PI/3, Util.colors().blue),
      new Line(this.x, this.y, this.radius, 2*Math.PI/3, 4*Math.PI/3, Util.colors().purple),
      new Line(this.x, this.y, this.radius, 4*Math.PI/3, 0, Util.colors().green),
    ]
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.rotate();
      line.calculateStart();
      line.draw(ctx);
    });
  }
}

module.exports = Triangle;
