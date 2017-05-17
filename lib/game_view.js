const Circle = require('./shapes/circle');
const Game = require('./game');

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.onSplash = true;
    this.createSplashCircles();
    this.startGame = this.startGame.bind(this);
    this.addListenersToSplash = this.addListenersToSplash.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    this.checkKeyInSplash = this.checkKeyInSplash.bind(this);
    this.checkKeyForMove = this.checkKeyForMove.bind(this);
    this.checkKeyForRestart = this.checkKeyForRestart.bind(this);
  }

  createSplashCircles() {
    const circle1 = new Circle(Game.width/2 - 85, 80, 40);
    const circle2 = new Circle(Game.width/2 + 85, 80, 40);
    const circle3 = new Circle(Game.width/2, Game.height/2 + 40, 100);
    const circle4 = new Circle(Game.width/2, Game.height/2 + 40, 120, false, -0.03);
    const circle5 = new Circle(Game.width/2, Game.height/2 + 40, 80, false, -0.03);
    this.circles = [circle1, circle2, circle3, circle4, circle5];
  }

  start() {
    this.elapsedTime = 0;
    this.splash();
    this.addListenersToSplash();
  }

  splash() {
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.drawImage(img, 1, 1);
      this.drawBestScore();
    };
    img.src = './assets/splash.png';

    this.drawCircle();
  }

  drawBestScore() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = '#35E2F2';
    if (window.highestScore < 10) {
      this.ctx.fillText(`${window.highestScore}`, Game.width/2 - 6, Game.height/2 + 80);
    } else {
      this.ctx.fillText(`${window.highestScore}`, Game.width/2 - 12, Game.height/2 + 80);
    }
  }

  addListenersToSplash() {
    this.ctx.canvas.addEventListener("mousedown", this.startGame);
    window.addEventListener("keydown", this.checkKeyInSplash);
  }

  checkKeyInSplash(event) {
    if (event.keyCode === 13) {
      this.startGame();
    }
  }

  drawCircle() {
    this.circles.forEach((circle) => {
      circle.move();
      circle.draw(this.ctx);
    });
    if (this.onSplash) {
      requestAnimationFrame(this.drawCircle.bind(this));
    }
  }

  checkKeyForMove(event) {
    if (event.keyCode === 32) {
      this.movePlayer();
    }
  }

  movePlayer() {
    this.game.player.move();
  }

  addMoveListener() {
    this.ctx.canvas.addEventListener("mousedown", this.movePlayer);
    window.addEventListener("keydown", this.checkKeyForMove);
  }

  startGame() {
    this.game.gameover = false;
    this.onSplash = false;
    this.ctx.canvas.removeEventListener("mousedown", this.startGame);
    window.removeEventListener("keydown", this.checkKeyInSplash);
    this.addMoveListener();
    this.game.addFirstShapes();
    requestAnimationFrame(this.animate.bind(this));
  }

  createNewGame() {
    const game = new Game();
    new GameView(game, this.ctx).start();
  }

  lossSplash() {
    this.ctx.fillStyle = "#1c1c1c";
    this.ctx.fillRect(0, Game.height/4 + 50, Game.width, Game.height/3);
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "#8D13FC";
    this.ctx.fillText("You Lose!", Game.width/3 + 40, Game.height/2 - 60);
    this.ctx.fillStyle = "#35E2F2";
    this.ctx.fillText(`Your Score: ${this.game.score}`, Game.width/3 + 15, Game.height/2 - 20);
    this.ctx.fillStyle = "#F5DF0F";
    this.ctx.fillText(`Best Score: ${window.highestScore}`, Game.width/3 + 15, Game.height/2 + 20);
    this.ctx.fillStyle = "#FF0181";
    this.ctx.fillText('Press R to restart the game', Game.width/5, Game.height/2 + 60);
    window.addEventListener('keydown', this.checkKeyForRestart);
  }

  checkKeyForRestart(event) {
    if (event.keyCode === 82) {
      window.removeEventListener("keydown", this.checkKeyForRestart);
      this.createNewGame();
    }
  }

  checkScore() {
    if (this.game.score > window.highestScore) {
      window.highestScore = this.game.score;
    }
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    if (this.game.gameover === true) {
      this.checkScore();
      this.ctx.canvas.removeEventListener("mousedown", this.movePlayer);
      window.removeEventListener("keydown", this.checkKeyForMove);
      setTimeout(() => this.lossSplash(), 100);
    } else {
      this.game.loop();
      this.game.playerFall(timeDelta);
      this.elapsedTime = time;
      this.game.checkIfPlayerFell();
      this.game.draw(this.ctx);
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

module.exports = GameView;
