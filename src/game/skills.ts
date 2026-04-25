import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { clamp, dist, norm, resolveCircleAgainstRects } from "./collision";
import { uid } from "./entities";
import { BUILDING_RECTS } from "./map";
import type { GameState, SkillKey } from "./types";

export function tryUseSkill(state: GameState, key: SkillKey) {
  const skill = state.skills[key];
  if (!skill.unlocked || skill.cooldownRemaining > 0) return;
  if (key === "q") useQ(state);
  if (key === "w") useW(state);
  if (key === "e") useE(state);
  if (key === "r") useR(state);
}

function useQ(state: GameState) {
  const level = state.skills.q.level;
  const radius = 150 * (1 + Math.max(0, level - 1) * 0.2);
  state.effects.push({ id: uid("effect"), kind: "qAura", x: state.player.x, y: state.player.y, radius, time: 0, duration: 4 + level * 0.4 });
  state.skills.q.cooldownRemaining = state.skills.q.cooldown * Math.pow(0.9, Math.max(0, level - 1));
}

function useW(state: GameState) {
  const level = state.skills.w.level;
  const radius = 180 * (1 + Math.max(0, level - 1) * 0.15);
  const damage = 36 * (1 + Math.max(0, level - 1) * 0.22);
  for (const enemy of state.enemies) {
    const d = dist(state.player, enemy);
    if (d <= radius + enemy.radius) {
      enemy.hp -= damage;
      const dir = norm(enemy.x - state.player.x, enemy.y - state.player.y);
      enemy.x = clamp(enemy.x + dir.x * 80, 0, GAME_WIDTH);
      enemy.y = clamp(enemy.y + dir.y * 80, 0, GAME_HEIGHT);
    }
  }
  state.effects.push({ id: uid("effect"), kind: "wBurst", x: state.player.x, y: state.player.y, radius, time: 0, duration: 0.35 });
  state.skills.w.cooldownRemaining = state.skills.w.cooldown * Math.pow(0.9, Math.max(0, level - 1));
}

function useE(state: GameState) {
  const level = state.skills.e.level;
  const dir = norm(state.player.lastDx, state.player.lastDy);
  const distance = 120 * (1 + Math.max(0, level - 1) * 0.2);
  state.player.x = clamp(state.player.x + dir.x * distance, 20, GAME_WIDTH - 20);
  state.player.y = clamp(state.player.y + dir.y * distance, 20, GAME_HEIGHT - 20);
  resolveCircleAgainstRects(state.player, 18, BUILDING_RECTS);
  state.player.x = clamp(state.player.x, 20, GAME_WIDTH - 20);
  state.player.y = clamp(state.player.y, 20, GAME_HEIGHT - 20);
  state.player.invincibleTimer = 0.35 + Math.max(0, level - 1) * 0.1;
  state.player.dashTimer = 0.16;
  state.skills.e.cooldownRemaining = state.skills.e.cooldown * Math.pow(0.9, Math.max(0, level - 1));
}

function useR(state: GameState) {
  if (state.player.fanGauge < 100) return;
  const level = state.skills.r.level;
  const damage = 130 * (1 + Math.max(0, level - 1) * 0.25);
  for (const enemy of state.enemies) enemy.hp -= damage;
  state.core.hp = Math.min(state.core.maxHp, state.core.hp + state.core.maxHp * 0.2);
  state.player.fanGauge = 0;
  state.effects.push({ id: uid("effect"), kind: "rLive", x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, radius: 760, time: 0, duration: 0.8 });
  state.skills.r.cooldownRemaining = 1;
  state.message = "KYMA 라이브!";
}
