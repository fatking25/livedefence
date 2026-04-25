import type { GameState, SkillKey } from "../game/types";

export default function Hud({ state }: { state: GameState }) {
  const boss = state.enemies.find((enemy) => enemy.type === "midBoss" || enemy.type === "finalBoss");
  return (
    <div className="hud">
      <div className="hud-top">
        <Meter label="KYMA HP" value={state.player.hp} max={state.player.maxHp} />
        <Meter label="코어 HP" value={state.core.hp} max={state.core.maxHp} />
        <Meter label="팬심" value={state.player.fanGauge} max={100} />
        <div className="pill">Lv {state.player.level}</div>
        <div className="pill">EXP {Math.floor(state.player.exp)} / {state.player.expToNext}</div>
        <div className="pill">{formatTime(state.elapsedSec)}</div>
        <div className="pill">Wave {state.wave}</div>
      </div>
      <div className="skill-row">
        {(["q", "w", "e", "r"] as SkillKey[]).map((key) => (
          <div className={`skill-slot ${state.skills[key].unlocked ? "ready" : "locked"}`} key={key}>
            <strong>{key.toUpperCase()}</strong>
            <span>{state.skills[key].unlocked ? cooldownLabel(state, key) : "LOCK"}</span>
          </div>
        ))}
      </div>
      {boss && (
        <div className="boss-bar">
          <span>{boss.type === "finalBoss" ? "집착 팬 리더" : "광클 오빠"}</span>
          <div><i style={{ width: `${Math.max(0, boss.hp / boss.maxHp) * 100}%` }} /></div>
        </div>
      )}
      <div className="message">{state.message}</div>
    </div>
  );
}

function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="meter">
      <span>{label}</span>
      <div><i style={{ width: `${Math.max(0, value / max) * 100}%` }} /></div>
      <b>{Math.ceil(value)}</b>
    </div>
  );
}

function cooldownLabel(state: GameState, key: SkillKey) {
  if (key === "r" && state.player.fanGauge < 100) return "팬심";
  const cd = state.skills[key].cooldownRemaining;
  return cd > 0 ? `${cd.toFixed(1)}s` : "READY";
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
