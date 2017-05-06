const Util = {
  pointOnCircle(center, radius, angle) {
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    return [x, y];
  },

  edgeDetection(x, y) {
    const delta = 5;
    if (x <= y + delta && x >= y - delta) return true;
  },

  colors() {
    return {
      'blue': '#b0e5f6',
      'purple': '#baade6',
      'green': '#8ae1c0',
      'yellow': '#f3f485'
    };
  },
  pointOnSquare(start, end, center) {
    const x1 = center[0];

    // find slope of current line
    const m = (end[1] - start[1]) / (end[0] - start[0]);
    // find intercept of current line
    const b = -(m * start[0]) + start[1];
    // find intersecting point
    const y1 = m * x1 + b;
    return [x1, y1];
  },
  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
  }
};

module.exports = Util;
