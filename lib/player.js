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
    this.color = "#b0e5f6";
  }

  fall(time) {
    console.log('before fall', this.y)
    this.y = (this.velocity * time/(1000/60)) + this.y;
    if (this.y >= this.gameHeight-this.gameHeight/5) {
      this.falling = false;
    }
    console.log('falling', this.y)
  }

  move() {
    console.log(this.y)
    this.y = this.y - this.deltaY;
    this.falling = true;
    console.log('moving', this.y)
  }

  draw(ctx) {
    // debugger
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    console.log('drawing')
    console.log('player', this.x, this.y)
    ctx.fillStyle = this.color;
    ctx.fill();
  }

}

module.exports = Player;
