const Util = {
  pointOnCircle(center, radius, angle) {
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    return [x, y];
  },

  edgeDetection(x, y) {
    const delta = 5;
    if (x <= y + delta && x >= y - delta) return true;
  }
};

module.exports = Util;
