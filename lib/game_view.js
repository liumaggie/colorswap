class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.died = false;
  }

  start() {
    this.elapsedTime = 0;
    this.movePlayer();
    requestAnimationFrame(this.animate.bind(this));
  }

  movePlayer() {
    this.ctx.canvas.addEventListener("mousedown", () => {
      console.log('move')
      this.game.player.move();
    });
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    // this.game.checkObstacles();
    if (this.died) {
      debugger
    }
    this.died = this.game.collided();
    this.game.playerFall(timeDelta);
    this.elapsedTime = time;
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }
}


module.exports = GameView;
