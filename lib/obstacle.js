const Arc = require('./arc');
const Util = require('./util');

class Obstacle {
  constructor(centerX, centerY) {
    this.x = centerX;
    this.y = centerY;
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

module.exports = Obstacle;
