import { CORE_RADIUS, GAME_HEIGHT, GAME_WIDTH, PLAYER_RADIUS } from "./constants";
import { circleHitsRect, clamp, dist, norm, resolveCircleAgainstRects } from "./collision";
import { coreHitRadius, uid } from "./entities";
import type { InputState } from "./input";
import { BUILDING_RECTS } from "./map";
import { updateSpawns } from "./spawner";
import { makeLevelChoices } from "./upgrades";
import { tryUseSkill } from "./skills";
import { playSfx } from "./audio";
import type { Drop, Enemy, GameState, Projectile } from "./types";

export function updateGame(state: GameState, input: InputState, dt: number) {
  if (state.mode !== "playing") return;
  state.elapsedSec += dt;
  state.player.attackTimer -= dt;
  state.player.invincibleTimer = Math.max(0, state.player.invincibleTimer - dt);
  state.player.dashTimer = Math.max(0, state.player.dashTimer - dt);
  for (const skill of Object.values(state.skills)) skill.cooldownRemaining = Math.max(0, skill.cooldownRemaining - dt);

  movePlayer(state, input, dt);
  for (const key of ["q", "w", "e", "r"] as const) {
    if (input.skills[key]) {
      tryUseSkill(state, key);
      input.skills[key] = false;
    }
  }

  updateSpawns(state, dt);
  updateEffects(state, dt);
  updateFans(state, dt);
  autoAttack(state);
  updateEnemies(state, dt);
  updateProjectiles(state, dt);
  updateDrops(state, dt);
  cleanupDeadEnemies(state);

  if (state.player.hp <= 0 || state.core.hp <= 0) {
    state.mode = "gameOver";
    state.message = state.player.hp <= 0 ? "KYMA가 쓰러졌습니다." : "무대 코어가 무너졌습니다.";
  }
}

function movePlayer(state: GameState, input: InputState, dt: number) {
  let dx = Number(input.right) - Number(input.left);
  let dy = Number(input.down) - Number(input.up);
  if (dx !== 0 || dy !== 0) {
    const dir = norm(dx, dy);
    dx = dir.x;
    dy = dir.y;
    state.player.lastDx = dx;
    state.player.lastDy = dy;
  }
  moveCircle(state.player, dx * state.player.moveSpeed * dt, dy * state.player.moveSpeed * dt, PLAYER_RADIUS);
}

function autoAttack(state: GameState) {
  if (state.player.attackTimer > 0) return;
  const target = state.enemies
    .filter((enemy) => dist(state.player, enemy) <= state.player.attackRange)
    .sort((a, b) => dist(state.player, a) - dist(state.player, b) || dist(state.core, a) - dist(state.core, b) || a.hp - b.hp)[0];
  if (!target) return;
  const dir = norm(target.x - state.player.x, target.y - state.player.y);
  state.projectiles.push({
    id: uid("note"),
    kind: "note",
    x: state.player.x,
    y: state.player.y,
    vx: dir.x * 420,
    vy: dir.y * 420,
    damage: state.player.attackPower,
    radius: 6,
    fromEnemy: false,
    life: 1.2
  });
  state.player.attackTimer = state.player.attackInterval;
}

function updateEnemies(state: GameState, dt: number) {
  const qAura = state.effects.find((effect) => effect.kind === "qAura");
  for (const enemy of state.enemies) {
    enemy.age += dt;
    enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);
    let target = dist(enemy, state.player) < dist(enemy, state.core) + (enemy.type === "obsessed" ? 120 : 0) ? state.player : state.core;
    if (enemy.type === "finalBoss" && enemy.hp < enemy.maxHp * 0.6 && Math.sin(state.elapsedSec * 2) > 0.4) target = state.core;
    const dir = norm(target.x - enemy.x, target.y - enemy.y);
    let speed = enemy.speed + (enemy.type === "obsessed" ? enemy.age * 2 : 0);
    if (qAura && dist(qAura, enemy) < qAura.radius) speed *= 0.65;

    if (enemy.type === "charger") {
      enemy.chargeTimer = Math.max(0, (enemy.chargeTimer || 0) - dt);
      if (dist(enemy, state.player) < 230 && enemy.chargeTimer === 0) {
        speed = 260;
        enemy.chargeTimer = 2.2;
      }
    }

    if (enemy.type === "camera") updateCameraEnemy(state, enemy, dt);

    moveCircle(enemy, dir.x * speed * dt, dir.y * speed * dt, enemy.radius);

    const hitPlayer = dist(enemy, state.player) <= enemy.radius + PLAYER_RADIUS;
    const hitCore = dist(enemy, state.core) <= enemy.radius + coreHitRadius();
    if ((hitPlayer || hitCore) && enemy.attackTimer <= 0) {
      if (hitPlayer && state.player.invincibleTimer <= 0) {
        state.player.hp -= enemy.attackPower;
        state.player.fanGauge = Math.max(0, state.player.fanGauge - 3);
        state.player.invincibleTimer = 0.45;
      } else if (hitCore) {
        state.core.hp -= enemy.attackPower;
        state.player.fanGauge = Math.max(0, state.player.fanGauge - 3);
      }
      enemy.attackTimer = enemy.type.includes("Boss") ? 0.75 : 1;
    }
  }
}

function updateCameraEnemy(state: GameState, enemy: Enemy, dt: number) {
  enemy.shootTimer = Math.max(0, (enemy.shootTimer || 0) - dt);
  if (dist(enemy, state.player) < 270 && enemy.shootTimer === 0) {
    const dir = norm(state.player.x - enemy.x, state.player.y - enemy.y);
    state.projectiles.push({
      id: uid("flash"),
      kind: "flash",
      x: enemy.x,
      y: enemy.y,
      vx: dir.x * 250,
      vy: dir.y * 250,
      damage: enemy.attackPower,
      radius: 8,
      fromEnemy: true,
      life: 1.6
    });
    enemy.shootTimer = 1.8;
  }
}

function updateProjectiles(state: GameState, dt: number) {
  for (const projectile of state.projectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    if (projectile.fromEnemy) {
      if (dist(projectile, state.player) < projectile.radius + PLAYER_RADIUS && state.player.invincibleTimer <= 0) {
        state.player.hp -= projectile.damage;
        state.player.invincibleTimer = 0.35;
        projectile.life = 0;
      }
    } else {
      const target = state.enemies.find((enemy) => dist(projectile, enemy) < projectile.radius + enemy.radius);
      if (target) {
        target.hp -= projectile.damage;
        playSfx("hit", state.settings);
        projectile.life = 0;
      }
    }
  }
  state.projectiles = state.projectiles.filter((p) => {
    const insideWorld = p.x > -80 && p.x < GAME_WIDTH + 80 && p.y > -80 && p.y < GAME_HEIGHT + 80;
    const hitBuilding = BUILDING_RECTS.some((rect) => circleHitsRect(p, p.radius, rect));
    return p.life > 0 && insideWorld && !hitBuilding;
  });
}

function updateDrops(state: GameState, dt: number) {
  for (const drop of state.drops) {
    const d = dist(drop, state.player);
    if (d < 95) {
      const dir = norm(state.player.x - drop.x, state.player.y - drop.y);
      drop.x += dir.x * 280 * dt;
      drop.y += dir.y * 280 * dt;
    }
    if (d < 24) collectDrop(state, drop);
  }
  state.drops = state.drops.filter((drop) => drop.value > 0);
}

function collectDrop(state: GameState, drop: Drop) {
  if (drop.kind === "exp") {
    state.player.exp += drop.value;
    while (state.player.exp >= state.player.expToNext) {
      state.player.exp -= state.player.expToNext;
      state.player.level += 1;
      state.player.expToNext = Math.floor(state.player.expToNext * 1.18 + 6);
      state.levelUpChoices = makeLevelChoices(state);
      state.mode = "levelUp";
    }
  } else {
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + drop.value);
  }
  drop.value = 0;
}

function cleanupDeadEnemies(state: GameState) {
  const killed = state.enemies.filter((enemy) => enemy.hp <= 0);
  for (const enemy of killed) {
    if (enemy.type === "finalBoss") {
      state.mode = "cleared";
      state.bossState = "cleared";
      state.message = "라이브 성공! 집착 팬 리더를 처치했습니다.";
    }
    if (enemy.type === "midBoss") {
      state.bossState = "none";
      state.message = "광클 오빠 처치!";
    }
    if (enemy.exp > 0) {
      state.drops.push({ id: uid("drop"), kind: "exp", x: enemy.x, y: enemy.y, value: enemy.exp });
      if (Math.random() < 0.06) state.drops.push({ id: uid("heal"), kind: "heal", x: enemy.x + 10, y: enemy.y - 10, value: 20 });
    }
    state.player.fanGauge = clamp(state.player.fanGauge + enemy.fan, 0, 100);
  }
  state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);
}

function updateEffects(state: GameState, dt: number) {
  for (const effect of state.effects) {
    effect.time += dt;
    if (effect.kind === "qAura") {
      effect.x = state.player.x;
      effect.y = state.player.y;
      for (const fan of state.trueFans) {
        if (dist(effect, fan) < effect.radius) state.player.fanGauge = clamp(state.player.fanGauge + dt * 2, 0, 100);
      }
    }
  }
  state.effects = state.effects.filter((effect) => effect.time < effect.duration);
}

function updateFans(state: GameState, dt: number) {
  for (const fan of state.trueFans) {
    fan.timer += dt;
    if (fan.timer > 12) {
      state.player.fanGauge = clamp(state.player.fanGauge + 6, 0, 100);
      fan.timer = 0;
    }
  }
}

function moveCircle(entity: { x: number; y: number }, dx: number, dy: number, radius: number) {
  entity.x = clamp(entity.x + dx, radius, GAME_WIDTH - radius);
  resolveCircleAgainstRects(entity, radius, BUILDING_RECTS);
  entity.x = clamp(entity.x, radius, GAME_WIDTH - radius);

  entity.y = clamp(entity.y + dy, radius, GAME_HEIGHT - radius);
  resolveCircleAgainstRects(entity, radius, BUILDING_RECTS);
  entity.y = clamp(entity.y, radius, GAME_HEIGHT - radius);
}

export function drawGame(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawMap(ctx);
  drawCore(ctx, state);
  for (const fan of state.trueFans) drawTrueFan(ctx, fan.x, fan.y);
  for (const drop of state.drops) drawDrop(ctx, drop);
  for (const effect of state.effects) drawEffect(ctx, effect);
  for (const projectile of state.projectiles) drawProjectile(ctx, projectile);
  for (const enemy of state.enemies) drawEnemy(ctx, enemy);
  drawPlayer(ctx, state);
}

function drawMap(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#182235";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = "#263955";
  for (const rect of BUILDING_RECTS) {
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "#3e5878";
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  }
  ctx.fillStyle = "#22324a";
  ctx.fillRect(0, 300, GAME_WIDTH, 95);
  ctx.fillRect(560, 0, 90, GAME_HEIGHT);
  ctx.strokeStyle = "#f2d44a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.lineTo(GAME_WIDTH, 350);
  ctx.moveTo(605, 0);
  ctx.lineTo(605, GAME_HEIGHT);
  ctx.stroke();
  ctx.fillStyle = "#f4f7fb";
  for (let x = 700; x < 900; x += 28) ctx.fillRect(x, 418, 18, 62);
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(710, 120, 92, 34);
  ctx.fillStyle = "#111827";
  ctx.font = "16px sans-serif";
  ctx.fillText("당산역 출구", 720, 143);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(980, 380, 120, 28);
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText("버스정류장", 996, 400);
  ctx.fillStyle = "#f8fafc";
  ctx.fillText("상가 골목", 180, 225);
}

function drawCore(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.fillStyle = "#fb7185";
  ctx.beginPath();
  ctx.arc(state.core.x, state.core.y, CORE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff1f2";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LIVE", state.core.x, state.core.y + 6);
  ctx.textAlign = "start";
}

function drawPlayer(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.fillStyle = state.player.invincibleTimer > 0 ? "#fbcfe8" : "#ffffff";
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, PLAYER_RADIUS + 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ec4899";
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111827";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("KYMA", state.player.x, state.player.y + 5);
  ctx.textAlign = "start";
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  const color = {
    normal: "#ef4444",
    charger: "#f97316",
    camera: "#a855f7",
    obsessed: "#7f1d1d",
    midBoss: "#facc15",
    finalBoss: "#dc2626"
  }[enemy.type];
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = enemy.type.includes("Boss") ? "bold 14px sans-serif" : "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(enemy.type === "finalBoss" ? "리더" : enemy.type === "midBoss" ? "광클" : "팬", enemy.x, enemy.y + 4);
  ctx.fillStyle = "#111827";
  ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 12, enemy.radius * 2, 5);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 12, enemy.radius * 2 * Math.max(0, enemy.hp / enemy.maxHp), 5);
  ctx.textAlign = "start";
}

function drawProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile) {
  ctx.fillStyle = projectile.fromEnemy ? "#f8fafc" : "#fde047";
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
  ctx.fill();
  if (!projectile.fromEnemy) {
    ctx.fillStyle = "#111827";
    ctx.font = "12px sans-serif";
    ctx.fillText("♪", projectile.x - 4, projectile.y + 4);
  }
}

function drawDrop(ctx: CanvasRenderingContext2D, drop: Drop) {
  ctx.fillStyle = drop.kind === "exp" ? "#38bdf8" : "#22c55e";
  ctx.beginPath();
  ctx.arc(drop.x, drop.y, drop.kind === "exp" ? 7 : 9, 0, Math.PI * 2);
  ctx.fill();
}

function drawTrueFan(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#f9a8d4";
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("♡", x, y + 4);
  ctx.textAlign = "start";
}

function drawEffect(ctx: CanvasRenderingContext2D, effect: { kind: string; x: number; y: number; radius: number; time: number; duration: number }) {
  const alpha = 1 - effect.time / effect.duration;
  ctx.save();
  ctx.globalAlpha = Math.max(0.15, alpha * 0.45);
  ctx.strokeStyle = effect.kind === "qAura" ? "#f9a8d4" : effect.kind === "wBurst" ? "#fde047" : "#ffffff";
  ctx.fillStyle = effect.kind === "qAura" ? "#f9a8d4" : effect.kind === "wBurst" ? "#fde047" : "#f0abfc";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
