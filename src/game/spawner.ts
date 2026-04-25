import { createEnemy, spawnPoint } from "./entities";
import type { EnemyType, GameState } from "./types";

let spawnTimer = 0;
let fanTimer = 8;

export function resetSpawner() {
  spawnTimer = 0;
  fanTimer = 8;
}

export function updateSpawns(state: GameState, dt: number) {
  state.wave = Math.max(1, Math.floor(state.elapsedSec / 60) + 1);
  const bossActive = state.bossState === "finalBoss";
  spawnTimer -= dt;
  fanTimer -= dt;

  const maxEnemies = bossActive ? 24 : 22 + Math.min(18, Math.floor(state.elapsedSec / 18));
  const interval = bossActive ? 2.8 : Math.max(0.72, 1.85 - state.elapsedSec / 360);
  if (spawnTimer <= 0 && state.enemies.length < maxEnemies) {
    spawnTimer = interval;
    const point = spawnPoint();
    state.enemies.push(createEnemy(pickEnemy(state.elapsedSec), point.x, point.y));
  } else if (spawnTimer <= 0) {
    spawnTimer = 0.4;
  }

  if (fanTimer <= 0 && state.elapsedSec > 45 && state.trueFans.length < 5) {
    fanTimer = 18;
    state.trueFans.push({
      id: `fan-${Math.random().toString(36).slice(2)}`,
      x: 500 + Math.random() * 280,
      y: 260 + Math.random() * 180,
      timer: 0
    });
  }

  if (!state.bossSpawnedMid && (state.elapsedSec >= 165 || state.player.level >= 6)) {
    state.bossSpawnedMid = true;
    state.bossState = "midBoss";
    state.enemies.push(createEnemy("midBoss", 80, 80));
    state.message = "중간 보스 광클 오빠 등장!";
  }

  const allSkills = Object.values(state.skills).every((skill) => skill.unlocked);
  const midDefeated = state.bossSpawnedMid && !state.enemies.some((enemy) => enemy.type === "midBoss");
  if (!state.bossSpawnedFinal && allSkills && midDefeated && state.elapsedSec >= 255) {
    state.bossSpawnedFinal = true;
    state.bossState = "finalBoss";
    state.enemies.push(createEnemy("finalBoss", 1180, 90));
    state.message = "최종 보스 집착 팬 리더 등장!";
  }
}

function pickEnemy(elapsed: number): EnemyType {
  const roll = Math.random();
  if (elapsed > 240 && roll < 0.22) return "obsessed";
  if (elapsed > 165 && roll < 0.34) return "camera";
  if (elapsed > 95 && roll < 0.28) return "charger";
  return "normal";
}
