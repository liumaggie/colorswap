class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    this.elapsedTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    this.ctx.canvas.addEventListener("click", () => {
      this.game.player.move();
    });
    if (this.game.player.falling) {
      this.game.player.fall();
    }
    this.game.draw(this.ctx);
    this.elapsedTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }

}

module.exports = GameView;
