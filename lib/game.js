const Player = require('./player');
const Obstacle = require('./obstacle');
const Rectangle = require('./rectangle');
const Circle = require('./circle');
const Triangle = require('./triangle');
const ColorSpinner = require('./color_spinner');
const Star = require('./star');
const Util = require('./util');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.centerX = Game.width/2;
    this.centerY = 0;
    this.radius = 100;
    this.obsDistance = Game.height - 2*Game.height/3;
    console.log('constructor', this.obstacles)
    this.collided = this.collided.bind(this);
    this.inObstacle = this.inObstacle.bind(this);
    this.addFirstObstacles();
  }

  addFirstObstacles() {
    const firstCircle = new Circle(Game.width/2, this.obsDistance, 100);
    const firstStar = new Star(Game.width/2, this.obsDistance);
    this.obstacles = [ firstCircle, firstStar ];
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.obstacles.forEach((obstacle) => {
      obstacle.draw(ctx);
    });
    this.player.draw(ctx);
  }

  inObstacle() {
    for(let i=0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].y - this.obstacles[i].radius < this.player.y &&
        this.player.y < this.obstacles[i].y + this.obstacles[i].radius) {
        return true;
      }
    }
    return false;
  }

  shiftObstacles() {
    this.obstacles.forEach((obstacle) => {
      if (this.player.y < Game.height/2) {
        obstacle.shift(this.player);
      }
    });
  }

  addStar(x, y) {
    this.obstacles.push(new Star(x, y));
  }

  checkObstacles() {
    console.log('before', this.obstacles)
    if (this.obstacles.length <= 3) {
      this.addSpinner();
      const randomObs = this.selectRandomObstacle();
      const newObs = this.createObstacle(randomObs);
      this.addObstacle(newObs);
      this.addStar(newObs.x, newObs.y);
      console.log('creatingobs', this.obstacles)
    }
    this.removeObstacle();
  }

  selectRandomObstacle() {
    const obs = ['circle', 'rectangle', 'triangle'];
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
    } else {
      newObs = new Triangle(this.centerX, newCenterY, this.radius, this.player.color);
    }
    return newObs;
  }

  addSpinner() {
    const newCenterY = this.findNewCenterY();
    this.obstacles.push(new ColorSpinner(this.centerX, newCenterY, 5, true));
  }

  addObstacle(obs) {
    this.obstacles.push(obs);
  }

  removeObstacle() {
    const firstObs = this.obstacles[0];
    if (firstObs.y >= Game.height) {
      if (firstObs instanceof ColorSpinner) {
        this.obstacles.shift();
      } else {
        this.obstacles.shift();
        this.obstacles.shift();
      }
    }
  }

  colorsToArray() {
    return Object.values(Util.colors());
  }

  selectRandomColor() {
    const colors = this.colorsToArray();
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    while (this.player.color === randomColor) {
      randomColor = colors[Math.floor(Math.random() * colors.length)];
    }
    return randomColor;
  }

  collided() {
    let collided;
    let that = this;
    this.obstacles.forEach((obstacle) => {
      if (obstacle instanceof ColorSpinner) {
        if (this.collideWith(obstacle, true)) {
          this.player.color = this.selectRandomColor();
          const idx = this.obstacles.indexOf(obstacle);
          this.obstacles.splice(idx, 1);
        }
      } else {
        if (this.collideWith(obstacle)) {
          console.log('collided');
          collided = true;
        }
      }
    });
    return collided;
  }

  collideWith(obstacle, spinner) {
    let collided = false;
    let spinnerPresent = spinner;
    const obs = obstacle.arcs ? obstacle.arcs : obstacle.lines;
    obs.forEach((segment, spinnerPresent) => {
      if (segment.collision(this.player, spinner)) {
        collided = true;
      }
    });
    return collided;
  }

  playerFall(time) {
    if (this.player.falling) {
      this.player.fall(time);
    }
  }

}

Game.width = 600;
Game.height = 700;

module.exports = Game;
