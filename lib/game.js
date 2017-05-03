const Player = require('./player');

class Game {
  constructor() {
    this.player = new Player();
  }

  draw(ctx) {
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.player.draw(ctx);
  }
}

Game.width = 600;
Game.height = 700;

module.exports = Game;
