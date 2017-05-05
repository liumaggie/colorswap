const Line = require('./line');
const Util = require('./util');
const Obstacle = require('./obstacle');

class Rectangle extends Obstacle {
  constructor(centerX, centerY) {
    this.x = centerX;
    this.y = centerY;
    this.radius = 100;
    this.lines = [
      new Line(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Line(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Line(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().green),
      new Line(this.x, this.y, this.radius, Math.PI/2, 0, Util.colors().yellow)
    ];
  }


  draw(ctx) {
    this.lines.forEach((line) => {
      line.rotate();
      line.calculateStart();
      line.draw(ctx);
    });
  }
}

module.exports = Rectangle;