export type GameMode = "mainMenu" | "playing" | "paused" | "levelUp" | "gameOver" | "cleared";
export type SkillKey = "q" | "w" | "e" | "r";
export type EnemyType = "normal" | "charger" | "camera" | "obsessed" | "midBoss" | "finalBoss";
export type BossState = "none" | "midBoss" | "finalBoss" | "cleared";

export type Settings = {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
};

export type SkillState = {
  unlocked: boolean;
  level: number;
  cooldown: number;
  cooldownRemaining: number;
};

export type Player = {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  moveSpeed: number;
  attackPower: number;
  attackInterval: number;
  attackTimer: number;
  attackRange: number;
  level: number;
  exp: number;
  expToNext: number;
  fanGauge: number;
  invincibleTimer: number;
  dashTimer: number;
  lastDx: number;
  lastDy: number;
};

export type Core = {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
};

export type Enemy = {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  attackPower: number;
  attackTimer: number;
  radius: number;
  exp: number;
  fan: number;
  chargeTimer?: number;
  shootTimer?: number;
  age: number;
};

export type Projectile = {
  id: string;
  kind: "note" | "flash";
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  fromEnemy: boolean;
  life: number;
};

export type Drop = {
  id: string;
  kind: "exp" | "heal";
  x: number;
  y: number;
  value: number;
};

export type TrueFan = {
  id: string;
  x: number;
  y: number;
  timer: number;
};

export type Effect = {
  id: string;
  kind: "qAura" | "wBurst" | "rLive";
  x: number;
  y: number;
  radius: number;
  time: number;
  duration: number;
};

export type Upgrade = {
  id: string;
  title: string;
  description: string;
};

export type GameState = {
  mode: GameMode;
  elapsedSec: number;
  wave: number;
  bossState: BossState;
  bossSpawnedMid: boolean;
  bossSpawnedFinal: boolean;
  player: Player;
  core: Core;
  skills: Record<SkillKey, SkillState>;
  enemies: Enemy[];
  projectiles: Projectile[];
  drops: Drop[];
  trueFans: TrueFan[];
  effects: Effect[];
  upgrades: string[];
  levelUpChoices: Upgrade[];
  settings: Settings;
  message: string;
};

export type SaveData = {
  version: string;
  savedAt: string;
  game: Pick<GameState, "elapsedSec" | "wave" | "bossState" | "bossSpawnedMid" | "bossSpawnedFinal"> & { stageId: string };
  player: Omit<Player, "attackTimer" | "invincibleTimer" | "dashTimer" | "lastDx" | "lastDy">;
  core: Pick<Core, "hp" | "maxHp">;
  skills: Record<SkillKey, Pick<SkillState, "unlocked" | "level" | "cooldownRemaining">>;
  upgrades: string[];
  settings: Settings;
};
