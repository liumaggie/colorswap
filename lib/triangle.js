const Obstacle = require('./obstacle');
const Line = require('./line');
const Util = require('./util');

class Triangle extends Obstacle {
  constructor(centerX, centerY, radius, color) {
    super(centerX, centerY, radius);
    this.radius = 120;
    this.playerColor = color;
    this.selectedColors = this.selectRandomColors();
    this.lines = [
      this.createLine(0, 2*Math.PI/3, this.selectedColors[0]),
      this.createLine(2*Math.PI/3, 4*Math.PI/3, this.selectedColors[1]),
      this.createLine(4*Math.PI/3, 2*Math.PI, this.selectedColors[2])
    ];
  }

  selectRandomColors() {
    const colors = Object.values(Util.colors());
    const playerIdx = colors.indexOf(this.playerColor);
    colors.splice(playerIdx, 1);
    return colors;
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.draw(ctx);
    });
  }
}

module.exports = Triangle;
