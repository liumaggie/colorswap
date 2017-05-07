const Circle = require('./circle');
const Game = require('./game');

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.circle1 = new Circle(Game.width/2 - 85, 80, 40);
    this.circle2 = new Circle(Game.width/2 + 85, 80, 40);
    this.onSplash = true;
    this.startGame = this.startGame.bind(this);
    this.addClickOnSplash = this.addClickOnSplash.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
  }

  start() {
    this.elapsedTime = 0;
    this.splash();
    this.addClickOnSplash();
  }

  splash() {
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.drawImage(img, 1, 1);
    };
    img.src = './images/splash.png';

    this.drawCircle();
  }

  addClickOnSplash() {
    this.ctx.canvas.addEventListener("mousedown", this.startGame);
  }

  drawCircle() {
    this.circle1.draw(this.ctx);
    this.circle2.draw(this.ctx);
    if (this.onSplash) {
      requestAnimationFrame(this.drawCircle.bind(this));
    }
  }

  movePlayer() {
    this.game.player.move();
    this.game.addObstacles();
  }

  addMoveListener() {
    this.ctx.canvas.addEventListener("mousedown", this.movePlayer);
  }

  startGame() {
    this.game.gameover = false;
    this.onSplash = false;
    this.ctx.canvas.removeEventListener("mousedown", this.startGame);
    this.addMoveListener();
    this.game.addFirstObstacles();
    requestAnimationFrame(this.animate.bind(this));
  }

  renderLost() {
    this.ctx.rect(0, Game.height/3, Game.width, Game.height/4);
  }

  createNewGame() {
    const game = new Game();
    new GameView(game, this.ctx).start();
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    if (this.game.gameover === true) {
      this.ctx.canvas.removeEventListener("mousedown", this.movePlayer);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(0, Game.height/3, Game.width, Game.height/4);
      setTimeout(() => this.createNewGame(), 10000);
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
