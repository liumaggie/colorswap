class Game {

  draw(ctx) {
    ctx.fillRect(Game.width/1.5, 0, Game.width, Game.height);
  }
}

Game.width = 600;
Game.height = 700;

module.exports = Game;
