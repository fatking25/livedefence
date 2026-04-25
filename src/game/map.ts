import { GAME_HEIGHT, GAME_WIDTH } from "./constants";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const blockBuildings: Rect[] = Array.from({ length: 12 }, (_, i) => ({
  x: 40 + i * 110,
  y: 60 + (i % 4) * 110,
  w: 78,
  h: 54
}));

export const BUILDING_RECTS: Rect[] = [
  ...blockBuildings,
  { x: 140, y: 160, w: 160, h: 120 },
  { x: 330, y: 470, w: 150, h: 84 },
  { x: 840, y: 86, w: 170, h: 92 },
  { x: 910, y: 510, w: 210, h: 96 },
  { x: 1060, y: 150, w: 140, h: 132 },
  { x: 48, y: 470, w: 190, h: 92 }
].filter((rect) => rect.x + rect.w > 0 && rect.x < GAME_WIDTH && rect.y + rect.h > 0 && rect.y < GAME_HEIGHT);
