const Circle = require('./circle');
const Shape = require('./shape');
const Util = require('../util');

class DoubleCircle extends Shape {
  constructor(centerX, centerY, radius, color) {
    super(centerX, centerY, radius);
    this.playerColor = color;
    const angle = -this.rotatingAngle;
    const firstCircle = new Circle(this.x, this.y, this.radius);
    const secondCircle = new Circle(this.x, this.y, this.radius + 20, false, angle);
    this.arcs = firstCircle.arcs.concat(secondCircle.arcs);
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.draw(ctx);
    });
  }
}

module.exports = DoubleCircle;
