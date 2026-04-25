import type { SkillKey } from "./types";

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  skills: Record<SkillKey, boolean>;
  esc: boolean;
};

export const createInputState = (): InputState => ({
  up: false,
  down: false,
  left: false,
  right: false,
  skills: { q: false, w: false, e: false, r: false },
  esc: false
});

export function updateInput(input: InputState, key: string, pressed: boolean) {
  if (key === "ArrowUp") input.up = pressed;
  if (key === "ArrowDown") input.down = pressed;
  if (key === "ArrowLeft") input.left = pressed;
  if (key === "ArrowRight") input.right = pressed;
  const lower = key.toLowerCase();
  if (lower === "q" || lower === "w" || lower === "e" || lower === "r") input.skills[lower] = pressed;
  if (key === "Escape") input.esc = pressed;
}
