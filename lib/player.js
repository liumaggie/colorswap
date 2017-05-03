class Player {
  constructor() {
    // initial position of player
    this.pos = [50, 50];
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
    ctx.fillStyle = "#b0e5f6";
    ctx.fill();
  }

}

module.exports = Player;
