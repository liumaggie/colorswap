const Obstacle = require('./obstacle');

class Star extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.image = new Image();
    this.length = 30;
  }

  draw(ctx) {
    // ctx.save();
    ctx.drawImage(this.image,
                  this.x - this.length/2,
                  this.y - this.length/2,
                  this.length,
                  this.length);
    this.image.src = './images/star.png';
    // ctx.rotate(0.5);
    // ctx.restore();
  }
}

module.exports = Star;
