const Player = require('./player');
const Obstacle = require('./obstacle');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.obstacles = [ new Obstacle(Game.width, Game.height) ];
    this.collided = this.collided.bind(this);
    this.collideWithCircle = this.collideWithCircle.bind(this);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.player.draw(ctx);
    this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
  }

  collided() {
    let collided;
    this.obstacles.forEach((obstacle) => {
      let that = this;
      // debugger
      if (that.collideWithCircle(obstacle)) {
        console.log('collided');
      }
    });
    return collided;
  }

  collideWithCircle(circleObstacle) {
    let collided;
    circleObstacle.arcs.forEach((arc) => {
      if (arc.checkCollision(this.player)) {
        collided = true;
      }
      // if (arc.checkTopCollision(this.player)) {
      //   collided = true;
      //
      // }
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
