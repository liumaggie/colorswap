class Player {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;
    // initial position of player
    this.x = this.gameWidth/2;
    this.y = this.gameHeight-this.gameHeight/5;
    this.radius = 10;
    this.velocity = 2.5;
    this.falling = false;
    this.deltaY = 50;
    this.color = "#35E2F2";
  }

  fall(time, gameStarted) {
    this.y = (this.velocity * time/(1000/60)) + this.y;
    if (gameStarted === false) {
      if (this.y >= this.gameHeight - this.gameHeight/5) {
        // stop the falling
        this.falling = false;
      }
    }
  }

  move(time) {
    // this.y = (this.velocity * time/(1000/60)) + this.y;
    this.y = this.y - this.deltaY;
    this.falling = true;
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
