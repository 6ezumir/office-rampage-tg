export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function intersects(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}