# Color Swap

[Live](http://maggieliu.me/colorswap/)

<img src="https://github.com/liumaggie/colorswap/blob/master/assets/splash_ss.png" alt="ColorSwapSplash" width="50%" height="auto">

### Background

Color Swap is a browser game inspired by the mobile version, Color Switch. The goal of this game is to beat the highest score by tapping the ball and matching the colors as it passes through each obstacle. The obstacles have a variety of shapes, are made up of four different colors and rotate constantly to make it difficult for the user to match the colors.

<img src="https://github.com/liumaggie/colorswap/blob/master/assets/game.png" alt="ColorSwap" width="45%" height="auto"> <img src="https://github.com/liumaggie/colorswap/blob/master/assets/shapes.png" alt="ColorSwapShapes" width="45%" height="auto">

### Instructions

* Click / press enter to start a new a game.
* Tap / press spacebar to move the player.
* Pass through the obstacles when the color matches your color which changes when you collide with a color spinner.
* Collect stars that represent your score.
* Press 'M' to mute/un-mute the sound.

### Technologies Used

* HTML5 Canvas
* Vanilla Javascript
* Object-Oriented Programming

### Features

#### Obstacle Rotation

There are a few different obstacle shapes - circles, double circles, squares, triangles and lines, each with four colors. The circles were drawn with four arcs and the other shapes were drawn with lines that formed rectangles.

**Arcs**

The arc to circle (player) collision was detected by determining the top and bottom y coordinates of the player and the top and bottom point at which the circle obstacle lies. The code below shows how the detection between the circle and arc was detected.

```JavaScript
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
```

For each arc in the circle obstacle, the `start` and `end` angles were calculated to make sure that `Math.PI/2` or `3*Math.PI/2` was between the two angles since player goes straight up and would only collide at those angles.

**Lines**

Each line of the square and triangle obstacles were rectangles with a height of 10px. The detection between the circle (player) and each rotating rectangle was determined by calculating the rotation angle and finding the closest point in the rectangle to the center of the circle based on this [explanation](http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/) and this [example](https://gist.github.com/snorpey/8134c248296649433de2).

```JavaScript
collision(player) {
  const start = this.start % (2*Math.PI);
  const circle = player;
  // theta is the angle between the actual position of the circle and the position of the rotated circle after rotating the rectangle to 0 degree
  const theta = (this.start/2 + this.end/2) % (2*Math.PI)
  // calculating theta gives us the rotation angle of the rectangle
  const rect = {
    rotation: (Math.PI/2 - theta) % (2*Math.PI),
    width: Util.distance(this.startX, this.startY, this.endX, this.endY),
    height: 10,
    x: (this.endX + this.startX)/2,
    y: (this.endY + this.startY)/2
  };

  if (this.collideCircleWithRotatedRectangle(circle, rect) &&
      this.color !== player.color) {
    return true;
  }
  return false;
}
```

#### Game Loop

The entire game loop is in the `GameView` class as shown below.

```JavaScript
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
```

This function checks to see if the game is over and if isn't over, I used `requestAnimationFrame` to create the game loop for updating the animation at approximately 60 times per second. All of the `Game` methods in `animate` are responsible for adding, shifting, rotating and drawing the obstacles and power-ups. The objects displayed (obstacles, star and color spinner) are based on a queue where it is being added to the end of an array and shifted from the front of the array when they reach the bottom of the canvas.

### Future Features

* Different levels
* Persisting high score to database
