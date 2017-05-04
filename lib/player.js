class Player {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;
    // initial position of player
    this.x = this.gameWidth/2;
    this.y = this.gameHeight-this.gameHeight/5;

    this.velocity = 2;
    this.gravity = 0.2;
    this.falling = false;
    this.movingUp = false;
    this.deltaY = 10;
    this.startingY = this.y;
  }

  fall() {
    this.y = this.y + this.velocity;
    // this.y = (this.velocity * time/(1000/60)) + this.y;
    if (this.y >= this.gameHeight-this.gameHeight/5) {
      this.falling = false;
      this.startingY = this.y;
    }
  }

  move() {
    this.movingUp = true;
    this.y = this.y - this.velocity;
    if (this.y + this.deltaY >= this.startingY) {
      this.movingUp = false;
      this.startingY = this.y;
      this.falling = true;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = "#b0e5f6";
    ctx.fill();
  }

}

module.exports = Player;
