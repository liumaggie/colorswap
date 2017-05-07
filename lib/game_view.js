const Circle = require('./circle');
const Game = require('./game');

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.circle1 = new Circle(Game.width/2 - 85, 80, 40);
    this.circle2 = new Circle(Game.width/2 + 85, 80, 40);
    this.onSplash = true;
  }

  start() {
    this.elapsedTime = 0;
    this.splash();
    this.addClickOnSplash();
    if (!this.onSplash) {
      this.game.addFirstObstacles();
      this.movePlayer();
    }
    requestAnimationFrame(this.splash.bind(this));
  }

  movePlayer() {
    this.game.player.move();
    this.game.addObstacles();
  }

  addMoveListener() {
    this.ctx.canvas.addEventListener("mousedown", this.movePlayer);
  }

  transitionFromSplash() {
    this.splash = false;
    this.ctx.canvas.removeEventListener("mousedown", this.transitionFromSplash);
    requestAnimationFrame(this.animate.bind(this));
  }

  addClickOnSplash() {
    this.ctx.canvas.addEventListener("mousedown", this.transitionFromSplash);
  }

  drawCircle() {
    this.circle1.draw(this.ctx);
    this.circle2.draw(this.ctx);
    requestAnimationFrame(this.drawCircle.bind(this));
  }

  splash() {
    // debugger
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.drawImage(img, 1, 1);
    };
    img.src = './images/splash.png';

    // this.drawScore(this.ctx);
    this.drawCircle();
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    if (this.game.gameover === true) {
      this.ctx.canvas.removeEventListener("mousedown", this.movePlayer);
      this.splash();
    } else {
      this.game.shiftObstacles();
      this.game.collided();
      this.game.playerFall(timeDelta);
      this.elapsedTime = time;
      this.game.checkIfPlayerFell();
      this.game.draw(this.ctx);
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}


module.exports = GameView;
