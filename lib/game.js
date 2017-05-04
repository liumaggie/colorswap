const Player = require('./player');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.player.draw(ctx);
  }
}

Game.width = 600;
Game.height = 700;

module.exports = Game;
