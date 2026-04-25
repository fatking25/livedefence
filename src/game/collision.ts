import type { Rect } from "./map";

export function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function norm(dx: number, dy: number) {
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

export function circleHitsRect(circle: { x: number; y: number }, radius: number, rect: Rect) {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.w);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.h);
  return Math.hypot(circle.x - closestX, circle.y - closestY) < radius;
}

export function resolveCircleAgainstRects<T extends { x: number; y: number }>(circle: T, radius: number, rects: Rect[]) {
  for (const rect of rects) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.w);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.h);
    let dx = circle.x - closestX;
    let dy = circle.y - closestY;
    let overlap = radius - Math.hypot(dx, dy);

    if (overlap <= 0) continue;

    if (dx === 0 && dy === 0) {
      const left = Math.abs(circle.x - rect.x);
      const right = Math.abs(rect.x + rect.w - circle.x);
      const top = Math.abs(circle.y - rect.y);
      const bottom = Math.abs(rect.y + rect.h - circle.y);
      const min = Math.min(left, right, top, bottom);
      if (min === left) dx = -1;
      else if (min === right) dx = 1;
      else if (min === top) dy = -1;
      else dy = 1;
      overlap = radius + min;
    }

    const dir = norm(dx, dy);
    circle.x += dir.x * overlap;
    circle.y += dir.y * overlap;
  }
}
