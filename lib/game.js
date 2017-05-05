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
    const firstCircle = new Circle(Game.width/2, Game.height - 2*Game.height/3, 100);
    const firstColorSpinner = new ColorSpinner(this.centerX, this.centerY, 5, true);
    this.obstacles = [ firstCircle, firstColorSpinner];
    this.collided = this.collided.bind(this);
    this.collideWithCircle = this.collideWithCircle.bind(this);
    this.inObstacle = this.inObstacle.bind(this);
    this.isOutOfObstacle = this.isOutOfObstacle.bind(this);
    this.outOfObstacle = false;
    this.collideWithSpinner = false;
    this.counter = 0
  }

  createObstacle(result) {
    let newObs;
    if (result === 'circle') {
      newObs = new Circle(this.centerX, this.centerY, this.radius);
    } else if (result === 'rectangle') {
      newObs = new Rectangle(this.centerX, this.centerY, this.radius);
    } else {
      newObs = new Triangle(this.centerX, this.centerY, this.radius);
    }
    this.addObstacle(newObs);
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
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
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

  addObstacle(obs) {
    this.obstacles.push(obs);
    this.obstacles.push(new ColorSpinner(this.centerX, this.centerY - 200, 5, true));
  }

  removeObstacle() {
    if (this.obstacles[0].y >= Game.height - Game.height/5) {
      this.obstacles.shift();
    }
    // this.obstacles.forEach((obstacle) => {
    //   if (obstacle.y >= Game.height - Game.height/5) {
    //     console.log(this.obstacles);
    //     this.obstacles.shift();
    //     console.log(this.obstacles);
    //   }
    // });
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
      if (obstacle instanceof Circle) {
        if (that.collideWithCircle(obstacle)) {
          console.log('collided');
        }
      } else if (obstacle instanceof Rectangle || obstacle instanceof Triangle) {
        if (that.collideWith(obstacle)) {
          console.log('collided');
        }
      } else if (obstacle instanceof ColorSpinner) {
        if (that.isOutOfObstacle(obstacle)) {
            this.player.color = this.selectRandomColor();
            this.collideWithColor = true;
        }
      }
    });
    return collided;
  }

  collideWith(obstacle) {
    let collided;
    obstacle.lines.forEach((line) => {
      if (line.collision(this.player)) {
        collided = true;
      }
    });
    return collided;
  }

  collideWithCircle(circleObstacle, spinner) {
    let collided;
    circleObstacle.arcs.forEach((arc, spinner) => {
      if (arc.collision(this.player, spinner)) {
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
