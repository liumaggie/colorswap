class Player {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;
    // initial position of player
    this.x = this.gameWidth/2;
    this.y = this.gameHeight-this.gameHeight/5;
    this.radius = 10;
    this.velocity = 1.5;
    this.falling = false;
    this.deltaY = 60;
    this.color = 'blue';
  }

  fall(time) {
    this.y = (this.velocity * time/(1000/60)) + this.y;
    if (this.y >= this.gameHeight-this.gameHeight/5) {
      this.falling = false;
      // this.startingY = this.y;
    }
  }

  move() {
    this.y = this.y - this.deltaY;
    // if (this.y + this.deltaY >= this.startingY) {
    //   this.startingY = this.y;
      this.falling = true;

  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "#b0e5f6";
    ctx.fill();
  }

}

module.exports = Player;
