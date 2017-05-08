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

  window.highestScore = 0;
  const ctx = canvas.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();

  const music = new Audio('./assets/soundtrack.m4a');
  music.addEventListener("ended", () => {
    music.play();
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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Player = __webpack_require__(3);
const Shape = __webpack_require__(18);
const Rectangle = __webpack_require__(19);
const Circle = __webpack_require__(16);
const Triangle = __webpack_require__(20);
const DoubleCircle = __webpack_require__(21);
const ColorSpinner = __webpack_require__(22);
const Star = __webpack_require__(23);
const LineObstacle = __webpack_require__(24);
const Util = __webpack_require__(6);

class Game {
  constructor() {
    this.player = new Player(Game.width, Game.height);
    this.centerX = Game.width/2;
    this.centerY = 0;
    this.radius = 100;
    this.obsDistance = Game.height/4;
    this.collided = this.collided.bind(this);
    // game start when player reaches half the height of canvas
    this.started = false;
    this.score = 0;
    this.gameover = false;
  }

  addFirstShapes() {
    const firstCircle = new Circle(Game.width/2, Game.height/3, this.radius);
    const firstStar = new Star(Game.width/2, Game.height/3);
    this.shapes = [ firstCircle, firstStar ];
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#292929";
    ctx.fillRect(0, 0, Game.width, Game.height);
    this.drawScore(ctx);
    this.shapes.forEach((shape) => {
      shape.draw(ctx);
    });
    this.player.draw(ctx);
  }

  drawScore(ctx) {
    ctx.font = "100px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${this.score}`, 30, 100);
  }

  shiftShapes() {
    this.shapes.forEach((shape) => {
      if (this.player.y < 2*Game.height/3) {
        shape.shift(this.player);
      }
    });
  }

  addStar(x, y) {
    this.shapes.push(new Star(x, y));
  }

  addShapes() {
    // checks to see that player is in first shape
    // player can fall out of the shape and lose
    if (this.player.y < Game.height/2) { this.started = true; }
    if (this.shapes.length <= 3) {
      this.addSpinner();
      const randomObs = this.selectRandomShape();
      const newObs = this.createShape(randomObs);
      this.addObstacle(newObs);
      this.addStar(newObs.x, newObs.y);
    }
  }

  removeShape() {
    const firstObs = this.shapes[0];
    if (firstObs.y >= Game.height) {
      this.shapes.shift();
    }
  }

  selectRandomShape() {
    const obs = ['circle', 'rectangle', 'triangle', 'doubleCircle', 'lineObstacle'];
    const randomObs = obs[Math.floor(Math.random() * obs.length)];
    return randomObs;
  }

  findNewCenterY() {
    const lastShape = this.shapes[this.shapes.length - 1];
    return lastShape.y - this.obsDistance;
  }

  createShape(result) {
    let newObs;
    const newCenterY = this.findNewCenterY();
    if (result === 'circle') {
      newObs = new Circle(this.centerX, newCenterY, this.radius);
    } else if (result === 'rectangle') {
      newObs = new Rectangle(this.centerX, newCenterY, this.radius);
    } else if (result === 'triangle') {
      newObs = new Triangle(this.centerX, newCenterY, this.radius, this.player.color);
    } else if (result === 'doubleCircle') {
      newObs = new DoubleCircle(this.centerX, newCenterY, this.radius, this.player.color);
    } else if (result === 'lineObstacle') {
      newObs = new LineObstacle(this.centerX, newCenterY, this.radius);
    }
    return newObs;
  }

  addSpinner() {
    const newCenterY = this.findNewCenterY();
    this.shapes.push(new ColorSpinner(this.centerX, newCenterY));
  }

  addObstacle(obs) {
    this.shapes.push(obs);
  }

  moveShapes() {
    this.shapes.forEach((shape) => {
      if (!(shape instanceof Star) && !(shape instanceof ColorSpinner)) {
        shape.move();
      }
    });
  }

  remove(shape) {
    const idx = this.shapes.indexOf(shape);
    this.shapes.splice(idx, 1);
  }

  selectRandomColor(shape) {
    let colors;
    if (shape instanceof DoubleCircle) {
      colors = [Util.colors().purple, Util.colors().yellow];
    } else {
      colors = Util.colorsToArray();
    }
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    while (this.player.color === randomColor) {
      randomColor = colors[Math.floor(Math.random() * colors.length)];
    }
    return randomColor;
  }


  // finds double circle idx after spinner in the obstacles array so the
  // player's color can match the top and bottom circle color (purple/yellow)
  findDoubleCircle(spinner) {
    const spinnerIdx = this.shapes.indexOf(spinner);
    const doubleCircleIndices = [];
    this.shapes.forEach((shape) => {
      if (shape instanceof DoubleCircle) {
        doubleCircleIndices.push(this.shapes.indexOf(shape));
      }
    });
    if (doubleCircleIndices.includes(spinnerIdx + 1)) {
      return this.shapes[spinnerIdx + 1];
    }
  }

  collided() {
    this.shapes.forEach((shape) => {
      if (shape instanceof ColorSpinner) {
        if (this.collideWith(shape, true)) {
          const doubleCircle = this.findDoubleCircle(shape);
          this.player.color = this.selectRandomColor(doubleCircle);
          this.remove(shape);
        }
      } else if (shape instanceof Star) {
        if (shape.collision(this.player)) {
          this.score += 1;
          this.remove(shape);
        }
      } else {
        if (this.collideWith(shape)) {
          this.gameover = true;
        }
      }
    });
  }

  collideWith(shape, spinner) {
    let collided = false;
    let spinnerPresent = spinner;
    const obs = shape.arcs ? shape.arcs : shape.lines;
    obs.forEach((segment) => {
      if (segment.collision(this.player, spinnerPresent)) {
        collided = true;
      }
    });
    return collided;
  }

  playerFall(time) {
    if (this.player.moving) { this.player.checkMove(); }
    if (this.started && this.player.falling) {
      this.player.fall(time, true);
    } else if (this.player.falling) {
      this.player.fall(time, false);
    }
  }

  checkIfPlayerFell() {
    if (this.player.y > Game.height) {
      this.gameover = true;
    }
  }

}

Game.width = 600;
Game.height = 700;

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Circle = __webpack_require__(16);
const Game = __webpack_require__(1);

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.onSplash = true;
    this.createSplashCircles();
    this.startGame = this.startGame.bind(this);
    this.addListenersToSplash = this.addListenersToSplash.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    this.checkKeyInSplash = this.checkKeyInSplash.bind(this);
    this.checkKeyForMove = this.checkKeyForMove.bind(this);
  }

  createSplashCircles() {
    const circle1 = new Circle(Game.width/2 - 85, 80, 40);
    const circle2 = new Circle(Game.width/2 + 85, 80, 40);
    const circle3 = new Circle(Game.width/2, Game.height/2 + 40, 100);
    const circle4 = new Circle(Game.width/2, Game.height/2 + 40, 120, false, -0.03);
    const circle5 = new Circle(Game.width/2, Game.height/2 + 40, 80, false, -0.03);
    this.circles = [circle1, circle2, circle3, circle4, circle5];
  }

  start() {
    this.elapsedTime = 0;
    this.splash();
    this.addListenersToSplash();
  }

  splash() {
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.drawImage(img, 1, 1);
      this.drawBestScore();
    };
    img.src = './assets/splash.png';

    this.drawCircle();
  }

  drawBestScore() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = '#35E2F2';
    if (window.highestScore < 10) {
      this.ctx.fillText(`${window.highestScore}`, Game.width/2 - 6, Game.height/2 + 80);
    } else {
      this.ctx.fillText(`${window.highestScore}`, Game.width/2 - 12, Game.height/2 + 80);
    }
  }

  addListenersToSplash() {
    this.ctx.canvas.addEventListener("mousedown", this.startGame);
    window.addEventListener("keydown", this.checkKeyInSplash);
  }

  checkKeyInSplash(event) {
    if (event.keyCode === 13) {
      this.startGame();
    }
  }

  drawCircle() {
    this.circles.forEach((circle) => {
      circle.move();
      circle.draw(this.ctx);
    });
    if (this.onSplash) {
      requestAnimationFrame(this.drawCircle.bind(this));
    }
  }

  checkKeyForMove(event) {
    if (event.keyCode === 32) {
      this.movePlayer();
    }
  }

  movePlayer() {
    this.game.player.move();
  }

  addMoveListener() {
    this.ctx.canvas.addEventListener("mousedown", this.movePlayer);
    window.addEventListener("keydown", this.checkKeyForMove);
  }

  startGame() {
    this.game.gameover = false;
    this.onSplash = false;
    this.ctx.canvas.removeEventListener("mousedown", this.startGame);
    window.removeEventListener("keydown", this.checkKeyInSplash);
    this.addMoveListener();
    this.game.addFirstShapes();
    requestAnimationFrame(this.animate.bind(this));
  }

  createNewGame() {
    const game = new Game();
    new GameView(game, this.ctx).start();
  }

  lossSplash() {
    this.ctx.fillStyle = "#1c1c1c";
    this.ctx.fillRect(0, Game.height/3, Game.width, Game.height/4);
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "#8D13FC";
    this.ctx.fillText("You Lose!", Game.width/3 + 40, Game.height/2 - 60);
    this.ctx.fillStyle = "#35E2F2";
    this.ctx.fillText(`Your Score: ${this.game.score}`, Game.width/3 + 15, Game.height/2 - 20);
    this.ctx.fillStyle = "#F5DF0F";
    this.ctx.fillText(`Best Score: ${window.highestScore}`, Game.width/3 + 15, Game.height/2 + 20);
    setTimeout(() => this.createNewGame(), 5000);
  }

  checkScore() {
    if (this.game.score > window.highestScore) {
      window.highestScore = this.game.score;
    }
  }

  animate(time) {
    const timeDelta = time - this.elapsedTime;
    if (this.game.gameover === true) {
      this.checkScore();
      this.ctx.canvas.removeEventListener("mousedown", this.movePlayer);
      window.removeEventListener("keydown", this.checkKeyForMove);
      setTimeout(() => this.lossSplash(), 100);
    } else {
      this.game.addShapes();
      this.game.moveShapes();
      this.game.shiftShapes();
      this.game.removeShape();
      this.game.collided();
      this.game.playerFall(timeDelta);
      this.elapsedTime = time;
      this.game.checkIfPlayerFell();
      this.game.draw(this.ctx);
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

module.exports = GameView;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(6);

class Player {
  constructor(width, height) {
    this.gameWidth = width;
    this.gameHeight = height;
    // initial position of player
    this.x = this.gameWidth/2;
    this.y = this.gameHeight-this.gameHeight/5;
    this.radius = 10;
    const colors = Util.colorsToArray();
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.moving = false;
    this.falling = false;
    this.moveVel = 0;
    this.fallVel = 0;
  }

  move() {
    this.fallVel = 0;
    this.moving = true;
    this.moveVel = 8;
  }

  checkMove() {
    this.y = this.y - this.moveVel;
    this.moveVel -= 1;
    if (this.moveVel === 0) {
      this.falling = true;
      this.moving = false;
      this.fallVel = 1;
    }
  }

  fall(time, gameStarted) {
    this.y += this.fallVel
    this.fallVel += 0.1;
    if (gameStarted === false) {
      if (this.y >= this.gameHeight - this.gameHeight/5) {
        // stop the falling
        this.falling = false;
      }
    }
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
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

const Util = {
  pointOnCircle(center, radius, angle) {
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    return [x, y];
  },

  edgeDetection(x, y) {
    const delta = 10;
    if (x <= y + delta && x >= y - delta) return true;
  },
  colors() {
    return {
      'blue': '#35E2F2',
      'purple': '#8D13FC',
      'pink': '#FF0181',
      'yellow': '#F5DF0F'
    };
  },
  colorsToArray() {
    return Object.values(Util.colors());
  },
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
  }
};

module.exports = Util;


/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Arc = __webpack_require__(15);
const Util = __webpack_require__(6);
const Shape = __webpack_require__(18);

class Circle extends Shape {
  constructor(centerX, centerY, radius, spinner, angle) {
    super(centerX, centerY, radius, angle);
    this.spinner = spinner;
    if (angle) {
      this.rotatingAngle = angle;
    }
    this.arcs = [
      this.createArc(Math.PI/4, 7*Math.PI/4, Util.colors().blue),
      this.createArc(7*Math.PI/4, 5*Math.PI/4, Util.colors().purple),
      this.createArc(5*Math.PI/4, 3*Math.PI/4, Util.colors().pink),
      this.createArc(3*Math.PI/4, Math.PI/4, Util.colors().yellow),
    ];
  }

  createArc(start, end, color) {
    return new Arc(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.draw(ctx, this.spinner);
    });
  }
}

module.exports = Circle;


/***/ }),
/* 17 */
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

  // used to find collision between rotating rectangle and circle
  // Credit: https://gist.github.com/snorpey/8134c248296649433de2
  // Explanation: http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
  collideCircleWithRotatedRectangle(circle, rect) {

  	var rectCenterX = rect.x;
  	var rectCenterY = rect.y;

  	var rectX = rectCenterX - rect.width / 2;
  	var rectY = rectCenterY - rect.height / 2;

  	var rectReferenceX = rectX;
  	var rectReferenceY = rectY;

  	// Rotate circle's center point back
  	var unrotatedCircleX = (Math.cos( rect.rotation ) *
                            ( circle.x - rectCenterX ) -
                            Math.sin( rect.rotation ) *
                            ( circle.y - rectCenterY ) +
                            rectCenterX);
  	var unrotatedCircleY = (Math.sin( rect.rotation ) *
                            ( circle.x - rectCenterX ) +
                            Math.cos( rect.rotation ) *
                            ( circle.y - rectCenterY ) +
                            rectCenterY);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const Arc = __webpack_require__(15);
const Util = __webpack_require__(6);
const Line = __webpack_require__(17);

class Shape {
  constructor(centerX, centerY, radius) {
    this.x = centerX;
    this.y = centerY;
    this.radius = radius;
    this.rotatingAngle = 0.02;
  }

  createLine(start, end, color) {
    return new Line(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  createArc(start, end, color) {
    return new Arc(this.x, this.y, this.radius, start, end, color, this.rotatingAngle);
  }

  shift(player) {
    this.y += player.moveVel * 0.8;
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

  move() {
    const segments = this.arcs ? this.arcs : this.lines;
    segments.forEach((segment) => {
      segment.rotate();
      if (this.lines) {
        segment.calculateStart();
      }
    });
  }
}

module.exports = Shape;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const Line = __webpack_require__(17);
const Util = __webpack_require__(6);
const Shape = __webpack_require__(18);

class Rectangle extends Shape {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 100;
    this.counter = 0;
    this.lines = [
      this.createLine(0, Math.PI/2, Util.colors().blue),
      this.createLine(Math.PI/2, Math.PI, Util.colors().purple),
      this.createLine(Math.PI, 3*Math.PI/2, Util.colors().pink),
      this.createLine(3*Math.PI/2, 2*Math.PI, Util.colors().yellow)
    ];
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.draw(ctx);
    });
  }
}

module.exports = Rectangle;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(18);
const Line = __webpack_require__(17);
const Util = __webpack_require__(6);

class Triangle extends Shape {
  constructor(centerX, centerY, radius, color) {
    super(centerX, centerY, radius);
    this.radius = 120;
    this.playerColor = color;
    this.selectedColors = this.selectRandomColors();
    this.lines = [
      this.createLine(0, 2*Math.PI/3, this.selectedColors[0]),
      this.createLine(2*Math.PI/3, 4*Math.PI/3, this.selectedColors[1]),
      this.createLine(4*Math.PI/3, 2*Math.PI, this.selectedColors[2])
    ];
  }

  selectRandomColors() {
    const colors = Object.values(Util.colors());
    const playerIdx = colors.indexOf(this.playerColor);
    colors.splice(playerIdx, 1);
    return colors;
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.draw(ctx);
    });
  }
}

module.exports = Triangle;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const Circle = __webpack_require__(16);
const Shape = __webpack_require__(18);
const Util = __webpack_require__(6);

class DoubleCircle extends Shape {
  constructor(centerX, centerY, radius, color) {
    super(centerX, centerY, radius);
    this.playerColor = color;
    const angle = -this.rotatingAngle;
    const firstCircle = new Circle(this.x, this.y, this.radius);
    const secondCircle = new Circle(this.x, this.y, this.radius + 20, false, angle);
    this.arcs = firstCircle.arcs.concat(secondCircle.arcs);
  }

  draw(ctx) {
    this.arcs.forEach((arc) => {
      arc.draw(ctx);
    });
  }
}

module.exports = DoubleCircle;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(6);
const Arc = __webpack_require__(15);
const Shape = __webpack_require__(18);

class ColorSpinner extends Shape {
  constructor(centerX, centerY) {
    super(centerX, centerY);
    this.radius = 5;
    this.arcs = [
      new Arc(this.x, this.y, this.radius, 0, 3*Math.PI/2, Util.colors().blue),
      new Arc(this.x, this.y, this.radius, 3*Math.PI/2, Math.PI, Util.colors().purple),
      new Arc(this.x, this.y, this.radius, Math.PI, Math.PI/2, Util.colors().pink),
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(18);

class Star extends Shape {
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

  collision(player) {
    if (player.y <= (this.y + this.length/2) &&
        player.y >= (this.y - this.length/2)) {
          return true;
    }
    return false;
  }

  draw(ctx) {
    ctx.save();
    this.image.src = './assets/star.png';
    this.rotate(ctx);
    ctx.restore();
  }
}

module.exports = Star;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const Shape = __webpack_require__(18);
const Util = __webpack_require__(6);
const Line = __webpack_require__(17);

class LineObstacle extends Shape {
  constructor(centerX, centerY, radius) {
    super(centerX, centerY, radius);
    this.lineWidth = this.radius;
    this.lines = [
      this.createLine(this.x, this.y, Util.colors().blue),
      this.createLine(this.x - 2*this.lineWidth, this.y, Util.colors().purple),
      this.createLine(this.x + 2*this.lineWidth, this.y, Util.colors().pink),
      this.createLine(this.x + 4*this.lineWidth, this.y, Util.colors().yellow),
    ];

    this.move = this.move.bind(this);
  }

  createLine(x, y, color) {
    return new Line(x, y, this.radius, 0, Math.PI, color);
  }

  shift(player) {
    this.y += player.moveVel * 0.8;
    this.lines.forEach((line) => {
      line.center[1] += player.moveVel * 0.8;
    });
  }

  move() {
    this.lines.forEach((line) => {
      line.center[0] -= 3;
      line.calculateStart();
      if (line.center[0] + this.lineWidth < 0) {
        line.center[0] = 700
      }
    });
  }

  draw(ctx) {
    this.lines.forEach((line) => {
      line.draw(ctx);
    });
  }
}

module.exports = LineObstacle;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map