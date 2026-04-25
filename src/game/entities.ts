import { CORE_RADIUS, GAME_HEIGHT, GAME_WIDTH } from "./constants";
import type { Enemy, EnemyType, GameState, Settings } from "./types";

let nextId = 1;
export const uid = (prefix: string) => `${prefix}-${nextId++}`;

export function createInitialState(settings: Settings): GameState {
  return {
    mode: "mainMenu",
    elapsedSec: 0,
    wave: 1,
    bossState: "none",
    bossSpawnedMid: false,
    bossSpawnedFinal: false,
    player: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2 + 92,
      hp: 120,
      maxHp: 120,
      moveSpeed: 188,
      attackPower: 12,
      attackInterval: 0.62,
      attackTimer: 0,
      attackRange: 240,
      level: 1,
      exp: 0,
      expToNext: 14,
      fanGauge: 0,
      invincibleTimer: 0,
      dashTimer: 0,
      lastDx: 0,
      lastDy: -1
    },
    core: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, hp: 360, maxHp: 360 },
    skills: {
      q: { unlocked: false, level: 0, cooldown: 8, cooldownRemaining: 0 },
      w: { unlocked: false, level: 0, cooldown: 10, cooldownRemaining: 0 },
      e: { unlocked: false, level: 0, cooldown: 6, cooldownRemaining: 0 },
      r: { unlocked: false, level: 0, cooldown: 1, cooldownRemaining: 0 }
    },
    enemies: [],
    projectiles: [],
    drops: [],
    trueFans: [],
    effects: [],
    upgrades: [],
    levelUpChoices: [],
    settings,
    message: "게릴라 라이브 시작!"
  };
}

export function createEnemy(type: EnemyType, x: number, y: number): Enemy {
  const base = {
    normal: { hp: 24, speed: 82, attackPower: 6, radius: 16, exp: 7, fan: 3 },
    charger: { hp: 20, speed: 118, attackPower: 11, radius: 15, exp: 9, fan: 4 },
    camera: { hp: 22, speed: 64, attackPower: 5, radius: 15, exp: 10, fan: 4 },
    obsessed: { hp: 36, speed: 76, attackPower: 8, radius: 18, exp: 12, fan: 5 },
    midBoss: { hp: 280, speed: 86, attackPower: 12, radius: 32, exp: 70, fan: 35 },
    finalBoss: { hp: 680, speed: 88, attackPower: 16, radius: 42, exp: 0, fan: 0 }
  }[type];
  return {
    id: uid("enemy"),
    type,
    x,
    y,
    hp: base.hp,
    maxHp: base.hp,
    speed: base.speed,
    attackPower: base.attackPower,
    attackTimer: 0,
    radius: base.radius,
    exp: base.exp,
    fan: base.fan,
    age: 0,
    shootTimer: type === "camera" ? 1.2 : undefined,
    chargeTimer: type === "charger" ? 1.6 : undefined
  };
}

export function spawnPoint() {
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: Math.random() * GAME_WIDTH, y: -30 };
  if (side === 1) return { x: GAME_WIDTH + 30, y: Math.random() * GAME_HEIGHT };
  if (side === 2) return { x: Math.random() * GAME_WIDTH, y: GAME_HEIGHT + 30 };
  return { x: -30, y: Math.random() * GAME_HEIGHT };
}

export function coreHitRadius() {
  return CORE_RADIUS + 10;
}
