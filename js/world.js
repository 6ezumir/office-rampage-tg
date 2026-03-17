export function createWalls() {
  return [
    { x: 0, y: 0, w: 360, h: 24 },
    { x: 0, y: 516, w: 360, h: 24 },
    { x: 0, y: 0, w: 24, h: 540 },
    { x: 336, y: 0, w: 24, h: 540 },

    { x: 40, y: 70, w: 120, h: 38 },
    { x: 200, y: 70, w: 120, h: 38 },
    { x: 135, y: 225, w: 90, h: 34 },
    { x: 140, y: 360, w: 88, h: 34 }
  ];
}

export function createPlayer() {
  return {
    x: 50,
    y: 440,
    w: 24,
    h: 24,
    speed: 2.2,
    color: "#76a7ff",
    bob: 0
  };
}