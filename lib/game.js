const Player = require('./player');
const Obstacle = require('./obstacle');
const Rectangle = require('./rectangle');
const Circle = require('./circle');
const Triangle = require('./triangle');
const ColorSpinner = require('./color_spinner');
const Util = require('./util');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.centerX = Game.width/2;
    this.centerY = 0;
    this.radius = 100;
    const firstCircle = new Rectangle(Game.width/2, Game.height - 2*Game.height/3, 100);
    this.obstacles = [ firstCircle ];
    this.collided = this.collided.bind(this);
    this.inObstacle = this.inObstacle.bind(this);
    this.isOutOfObstacle = this.isOutOfObstacle.bind(this);
    this.outOfObstacle = false;
    this.collidedBefore = false;
    this.counter = 0
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

  isOutOfObstacle(obstacle) {
    if (this.player.y < obstacle.y - obstacle.radius) {
      return true;
    }
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

  checkObstacles() {
    this.counter += 1
    if (this.counter === 1000) { console.log(this.obstacles)};
    this.removeObstacle();
    this.obstacles.forEach((obstacle) => {
      if (this.player.y < Game.height/2 &&
          this.player.y > Game.height/2 - 50) {
            obstacle.shift();
          }
      else if (this.player.y < Game.height/2 &&
              this.player.y > Game.height/2 - 50) {
                obstacle.shift();
              }
    });
    if (this.obstacles.length <= 2) {
      this.selectRandomObstacle();
    }
  }

  selectRandomObstacle() {
    const obs = ['circle', 'rectangle', 'triangle'];
    const randomObs = obs[Math.floor(Math.random() * obs.length)];
    this.createObstacle(randomObs);
  }

  createObstacle(result) {
    const deltaY = 200;
    let newObs;
    if (result === 'circle') {
      newObs = new Circle(this.centerX, this.centerY - deltaY, this.radius);
    } else if (result === 'rectangle') {
      newObs = new Rectangle(this.centerX, this.centerY - deltaY, this.radius);
    } else {
      newObs = new Triangle(this.centerX, this.centerY - deltaY, this.radius, this.player.color);
    }
    this.addObstacle(newObs);
  }

  addObstacle(obs) {
    this.obstacles.push(new ColorSpinner(this.centerX, this.centerY, 5, true));
    this.obstacles.push(obs);
  }

  removeObstacle() {
    if (this.obstacles[0].y >= Game.height - Game.height/5) {
      this.obstacles.shift();
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
    let collided;
    const obs = obstacle.arcs ? obstacle.arcs : obstacle.lines;
    obs.forEach((segment, spinner) => {
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
