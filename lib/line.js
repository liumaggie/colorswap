const Util = require('./util');

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
  // collision(player) {
  //   // this.counter = 0
  //   const height = 10;
  //   const width = Util.distance(this.startX, this.startY, this.endX, this.endY);
  //   const squareTop = Math.abs(this.endY - this.startY) / 2;
  //   const squareLeft = Math.abs(this.endX - this.startX)/2;
  //   this.counter += 1
  //   // this.checkCollision(player, width, height);
  //   // calculates distance between circle and square
  //   const distanceX = Math.abs(player.x - player.radius - squareLeft);
  //   const distanceY = Math.abs(player.y - player.radius - squareTop);
  //   if (distanceX >= (width/2 + player.radius)) {
  //     return false; }
  //   if (distanceY >= (height/2 + player.radius)) { return false; }
  //   if (distanceY <= height/2 && player.color !== this.color) {
  //     // console.log('collide', distanceY);
  //     // debugger
  //     return true; }
  //
  //   const cornerDistance = (Math.pow((distanceX - width/2), 2) +
  //                           Math.pow((distanceY - height/2), 2));
  //   return (cornerDistance >= Math.pow(player.radius, 2) && player.color !== this.color );
  // }
  collision(player) {
    const height = 10;
    const width = Util.distance(this.startX, this.startY, this.endX, this.endY);
    const rectCenterX = this.endX + ((this.startX - this.endX)/2);
    const rectCenterY = this.endY + ((this.startY - this.endY)/2);

    const rectLeft = rectCenterX - width/2;
    const rectTop = rectCenterY - height/2;

    const unrotatedCircleX = Math.cos(Math.PI/2) * (player.x - rectCenterX) - Math.sin(Math.PI/2)*(player.y - rectCenterY) + rectCenterX
    const unrotatedCircleY = Math.sin(Math.PI/2) * (player.x - rectCenterX) + Math.cos(Math.PI/2)*(player.y - rectCenterY) + rectCenterY
    let closestX, closestY;
  	// Find the unrotated closest x point from center of unrotated circle
  	if ( unrotatedCircleX < rectLeft ) {
  		closestX = rectLeft;
  	} else if ( unrotatedCircleX > rectLeft + width ) {
  		closestX = rectLeft + width;
  	} else {
  		closestX = unrotatedCircleX;
  	}

  	// Find the unrotated closest y point from center of unrotated circle
  	if ( unrotatedCircleY < rectTop ) {
  		closestY = rectTop;
  	} else if ( unrotatedCircleY > rectTop + height ) {
  		closestY = rectTop + height;
  	} else {
  		closestY = unrotatedCircleY;
  	}

  	// Determine collision
  	var collision = false;
  	var distance = Util.distance( unrotatedCircleX, unrotatedCircleY, closestX, closestY );

  	if ( distance < player.radius && this.color !== player.color) {
  		collision = true;
  	}
  	else {
  		collision = false;
  	}

  	return collision;
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
