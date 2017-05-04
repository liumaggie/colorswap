class Obstacle {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;

    this.x = this.gameWidth/2;
    this.y = this.gameHeight-2*this.gameHeight/3;
    this.radius = 100;
  }

  createArc(start, end, color, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, start, end, true);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  draw(ctx) {
    // this.createArc(0, 3*Math.PI/2, "#b0e5f6", ctx);
    this.createArc(0, Math.PI*2, "#b0e5f6", ctx);
  }
}

module.exports = Obstacle;
