const Arc = require('./arc');
const Util = require('./util');
const Line = require('./line');

class Obstacle {
  constructor(centerX, centerY, radius) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.rotatingAngle = 0.02;
  }

  createLine(start, end, color) {
    return new Line(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  createArc(start, end, color) {
    return new Arc(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  shift(player) {
    this.y += player.moveVel * 0.8;
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

  move() {
    const segments = this.arcs ? this.arcs : this.lines;
    segments.forEach((segment) => {
      segment.rotate();
      if (this.lines) {
        segment.calculateStart();
      }
    });
  }
}

module.exports = Obstacle;
