class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    this.game.draw(this.ctx);
  }

}

module.exports = GameView;
