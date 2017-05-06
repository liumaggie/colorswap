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
const ColorSpinner = __webpack_require__(11);
const Star = __webpack_require__(12);
const Util = __webpack_require__(6);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.clicked = 0;
  }

  start() {
    this.elapsedTime = 0;
    this.movePlayer();
    requestAnimationFrame(this.animate.bind(this));
  }

  movePlayer() {
    this.ctx.canvas.addEventListener("mousedown", () => {
      this.game.player.move();
      this.game.checkObstacles();
      this.clicked += 1;
    });
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    this.game.shiftObstacles();
    // this.game.collided();
    // setTimeout(() => {
    //   if (this.clicked < 2) {
        this.game.playerFall(timeDelta);
    //     this.clicked = 0;
    //   }
    // }, 40);
    this.elapsedTime = time;
    this.game.draw(this.ctx);
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
    this.velocity = 2.5;
    this.falling = false;
    this.deltaY = 50;
    this.color = "#b0e5f6";
  }

  fall(time) {
    this.y = (this.velocity * time/(1000/60)) + this.y;
    if (this.y >= this.gameHeight-this.gameHeight/5) {
      this.falling = false;
    }
  }

  move(time) {
    // this.y = (this.velocity * time/(1000/60)) + this.y;
    this.y = this.y - this.deltaY;
    this.falling = true;
  }

  draw(ctx) {
    ctx.save();
    // creates shadow when jumping
    if (this.y < this.gameHeight-this.gameHeight/5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y - 10, this.radius, 0, Math.PI * 2, true);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 0.4;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

}

module.exports = Player;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Arc = __webpack_require__(5);
const Util = __webpack_require__(6);
const Line = __webpack_require__(8);

class Obstacle {
  constructor(centerX, centerY, radius) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.rotatingAngle = 0.03;
  }

  createLine(start, end, color) {
    return new Line(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  createArc(start, end, color) {
    return new Arc(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  shift(player) {
    this.y += 2;
    if (this.arcs) {
      this.arcs.forEach((arc) => {
        arc.center = [this.x, this.y];
      });
    } else if (this.lines) {
        this.lines.forEach((line) => {
          line.center = [this.x, this.y];
      });
    }
  }
}

module.exports = Obstacle;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(6);

class Arc {
  constructor(x, y, radius, start, end, color, angle) {
    this.center = [x, y];
    this.radius = radius;
    // arc angles
    this.start = start;
    this.end = end;
    this.color = color;
    this.rotatingAngle = angle;
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
    return false;
  }

  collision(player, spinner) {
    // y coordinate collision with player
    this.yAtCircleBottom = Util.pointOnCircle(this.center, this.radius, Math.PI/2)[1];
    this.yAtCircleTop = Util.pointOnCircle(this.center, this.radius, 3*Math.PI/2)[1];

    // checks for top and bottom collision
    if (spinner === true) {
      return this.edgeDetection(player.y - player.radius, player.y + player.radius, this.yAtCircleBottom);
    } else {
      if (this.checkCollision(3*Math.PI/2, this.yAtCircleTop, player) ||
      (this.checkCollision(Math.PI/2, this.yAtCircleBottom, player))) {
        return true;
      }
    }
    return false;
  }

  rotate() {
    this.start += this.rotatingAngle;
    this.end += this.rotatingAngle;
  }

  draw(ctx, spinner) {
    ctx.beginPath();
    if (spinner) {
      ctx.arc(this.center[0], this.center[1], this.radius, this.start, this.end, true);
      ctx.lineWidth = 10;
    } else {
      ctx.arc(this.center[0], this.center[1], this.radius, this.start, this.end, true);
      ctx.lineWidth = 10;
    }
    ctx.strokeStyle = this.color;
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
    return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
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
    this.radius = 100;
    this.counter = 0;
    this.lines = [
      this.createLine(0, Math.PI/2, Util.colors().blue),
      this.createLine(Math.PI/2, Math.PI, Util.colors().purple),
      this.createLine(Math.PI, 3*Math.PI/2, Util.colors().green),
      this.createLine(3*Math.PI/2, 2*Math.PI, Util.colors().yellow)
    ];
  }

  draw(ctx) {
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
  constructor(x, y, radius, start, end, color, angle) {
    this.center = [x, y];
    this.radius = radius;
    // arc angles
    this.start = start;
    this.end = end;
    this.color = color;
    this.rotatingAngle = angle;
    this.calculateStart();
  }

  rotate() {
    this.start += this.rotatingAngle;
    this.end += this.rotatingAngle;
  }

  collision(player) {
    const start = this.start % (2*Math.PI);
    const circle = player;

    const theta = (this.start/2 + this.end/2) % (2*Math.PI)
    const rect = {
      rotation: (Math.PI/2 - theta) % (2*Math.PI),
      width: Util.distance(this.startX, this.startY, this.endX, this.endY),
      height:10,
      x: (this.endX + this.startX)/2,
      y: (this.endY + this.startY)/2
    };

    if (this.collideCircleWithRotatedRectangle(circle, rect) &&
        this.color !== player.color) {
      return true;
    }
    return false;
  }

  collideCircleWithRotatedRectangle(circle, rect) {

  	var rectCenterX = rect.x;
  	var rectCenterY = rect.y;

  	var rectX = rectCenterX - rect.width / 2;
  	var rectY = rectCenterY - rect.height / 2;

  	var rectReferenceX = rectX;
  	var rectReferenceY = rectY;

  	// Rotate circle's center point back
  	var unrotatedCircleX = Math.cos( rect.rotation ) * ( circle.x - rectCenterX ) - Math.sin( rect.rotation ) * ( circle.y - rectCenterY ) + rectCenterX;
  	var unrotatedCircleY = Math.sin( rect.rotation ) * ( circle.x - rectCenterX ) + Math.cos( rect.rotation ) * ( circle.y - rectCenterY ) + rectCenterY;

  	// Closest point in the rectangle to the center of circle rotated backwards(unrotated)
  	var closestX, closestY;

  	// Find the unrotated closest x point from center of unrotated circle
  	if ( unrotatedCircleX < rectReferenceX ) {
  		closestX = rectReferenceX;
  	} else if ( unrotatedCircleX > rectReferenceX + rect.width ) {
  		closestX = rectReferenceX + rect.width;
  	} else {
  		closestX = unrotatedCircleX;
  	}

  	// Find the unrotated closest y point from center of unrotated circle
  	if ( unrotatedCircleY < rectReferenceY ) {
  		closestY = rectReferenceY;
  	} else if ( unrotatedCircleY > rectReferenceY + rect.height ) {
  		closestY = rectReferenceY + rect.height;
  	} else {
  		closestY = unrotatedCircleY;
  	}

  	// Determine collision
  	var collision = false;
  	var distance = this.getDistance( unrotatedCircleX, unrotatedCircleY, closestX, closestY );

  	if ( distance < circle.radius ) {
  		collision = true;
  	}
  	else {
  		collision = false;
  	}

  	return collision;
  }

  getDistance( fromX, fromY, toX, toY ) {
  	var dX = Math.abs( fromX - toX );
  	var dY = Math.abs( fromY - toY );

  	return Math.sqrt( ( dX * dX ) + ( dY * dY ) );
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
  constructor(centerX, centerY, radius, spinner) {
    super(centerX, centerY, radius);
    this.spinner = spinner;
    this.arcs = [
      this.createArc(0, 3*Math.PI/2, Util.colors().blue),
      this.createArc(3*Math.PI/2, Math.PI, Util.colors().purple),
      this.createArc(Math.PI, Math.PI/2, Util.colors().green),
      this.createArc(Math.PI/2, 2*Math.PI, Util.colors().yellow),
    ];
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      if (!this.spinner) {
        arc.rotate();
      }
      arc.draw(ctx, this.spinner);
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
  constructor(centerX, centerY, radius, color) {
    super(centerX, centerY, radius);
    this.radius = 100;
    this.color = color;
    this.selectedColors = this.selectRandomColors();
    this.lines = [
      this.createLine(0, 2*Math.PI/3, this.selectedColors[0]),
      this.createLine(2*Math.PI/3, 4*Math.PI/3, this.selectedColors[1]),
      this.createLine(4*Math.PI/3, 2*Math.PI, this.selectedColors[2])
    ];
  }

  selectRandomColors() {
    const colors = Object.values(Util.colors());
    const playerIdx = colors.indexOf(this.color);
    colors.splice(playerIdx, 1);
    return colors;
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


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(6);
const Arc = __webpack_require__(5);
const Obstacle = __webpack_require__(4);

class ColorSpinner extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 5;
    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().green),
      new Arc(this.x, this.y, this.radius, Math.PI/2, 0, Util.colors().yellow)
    ];
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.draw(ctx, true);
    });
  }
}

module.exports = ColorSpinner;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const Obstacle = __webpack_require__(4);

class Star extends Obstacle {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.image = new Image();
    this.length = 30;
    this.angle = 0;
  }

  rotate(ctx) {
    const offset = this.length / 2;
    ctx.save();
    ctx.translate(this.x, this.y);
    this.angle -= this.rotatingAngle;
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -offset, -offset, this.length, this.length);
    ctx.restore();
  }


  draw(ctx) {
    ctx.save();
    // ctx.translate(this.x - this.length/2, this.y - this.length/2);
    // ctx.rotate(0.5);
    ctx.drawImage(this.image,
                  -this.length/2,
                  -this.length/2,
                  this.length,
                  this.length);
    this.image.src = './images/star.png';
    this.rotate(ctx);
    ctx.restore();
  }
}

module.exports = Star;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map