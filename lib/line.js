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
  //   const squareTop = (this.endY - this.startY) / 2 + this.center[0];
  //   const squareLeft = (this.endX - this.startX)/2 + this.center[1];
  //   // this.checkCollision(player, width, height);
  //   // calculates distance between circle and square
  //   const distanceX = Math.abs(player.x - player.radius - squareLeft);
  //   const distanceY = Math.abs(player.y - player.radius - squareTop);
  //   if (distanceX >= (width/2 + player.radius)) {
  //     return false; }
  //   if (distanceY >= (height/2 + player.radius)) { return false; }
  //
  //   if (distanceY <= height/2 && player.color !== this.color) {
  //     // console.log('collide', distanceY);
  //     // debugger
  //     return true; }
  //
  //   const cornerDistance = (Math.pow((distanceX - width/2), 2) +
  //                           Math.pow((distanceY - height/2), 2));
  //   return (cornerDistance >= Math.pow(player.radius, 2) && player.color !== this.color );
  // }
  // collision(player) {
  //   const height = 10;
  //   const width = Util.distance(this.startX, this.startY, this.endX, this.endY);
  //   const rectCenterX = (this.startX - this.endX)/2 + this.center[0];
  //   const rectCenterY = (this.startY - this.endY)/2 + this.center[1];
  //   // debugger
  //   const rectLeft = rectCenterX - width/2;
  //   const rectTop = rectCenterY - height/2;
  //
  //   const unrotatedCircleX = Math.cos(Math.PI/2) * (player.x - rectCenterX) - Math.sin(Math.PI/2)*(player.y - rectCenterY) + rectCenterX
  //   const unrotatedCircleY = Math.sin(Math.PI/2) * (player.x - rectCenterX) + Math.cos(Math.PI/2)*(player.y - rectCenterY) + rectCenterY
  //
  //   let closestX, closestY;
  // 	// Find the unrotated closest x point from center of unrotated circle
  // 	if ( unrotatedCircleX < rectLeft ) {
  // 		closestX = rectLeft;
  // 	} else if ( unrotatedCircleX > rectLeft + width ) {
  // 		closestX = rectLeft + width;
  // 	} else {
  // 		closestX = unrotatedCircleX;
  // 	}
  //
  // 	// Find the unrotated closest y point from center of unrotated circle
  // 	if ( unrotatedCircleY < rectTop ) {
  // 		closestY = rectTop;
  // 	} else if ( unrotatedCircleY > rectTop + height ) {
  // 		closestY = rectTop + height;
  // 	} else {
  // 		closestY = unrotatedCircleY;
  // 	}
  //
  // 	// Determine collision
  // 	var collision = false;
  // 	var distance = Util.distance( unrotatedCircleX, unrotatedCircleY, closestX, closestY );
  //
  // 	if ( distance < player.radius && Util.edgeDetection(player.radius, distance) && this.color !== player.color) {
  //     // console.log(this.color)
  // 		collision = true;
  // 	}
  // 	else {
  // 		collision = false;
  // 	}
  //   // debugger
  // 	return collision;
  // }
  // collision(player) {
  //   console.log('hi')
  //   const circle = { x: 0.5, y: -0.5, radius: 0.5 };
  //   const rect = { rotation: Math.PI/2 + Math.PI/4 + Math.PI/2 + Math.PI/2, width: 2, height: 1, x: (Math.cos(Math.PI/4) + 0.5), y: -(Math.sin(Math.PI/4) + 0.5)};
  //   if (this.collideCircleWithRotatedRectangle(circle, rect)) {
  //     console.log('collide');
  //   } else {
  //     console.log('not collide');
  //   }
  // }
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
    // this.counter += 1
    // if (this.counter % 300 === 0) {
    //   console.log(this.color, theta, 'rotation', rect.rotation, 'width', rect.width, 'x', rect.x, 'y', rect.y, player.y);
    //   debugger
    //
    // }
    if (this.collideCircleWithRotatedRectangle(circle, rect)) {
      console.log('collide', player.y);
      console.log(this.color, theta, 'rotation', rect.rotation, 'width', rect.width, 'x', rect.x, 'y', rect.y);
      return true;
      // debugger
    } else {
      return false;
    }
    // } else {
    //   console.log('not collide')
    // }
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
    console.log(this.startX, this.startY, this.endX, this.endY)
    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0;
    ctx.stroke();

  }
}

module.exports = Line;
