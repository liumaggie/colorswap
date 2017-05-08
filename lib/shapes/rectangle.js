const Line = require('./line');
const Util = require('../util');
const Shape = require('./shape');

class Rectangle extends Shape {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 100;
    this.counter = 0;
    this.lines = [
      this.createLine(0, Math.PI/2, Util.colors().blue),
      this.createLine(Math.PI/2, Math.PI, Util.colors().purple),
      this.createLine(Math.PI, 3*Math.PI/2, Util.colors().green),
      this.createLine(3*Math.PI/2, 2*Math.PI, Util.colors().yellow)
    ];
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.draw(ctx);
    });
  }
}

module.exports = Rectangle;
