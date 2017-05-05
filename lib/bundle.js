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
const Rectangle = __webpack_require__(7);
const Circle = __webpack_require__(9);
const Triangle = __webpack_require__(10);

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    // this.obstacles = [ new Circle(Game.width/2, Game.height - 2*Game.height/3) ];
    this.obstacles = [ new Rectangle(Game.width/2, Game.height - 2*Game.height/3) ];
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
        // this.addObstacle();
      }
      obstacle.draw(ctx);
    });
    // this.removeObstacle();
    this.player.draw(ctx);
  }

  addObstacle() {
    this.obstacles.push(new Circle(Game.width/2, 0));
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
    }
  }

  move() {
    this.y = this.y - this.deltaY;
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
const Util = __webpack_require__(6);

class Obstacle {
  constructor(centerX, centerY) {
    this.x = centerX;
    this.y = centerY;
    this.radius = 100;
  }

  shift() {
    this.y += 3;
    // this.arcs.forEach((arc) => {
    //   arc.center = [this.x, this.y];
    // });
  }

  // draw(ctx) {
  //   this.arcs.forEach((arc) => {
  //     arc.rotate();
  //     arc.draw(ctx);
  //   });
  // }
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
  }

  edgeDetection(playerYTop, playerYBottom, circleY) {
    return (Util.edgeDetection(playerYTop, circleY) ||
        Util.edgeDetection(playerYBottom, circleY));
  }

  checkCollision(angle, circleY, player) {
    // arc positions
    this.adjustedStart = this.start % (2*Math.PI);
    this.adjustedEnd = this.end % (2*Math.PI);

    const playerYTopCoord = player.y - player.radius;
    const playerYBottomCoord = player.y + player.radius;

    if (this.adjustedStart > angle && angle > this.adjustedEnd &&
      this.color !== player.color &&
      this.edgeDetection(playerYTopCoord, playerYBottomCoord, circleY)) {
        return true;
      }
  }

  collision(player) {
    // y coordinate collision with player
    this.yAtCircleBottom = Util.pointOnCircle(this.center, this.radius, Math.PI/2)[1];
    this.yAtCircleTop = Util.pointOnCircle(this.center, this.radius, 3*Math.PI/2)[1];

    // checks for top and bottom collision
    if (this.checkCollision(3*Math.PI/2, this.yAtCircleTop, player) ||
      (this.checkCollision(Math.PI/2, this.yAtCircleBottom, player))) {
        return true;
      }
    return false;
  }

  rotate() {
    this.start += 0.01;
    this.end += 0.01;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.center[0], this.center[1], this.radius, this.start, this.end, true);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10;
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
    if (x <= y + delta && x >= y - delta) return true;
  },

  colors() {
    return {
      'blue': '#b0e5f6',
      'purple': '#baade6',
      'green': '#8ae1c0',
      'yellow': '#f3f485'
    };
  },
  pointOnSquare(start, end, center) {
    const x1 = center[0];

    // find slope of current line
    const m = (end[1] - start[1]) / (end[0] - start[0]);
    // find intercept of current line
    const b = -(m * start[0]) + start[1];
    // find intersecting point
    const y1 = m * x1 + b;
    return [x1, y1];
  },
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((y2 - y2), 2) + Math.pow((x2 - x1), 2));
  }
};

module.exports = Util;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Line = __webpack_require__(8);
const Util = __webpack_require__(6);
const Obstacle = __webpack_require__(4);

class Rectangle extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    // this.x = centerX;
    // this.y = centerY;
    this.radius = 100;
    this.counter = 0;
    this.lines = [
      new Line(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Line(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Line(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().green),
      new Line(this.x, this.y, this.radius, Math.PI/2, 0, Util.colors().yellow)
    ];
  }


  draw(ctx) {
    // this.counter += 1;
    // if (this.counter % 1000 === 0) { debugger }
    this.lines.forEach((line) => {
      line.rotate();
      line.calculateStart();
      line.draw(ctx);
    });
  }
}

module.exports = Rectangle;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(6);

class Line {
  constructor(x, y, radius, start, end, color) {
    this.center = [x, y];
    this.radius = radius;
    // arc angles
    this.start = start;
    this.end = end;
    this.color = color;
    this.counter = 0;
    this.calculateStart();
  }

  rotate() {
    this.start += 0.01;
    this.end += 0.01;
  }

  // collision(player) {
  //   const start = [this.startX, this.startY];
  //   const end = [this.endX, this.endY];
  //   const point = Util.pointOnSquare(start, end, this.center);
  //   // debugger
  //   if (this.startX < point[0] && point[0] < this.endX &&
  //       this.startY < point[1] && point[1] < this.endY &&
  //       this.color !== player.color) {
  //         return true;
  //       }
  // }
  collision(player) {
    // this.counter = 0
    const squareLeft = this.startX;
    const squareTop = this.startY;
    const width = Util.distance(this.startX, this.startY, this.endX, this.endY);
    const height = 10;
    this.counter += 1
    // this.checkCollision(player, width, height);
    // calculates distance between circle and square
    const distanceX = Math.abs(player.x - squareLeft);
    const distanceY = Math.abs(player.y - squareTop);
    if (distanceX > (width/2 + player.radius)) {
      // debugger
      return false; }
    if (distanceY > (height/2 + player.radius)) { return false; }
    if (distanceX <= width/2 && player.color !== this.color) {
      // debugger
      return true;
    }
    if (distanceY <= height/2 && player.color !== this.color) { return true; }

    // const cornerDistance = (Math.pow((distanceX - width/2), 2) +
    //                         Math.pow((distanceY - height/2), 2));
    // return (cornerDistance >= Math.pow(player.radius, 2) );
  }

  calculateStart() {
    this.startX = this.center[0] + this.radius * Math.cos(this.start);
    this.startY = this.center[1] + this.radius * Math.sin(this.start);
    this.endX = this.center[0] + this.radius * Math.cos(this.end);
    this.endY = this.center[1] + this.radius * Math.sin(this.end);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10;
    ctx.stroke();

  }
}

module.exports = Line;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Arc = __webpack_require__(5);
const Util = __webpack_require__(6);
const Obstacle = __webpack_require__(4);

class Circle extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);

    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().green),
      new Arc(this.x, this.y, this.radius, Math.PI/2, 0, Util.colors().yellow)
    ];

  }

  shift() {
    this.y += 3;
    this.arcs.forEach((arc) => {
      arc.center = [this.x, this.y];
    });
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.rotate();
      arc.draw(ctx);
    });
  }
}

module.exports = Circle;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Obstacle = __webpack_require__(4);
const Line = __webpack_require__(8);
const Util = __webpack_require__(6);

class Triangle extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 100;

    this.lines = [
      new Line(this.x, this.y, this.radius, 0, 2*Math.PI/3, Util.colors().blue),
      new Line(this.x, this.y, this.radius, 2*Math.PI/3, 4*Math.PI/3, Util.colors().purple),
      new Line(this.x, this.y, this.radius, 4*Math.PI/3, 0, Util.colors().green),
    ]
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.rotate();
      line.calculateStart();
      line.draw(ctx);
    });
  }
}

module.exports = Triangle;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map