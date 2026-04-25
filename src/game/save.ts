import { VERSION } from "./constants";
import { createInitialState } from "./entities";
import type { GameState, SaveData, Settings, SkillKey } from "./types";

export function toSaveData(state: GameState): SaveData {
  return {
    version: VERSION,
    savedAt: new Date().toISOString(),
    game: {
      elapsedSec: state.elapsedSec,
      wave: state.wave,
      stageId: "urban-live",
      bossState: state.bossState,
      bossSpawnedMid: state.bossSpawnedMid,
      bossSpawnedFinal: state.bossSpawnedFinal
    },
    player: {
      x: state.player.x,
      y: state.player.y,
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      moveSpeed: state.player.moveSpeed,
      attackPower: state.player.attackPower,
      attackInterval: state.player.attackInterval,
      attackRange: state.player.attackRange,
      level: state.player.level,
      exp: state.player.exp,
      expToNext: state.player.expToNext,
      fanGauge: state.player.fanGauge
    },
    core: { hp: state.core.hp, maxHp: state.core.maxHp },
    skills: {
      q: saveSkill(state, "q"),
      w: saveSkill(state, "w"),
      e: saveSkill(state, "e"),
      r: saveSkill(state, "r")
    },
    upgrades: state.upgrades,
    settings: state.settings
  };
}

function saveSkill(state: GameState, key: SkillKey) {
  const skill = state.skills[key];
  return { unlocked: skill.unlocked, level: skill.level, cooldownRemaining: skill.cooldownRemaining };
}

export function downloadSave(state: GameState) {
  const blob = new Blob([JSON.stringify(toSaveData(state), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kyma-save.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function fromSaveData(data: SaveData, fallbackSettings: Settings): GameState {
  if (data.version !== VERSION) throw new Error("지원하지 않는 저장 파일 버전입니다.");
  const state = createInitialState(data.settings || fallbackSettings);
  state.mode = "playing";
  state.elapsedSec = data.game.elapsedSec;
  state.wave = data.game.wave;
  state.bossState = data.game.bossState;
  state.bossSpawnedMid = data.game.bossSpawnedMid;
  state.bossSpawnedFinal = data.game.bossSpawnedFinal;
  state.player = { ...state.player, ...data.player, attackTimer: 0, invincibleTimer: 0, dashTimer: 0, lastDx: 0, lastDy: -1 };
  state.core = { ...state.core, ...data.core };
  for (const key of ["q", "w", "e", "r"] as SkillKey[]) {
    state.skills[key] = { ...state.skills[key], ...data.skills[key] };
  }
  state.upgrades = data.upgrades || [];
  state.settings = data.settings || fallbackSettings;
  state.message = "저장 파일 불러오기 완료";
  return state;
}
