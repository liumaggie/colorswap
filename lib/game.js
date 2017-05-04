const Player = require('./player');
const Obstacle = require('./obstacle');

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.obstacles = [ new Obstacle(Game.width, Game.height) ];
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.player.draw(ctx);
    this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
  }

  isCollided() {
    let collided;
    this.obstacles.forEach((obstacle) => {
      if (obstacle.y + obstacle.radius >=
        this.player.y - this.player.radius ) {
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
