import { GAME_HEIGHT, GAME_WIDTH } from "./constants";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const BUILDING_RECTS: Rect[] = [
  { x: 58, y: 58, w: 130, h: 78 },
  { x: 238, y: 68, w: 176, h: 78 },
  { x: 452, y: 58, w: 118, h: 82 },
  { x: 72, y: 172, w: 128, h: 82 },
  { x: 230, y: 168, w: 146, h: 100 },
  { x: 408, y: 188, w: 122, h: 76 },
  { x: 78, y: 472, w: 176, h: 92 },
  { x: 294, y: 474, w: 154, h: 86 },
  { x: 486, y: 468, w: 92, h: 104 },
  { x: 746, y: 70, w: 138, h: 78 },
  { x: 928, y: 74, w: 152, h: 108 },
  { x: 1116, y: 88, w: 114, h: 142 },
  { x: 766, y: 202, w: 120, h: 72 },
  { x: 1094, y: 236, w: 154, h: 76 },
  { x: 752, y: 516, w: 176, h: 96 },
  { x: 978, y: 512, w: 208, h: 106 },
  { x: 1214, y: 430, w: 82, h: 92 }
].filter((rect) => rect.x + rect.w > 0 && rect.x < GAME_WIDTH && rect.y + rect.h > 0 && rect.y < GAME_HEIGHT);
