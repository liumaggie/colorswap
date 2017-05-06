class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.clicked = 0;
  }

  start() {
    this.elapsedTime = 0;
    this.movePlayer();
    requestAnimationFrame(this.animate.bind(this));
  }

  movePlayer() {
    this.ctx.canvas.addEventListener("mousedown", () => {
      this.game.player.move();
      this.game.checkObstacles();
      this.clicked += 1;
    });
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    this.game.shiftObstacles();
    // this.game.collided();
    // setTimeout(() => {
    //   if (this.clicked < 2) {
        this.game.playerFall(timeDelta);
    //     this.clicked = 0;
    //   }
    // }, 40);
    this.elapsedTime = time;
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }
}


module.exports = GameView;
