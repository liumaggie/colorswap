const Player = require('./player');
const Shape = require('./shapes/shape');
const Rectangle = require('./shapes/rectangle');
const Circle = require('./shapes/circle');
const Triangle = require('./shapes/triangle');
const DoubleCircle = require('./shapes/double_circle');
const ColorSpinner = require('./shapes/color_spinner');
const Star = require('./shapes/star');
const LineObstacle = require('./shapes/line_obstacle');
const Util = require('./util');

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

  loop() {
    this.addShapes();
    this.moveShapes();
    this.shiftShapes();
    this.removeShape();
    this.collided();
  }

}

Game.width = 600;
Game.height = 700;

module.exports = Game;
