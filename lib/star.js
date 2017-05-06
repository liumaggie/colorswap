const Obstacle = require('./obstacle');

class Star extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.image = new Image();
    this.length = 30;
    this.angle = 0;
  }

  rotate(ctx) {
    const offset = this.length / 2;
    ctx.save();
    ctx.translate(this.x, this.y);
    this.angle -= this.rotatingAngle;
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -offset, -offset, this.length, this.length);
    ctx.restore();
  }


  draw(ctx) {
    ctx.save();
    // ctx.translate(this.x - this.length/2, this.y - this.length/2);
    // ctx.rotate(0.5);
    ctx.drawImage(this.image,
                  -this.length/2,
                  -this.length/2,
                  this.length,
                  this.length);
    this.image.src = './images/star.png';
    this.rotate(ctx);
    ctx.restore();
  }
}

module.exports = Star;
