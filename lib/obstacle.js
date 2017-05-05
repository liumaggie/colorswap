const Arc = require('./arc');
const Util = require('./util');

class Obstacle {
  constructor(centerX, centerY, radius) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
  }

  shift() {
    this.y += 3;
    if (this.arcs) {
      this.arcs.forEach((arc) => {
        arc.center = [this.x, this.y];
      });
    } else {
        this.lines.forEach((line) => {
          line.center = [this.x, this.y];
      });
    }
  }

  // draw(ctx) {
  //   this.arcs.forEach((arc) => {
  //     arc.rotate();
  //     arc.draw(ctx);
  //   });
  // }
}

module.exports = Obstacle;
