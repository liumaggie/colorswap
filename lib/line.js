const Util = require('./util');

class Line {
  constructor(x, y, radius, start, end, color) {
    this.center = [x, y];
    this.radius = radius;
    // arc angles
    this.start = start;
    this.end = end;
    this.color = color;
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

    const squareLeft = this.startX;
    const squareTop = this.startY;
    const width = Util.distance(this.startX, this.endX, this.startY, this.endY);
    const height = 10;
    // this.checkCollision(player, width, height);
    // calculates distance between circle and square
    const distanceX = Math.abs(player.x - squareLeft);
    const distanceY = Math.abs(player.y - squareTop);

    if (distanceX > (width/2 + player.radius)) { return false; }
    if (distanceY > (height/2 + player.radius)) { return false; }
    if (distanceX <= width/2 && player.color !== this.color) { return true; }
    if (distanceY <= height/2 && player.color !== this.color) { return true; }
    //
    // const cornerDistance = (Math.pow((distanceX - width/2), 2) +
    //                         Math.pow((distanceY - height/2), 2));
    // return (cornerDistance >= Math.pow(player.radius, 2));
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
