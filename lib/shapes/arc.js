const Util = require('../util');

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
