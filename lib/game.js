const Player = require('./player');
const Obstacle = require('./obstacle');
const Rectangle = require('./rectangle');
const Circle = require('./circle');
const Triangle = require('./triangle');
const DoubleCircle = require('./double_circle');
const ColorSpinner = require('./color_spinner');
const Star = require('./star');
const LineObstacle = require('./line_obstacle');
const Util = require('./util');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.centerX = Game.width/2;
    this.centerY = 0;
    this.radius = 100;
    this.obsDistance = Game.height/4;
    this.collided = this.collided.bind(this);
    // game start when player reaches half the height of canvas
    this.started = false;
    this.score = 0;
    this.gameover = false;
  }

  addFirstObstacles() {
    const firstCircle = new Circle(Game.width/2, Game.height/3, this.radius);
    const firstStar = new Star(Game.width/2, Game.height/3);
    this.obstacles = [ firstCircle, firstStar ];
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#292929";
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.drawScore(ctx);
    this.obstacles.forEach((obstacle) => {
      obstacle.draw(ctx);
    });
    this.player.draw(ctx);
  }

  drawScore(ctx) {
    ctx.font = "100px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${this.score}`, 30, 100);
  }

  shiftObstacles() {
    this.obstacles.forEach((obstacle) => {
      if (this.player.y < 2*Game.height/3) {
        obstacle.shift(this.player);
      }
    });
  }

  addStar(x, y) {
    this.obstacles.push(new Star(x, y));
  }

  addObstacles() {
    // checks to see that player is in first obstacle
    // player can fall out of the obstacle and lose
    if (this.player.y < Game.height/2) { this.started = true; }
    if (this.obstacles.length <= 10) {
      this.addSpinner();
      const randomObs = this.selectRandomObstacle();
      const newObs = this.createObstacle(randomObs);
      this.addObstacle(newObs);
      this.addStar(newObs.x, newObs.y);
    }
    this.removeObstacle();
  }

  selectRandomObstacle() {
    const obs = ['circle', 'rectangle', 'triangle', 'doubleCircle', 'lineObstacle'];
    const randomObs = obs[Math.floor(Math.random() * obs.length)];
    return randomObs;
  }

  findNewCenterY() {
    const lastObs = this.obstacles[this.obstacles.length - 1];
    return lastObs.y - this.obsDistance;
  }

  createObstacle(result) {
    let newObs;
    const newCenterY = this.findNewCenterY();
    if (result === 'circle') {
      newObs = new Circle(this.centerX, newCenterY, this.radius);
    } else if (result === 'rectangle') {
      newObs = new Rectangle(this.centerX, newCenterY, this.radius);
    } else if (result === 'triangle') {
      newObs = new Triangle(this.centerX, newCenterY, this.radius, this.player.color);
    } else if (result === 'doubleCircle') {
      newObs = new DoubleCircle(this.centerX, newCenterY, this.radius, this.player.color);
    } else if (result === 'lineObstacle') {
      newObs = new LineObstacle(this.centerX, newCenterY, this.radius);
    }
    return newObs;
  }

  addSpinner() {
    const newCenterY = this.findNewCenterY();
    this.obstacles.push(new ColorSpinner(this.centerX, newCenterY));
  }

  addObstacle(obs) {
    this.obstacles.push(obs);
  }

  removeObstacle() {
    const firstObs = this.obstacles[0];
    if (firstObs.y >= Game.height) {
      this.obstacles.shift();
    }
  }

  moveObstacles() {
    this.obstacles.forEach((obstacle) => {
      if (!(obstacle instanceof Star) && !(obstacle instanceof ColorSpinner)) {
        obstacle.move();
      }
    });
  }

  remove(obstacle) {
    const idx = this.obstacles.indexOf(obstacle);
    this.obstacles.splice(idx, 1);
  }

  selectRandomColor(obstacle) {
    let colors;
    if (obstacle instanceof DoubleCircle) {
      colors = [Util.colors().purple, Util.colors().yellow];
    } else {
      colors = Util.colorsToArray();
    }
    console.log(colors);
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    while (this.player.color === randomColor) {
      randomColor = colors[Math.floor(Math.random() * colors.length)];
    }
    return randomColor;
  }


  // finds double circle idx after spinner in the obstacles array so the
  // player's color can match the top and bottom circle color (purple/yellow)
  findDoubleCircle(spinner) {
    const spinnerIdx = this.obstacles.indexOf(spinner);
    const doubleCircleIndices = [];
    this.obstacles.forEach((obstacle) => {
      if (obstacle instanceof DoubleCircle) {
        doubleCircleIndices.push(this.obstacles.indexOf(obstacle));
        console.log(doubleCircleIndices)
      }
    });
    if (doubleCircleIndices.includes(spinnerIdx + 1)) {
      return this.obstacles[spinnerIdx + 1];
    }
  }

  collided() {
    this.obstacles.forEach((obstacle) => {
      if (obstacle instanceof ColorSpinner) {
        if (this.collideWith(obstacle, true)) {
          const doubleCircle = this.findDoubleCircle(obstacle);
          this.player.color = this.selectRandomColor(doubleCircle);
          this.remove(obstacle);
        }
      } else if (obstacle instanceof Star) {
        if (obstacle.collision(this.player)) {
          this.score += 1;
          this.remove(obstacle);
        }
      } else {
        if (this.collideWith(obstacle)) {
          this.gameover = true;
        }
      }
    });
  }

  collideWith(obstacle, spinner) {
    let collided = false;
    let spinnerPresent = spinner;
    const obs = obstacle.arcs ? obstacle.arcs : obstacle.lines;
    obs.forEach((segment) => {
      if (segment.collision(this.player, spinnerPresent)) {
        collided = true;
      }
    });
    return collided;
  }

  playerFall(time) {
    if (this.player.moving) { this.player.checkMove(); }
    if (this.started && this.player.falling) {
      this.player.fall(time, true);
    } else if (this.player.falling) {
      this.player.fall(time, false);
    }
  }

  checkIfPlayerFell() {
    if (this.player.y > Game.height) {
      this.gameover = true;
    }
  }

}

Game.width = 600;
Game.height = 700;

module.exports = Game;
