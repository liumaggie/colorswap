const Arc = require('./arc');
const Util = require('./util');
const Line = require('./line');

class Obstacle {
  constructor(centerX, centerY, radius) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.rotatingAngle = 0.03;
  }

  createLine(start, end, color) {
    return new Line(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  createArc(start, end, color) {
    return new Arc(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  shift(player) {
    this.y += 2;
    if (this.arcs) {
      this.arcs.forEach((arc) => {
        arc.center = [this.x, this.y];
      });
    } else if (this.lines) {
        this.lines.forEach((line) => {
          line.center = [this.x, this.y];
      });
    }
  }
}

module.exports = Obstacle;
