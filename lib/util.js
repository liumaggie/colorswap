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
      'green': '#FF0181',
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
