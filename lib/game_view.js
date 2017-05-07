const Circle = require('./circle');
const Game = require('./game');

window.highestScore = 0;
localStorage.setItem('highestScore', JSON.stringify(window.highestScore));

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.circle1 = new Circle(Game.width/2 - 85, 80, 40);
    this.circle2 = new Circle(Game.width/2 + 85, 80, 40);
    this.circle3 = new Circle(Game.width/2, Game.height/2 + 40, 100);
    this.circle4 = new Circle(Game.width/2, Game.height/2 + 40, 120, false, -0.03);
    this.circle5 = new Circle(Game.width/2, Game.height/2 + 40, 80, false, -0.03);
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
      this.drawBestScore();
    };
    img.src = './images/splash.png';

    this.drawCircle();
  }

  drawBestScore() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = '#35E2F2';
    this.ctx.fillText(`${localStorage.getItem('highestScore')}`, Game.width/2 - 6, Game.height/2 + 80);
  }

  addClickOnSplash() {
    this.ctx.canvas.addEventListener("mousedown", this.startGame);
  }

  drawCircle() {
    this.circle1.draw(this.ctx);
    this.circle2.draw(this.ctx);
    this.circle3.draw(this.ctx);
    this.circle4.draw(this.ctx);
    this.circle5.draw(this.ctx);
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

  loseSplash() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, Game.height/3, Game.width, Game.height/4);
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "#8D13FC";
    this.ctx.fillText("You Lose!", Game.width/3 + 40, Game.height/2 - 60);
    this.ctx.fillText(`Your Score: ${this.game.score}`, Game.width/3 + 15, Game.height/2 - 20);
    this.ctx.fillText(`Best Score: ${localStorage.getItem('highestScore')}`, Game.width/3 + 15, Game.height/2 + 20);
    setTimeout(() => this.createNewGame(), 5000);
  }

  checkScore() {
    if (this.game.score > window.highestScore) {
      window.highestScore = this.game.score;
      localStorage.setItem('highestScore', JSON.stringify(window.highestScore));
    }
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    if (this.game.gameover === true) {
      this.checkScore();
      this.ctx.canvas.removeEventListener("mousedown", this.movePlayer);
      setTimeout(() => this.loseSplash(), 100);
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
