const Util = require('./util');

class Player {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;
    // initial position of player
    this.x = this.gameWidth/2;
    this.y = this.gameHeight-this.gameHeight/5;
    this.radius = 10;
    const colors = Util.colorsToArray();
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.moving = false;
    this.falling = false;
    this.moveVel = 0;
    this.fallVel = 0;
  }

  move() {
    this.fallVel = 0;
    this.moving = true;
    this.moveVel = 8;
  }

  checkMove() {
    this.y = this.y - this.moveVel;
    this.moveVel -= 1;
    if (this.moveVel === 0) {
      this.falling = true;
      this.moving = false;
      this.fallVel = 1;
    }
  }

  fall(time, gameStarted) {
    this.y += this.fallVel
    this.fallVel += 0.1;
    if (gameStarted === false) {
      if (this.y >= this.gameHeight - this.gameHeight/5) {
        // stop the falling
        this.falling = false;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    // creates shadow when jumping
    if (this.y < this.gameHeight-this.gameHeight/5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y - 10, this.radius, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 0.4;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

}

module.exports = Player;
