const Game = require('./game');
const GameView = require('./game_view');


document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("game-canvas");

  window.highestScore = 0;
  const ctx = canvas.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();

  const music = new Audio('./assets/soundtrack.m4a');
  music.addEventListener("ended", () => {
    this.play();
  }, false);
  music.play();

  window.addEventListener('keydown', checkKeyPress);

  function checkKeyPress(event) {
    if (event.keyCode === 77) {
      if (music.paused) {
        music.play();
      } else {
        music.pause();
      }
    }
  }
});
