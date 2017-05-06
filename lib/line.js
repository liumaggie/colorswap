const Util = require('./util');

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
