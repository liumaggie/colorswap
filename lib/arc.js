const Util = require('./util');

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
