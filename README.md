# Color Swap

### Minimum Viable Product

Color Swap is a browser game inspired by the mobile version, Color Switch. The goal of this game is to beat the highest score by tapping the ball and matching the colors as it passes through each obstacle. The obstacles have a variety of shapes, are made up of four different colors and rotate constantly to make it difficult for the user to match the colors.

The features of this game include:

- [ ] A player (ball) affected by gravity and maintained by constantly clicking
- [ ] Rotating obstacles of different shapes and colors
- [ ] Queue implementation for rendering display
- [ ] Power-ups
- [ ] Background music that goes with every click/keypress
- [ ] Scoreboard

### Wireframes

This game will consist of three pages, one for the splash page (left image shown below), one for the game play (middle) and one for game over (right). The splash page will include a start button, the scoreboard, and a mute button. The game play page will display everything rendered from the game logic, including the player, obstacles and power-ups. The game over page will show the current score, high score and a restart button. Each of these pages will have several navigation links for my portfolio site, Github and LinkedIn.

<img src="https://github.com/liumaggie/colorswap/blob/master/wireframes/splash-page.png" alt="SplashPage" width="30%" height="30%"> <img src="https://github.com/liumaggie/colorswap/blob/master/wireframes/game-play.png" alt="GamePlay" width="30%" height="70%"> <img src="https://github.com/liumaggie/colorswap/blob/master/wireframes/game-over.png" alt="GameOver" width="30%" height="70%">

### Technologies

Color Swap will be implemented with the following technologies:

* `JavaScript` for game logic,
* `HTML5` for rendering,
* `Webpack` to bundle js files

Other scripts that will be involved in this project are:

* `game.js`: this will handle the overall game logic and rendering
* `player.js`: this script will handle the logic for the player (gravity, color change)
* `obstacle.js`: this will handle the logic of rotating the obstacles, keeping track of the colors and rendering `Obstacle` objects
* `powerup.js`: this will handle the logic of generating power-ups and storing their functionalities

### Implementation Timeline

**Day 1**:
* Setup all necessary files, the entry file, and get webpack running.
* Fully understand HTML5 canvas and how to render simple objects (circle, square)
* Implement the `Player` class, including the math involved for gravity

**Day 2**:
* Implement the `Obstacle` class by understanding how to rotate objects
* Keep track of obstacles' colors and positions
* Incorporate the player and obstacles into `game.js` and implement the game logic for simple obstacles
* Create more complicated obstacles
* Implement a queue when rendering the obstacles

**Day 3**:
* Implement power-ups and incorporate it in the game logic
* Generate splash page and game over page
* Add background music consistent with the clicks
* Display a scoreboard
* Finish styling the frontend

### Bonus Features

- [ ] Add multiplayer mode using WebSocket
- [ ] Add different modes like the mobile version of the game
