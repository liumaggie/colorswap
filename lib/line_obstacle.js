const Obstacle = require('./obstacle');
const Util = require('./util');
const Line = require('./line');

class LineObstacle extends Obstacle {
  constructor(centerX, centerY, radius) {
    super(centerX, centerY, radius);
    this.lineWidth = this.radius;
    this.lines = [
      this.createLine(this.x, this.y, Util.colors().blue),
      this.createLine(this.x - 2*this.lineWidth, this.y, Util.colors().purple),
      this.createLine(this.x + 2*this.lineWidth, this.y, Util.colors().green),
      this.createLine(this.x + 4*this.lineWidth, this.y, Util.colors().yellow),
    ];

    this.move = this.move.bind(this);
  }

  createLine(x, y, color) {
    return new Line(x, y, this.radius, 0, Math.PI, color);
  }

  shift(player) {
    this.lines.forEach((line) => {
      line.center[1] += player.moveVel * 0.8;
      if (line.center[0] + this.lineWidth < 0) {
        line.center[0] = 700
      }
    });
  }

  move() {
    this.lines.forEach((line) => {
      line.center[0] -= 3;
      line.calculateStart();
    });
  }

  shift(player) {
    this.lines.forEach((line) => {
      line.center[1] += player.moveVel * 0.8;
    });
  };

  draw(ctx) {
    this.lines.forEach((line) => {
      line.draw(ctx);
    });
  }
}

module.exports = LineObstacle;
