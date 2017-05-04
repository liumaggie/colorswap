class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    this.elapsedTime = 0;
    this.movePlayer();
    requestAnimationFrame(this.animate.bind(this));
  }

  movePlayer() {
    this.ctx.canvas.addEventListener("mousedown", () => {
      this.game.player.move();
    });
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    this.game.draw(this.ctx);
    this.game.collided();
    this.game.playerFall(timeDelta);
    this.elapsedTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }
}


module.exports = GameView;
