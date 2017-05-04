const Player = require('./player');
const Obstacle = require('./obstacle');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.obstacles = [ new Obstacle(Game.width/2, Game.height - 2*Game.height/3) ];
    this.collided = this.collided.bind(this);
    this.collideWithCircle = this.collideWithCircle.bind(this);
    this.inObstacle = this.inObstacle.bind(this);
    this.isOutOfObstacle = this.isOutOfObstacle.bind(this);
    this.outOfObstacle = false;
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
      if (this.player.y < Game.height/2 &&
          this.player.y > Game.height/2 - 50) {
            obstacle.shift();
          }
      else if (this.player.y < Game.height/2 &&
              this.player.y > Game.height/2 - 50) {
                obstacle.shift();
              }
      else if (this.isOutOfObstacle(obstacle) && this.obstacles.length <= 2) {
        this.addObstacle();
      }
      obstacle.draw(ctx);
    });
    this.removeObstacle();
    this.player.draw(ctx);
  }

  addObstacle() {
    this.obstacles.push(new Obstacle(Game.width/2, 0));
  }

  removeObstacle() {
    this.obstacles.forEach((obstacle) => {
      if (obstacle.y >= Game.height - Game.height/5) {
        this.obstacles.shift();
      }
    });
  }

  collided() {
    let collided;
    this.obstacles.forEach((obstacle) => {
      let that = this;
      if (that.collideWithCircle(obstacle)) {
        console.log('collided');
      }
    });
    return collided;
  }

  collideWithCircle(circleObstacle) {
    let collided;
    circleObstacle.arcs.forEach((arc) => {
      if (arc.collision(this.player)) {
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
