/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);
const GameView = __webpack_require__(2);

document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("game-canvas");

  const ctx = canvas.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Player = __webpack_require__(3);
const Obstacle = __webpack_require__(4);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    this.elapsedTime = 0;
    this.movePlayer();
    requestAnimationFrame(this.animate.bind(this));
  }

  movePlayer() {
    this.ctx.canvas.addEventListener("mousedown", () => {
      this.game.player.move();
    });
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    this.game.draw(this.ctx);
    this.game.collided();
    this.game.playerFall(timeDelta);
    this.elapsedTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }
}


module.exports = GameView;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

class Player {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;
    // initial position of player
    this.x = this.gameWidth/2;
    this.y = this.gameHeight-this.gameHeight/5;
    this.radius = 10;
    this.velocity = 1.5;
    this.falling = false;
    this.deltaY = 60;
    this.color = "#b0e5f6";
  }

  fall(time) {
    this.y = (this.velocity * time/(1000/60)) + this.y;
    if (this.y >= this.gameHeight-this.gameHeight/5) {
      this.falling = false;
      // this.startingY = this.y;
    }
  }

  move() {
    this.y = this.y - this.deltaY;

    // if (this.y + this.deltaY >= this.startingY) {
    //   this.startingY = this.y;
      this.falling = true;

  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "#b0e5f6";
    ctx.fill();
  }

}

module.exports = Player;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Arc = __webpack_require__(5);

class Obstacle {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;

    this.x = this.gameWidth/2;
    this.y = this.gameHeight-2*this.gameHeight/3;
    this.radius = 100;
    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, "#b0e5f6"),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, "#baade6"),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, "#8ae1c0"),
      new Arc(this.x, this.y, this.radius, Math.PI/2, 0, "#f3f485")
    ];

  }

  createArc(start, end, color, ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, start, end);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.rotate();
      arc.draw(ctx);
    });
  }
}

module.exports = Obstacle;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(6);

class Arc {
  constructor(x, y, radius, start, end, color) {
    this.center = [x, y];
    this.radius = radius;
    // arc angles
    this.start = start;
    this.end = end;
    this.color = color;
    // y coordinate at bottom of circle
    this.yAtCircleBottom = Util.pointOnCircle(this.center, this.radius, Math.PI/2)[1];
    this.yAtCircleTop = Util.pointOnCircle(this.center, this.radius, 3*Math.PI/2)[1];
  }

  edgeDetection(playerYTop, playerYBottom, circleY) {
    return (Util.edgeDetection(playerYTop, circleY) ||
        Util.edgeDetection(playerYBottom, circleY));
  }

  checkCollision(player) {
    // arc positions
    let collided;
    this.adjustedStart = this.start % (2*Math.PI);
    this.adjustedEnd = this.end % (2*Math.PI);
    // y coordinate collision with player
    const playerAngle = Math.PI/2;
    const playerYTopCoord = player.y - player.radius;
    const playerYBottomCoord = player.y + player.radius;

    if (this.adjustedStart > playerAngle > this.adjustedEnd
          && this.color !== player.color
          && this.edgeDetection(playerYTopCoord, playerYBottomCoord, this.yAtCircleBottom) ||
              this.edgeDetection(playerYTopCoord, playerYBottomCoord, this.yAtCircleTop))
           {
      collided = true;
    }
    // }
    return collided;
  }

  rotate() {
    this.start += 0.01;
    this.end += 0.01;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.center[0], this.center[1], this.radius, this.start, this.end, true);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

module.exports = Arc;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

const Util = {
  pointOnCircle(center, radius, angle) {
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    return [x, y];
  },

  edgeDetection(x, y) {
    const delta = 5;
    // debugger
    // console.log(x, y);
    if (x <= y + delta && x >= y - delta) return true;
  }
};

module.exports = Util;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map