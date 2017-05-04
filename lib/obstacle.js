const Arc = require('./arc');

class Obstacle {
  constructor(centerX, centerY) {

    this.x = centerX;
    this.y = centerY;
    this.radius = 100;
    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, "#b0e5f6"),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, "#baade6"),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, "#8ae1c0"),
      new Arc(this.x, this.y, this.radius, Math.PI/2, 0, "#f3f485")
    ];

  }

  shift() {
    // this.x -= 10;
    this.y += 5;
    this.arcs.forEach((arc) => {
      arc.center = [this.x, this.y];
    });
  }

  createArc(start, end, color, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, start, end);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.rotate();
      arc.draw(ctx);
    });
  }
}

module.exports = Obstacle;
