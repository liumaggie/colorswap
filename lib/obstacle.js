const Arc = require('./arc');
const Util = require('./util');

class Obstacle {
  constructor(centerX, centerY, radius) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
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
