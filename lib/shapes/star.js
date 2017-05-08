const Shape = require('./shape');

class Star extends Shape {
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

  collision(player) {
    if (player.y <= (this.y + this.length/2) &&
        player.y >= (this.y - this.length/2)) {
          return true;
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    this.image.src = './assets/star.png';
    this.rotate(ctx);
    ctx.restore();
  }
}

module.exports = Star;
