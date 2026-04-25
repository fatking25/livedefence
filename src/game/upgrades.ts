import type { GameState, SkillKey, Upgrade } from "./types";

const unlocks: Record<SkillKey, Upgrade> = {
  q: { id: "unlock-q", title: "Q 팬서비스 오라", description: "주변 악성 팬을 느리게 하고 팬심을 모읍니다." },
  w: { id: "unlock-w", title: "W 라이트 쇼", description: "주변 악성 팬에게 광역 피해와 넉백을 줍니다." },
  e: { id: "unlock-e", title: "E 아이돌 스텝", description: "이동 방향으로 대시하고 짧게 무적이 됩니다." },
  r: { id: "unlock-r", title: "R KYMA 라이브", description: "팬심 100으로 전체 공격과 코어 회복을 사용합니다." }
};

const basics: Upgrade[] = [
  { id: "attack-up", title: "공격력 증가", description: "평타와 일부 스킬 피해가 15% 증가합니다." },
  { id: "speed-up", title: "이동속도 증가", description: "KYMA 이동속도가 10% 증가합니다." },
  { id: "rate-up", title: "공격속도 증가", description: "평타 공격 주기가 10% 감소합니다." },
  { id: "hp-up", title: "최대 HP 증가", description: "최대 HP가 20 증가하고 즉시 회복합니다." },
  { id: "w-damage", title: "W 데미지 증가", description: "라이트 쇼 피해가 강화됩니다." },
  { id: "q-range", title: "Q 범위 증가", description: "팬서비스 오라 범위가 넓어집니다." }
];

export function makeLevelChoices(state: GameState): Upgrade[] {
  const choices: Upgrade[] = [];
  if (state.player.level >= 2 && !state.skills.q.unlocked) choices.push(unlocks.q);
  if (state.player.level >= 3 && !state.skills.w.unlocked) choices.push(unlocks.w);
  if (state.player.level >= 4 && !state.skills.e.unlocked) choices.push(unlocks.e);
  if (state.player.level >= 5 && !state.skills.r.unlocked) choices.push(unlocks.r);

  const pool = basics.filter((item) => item.id !== "w-damage" || state.skills.w.unlocked).filter((item) => item.id !== "q-range" || state.skills.q.unlocked);
  while (choices.length < 3 && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    choices.push(pool.splice(index, 1)[0]);
  }
  return choices.slice(0, 3);
}

export function applyUpgrade(state: GameState, upgrade: Upgrade) {
  state.upgrades.push(upgrade.id);
  if (upgrade.id.startsWith("unlock-")) {
    const key = upgrade.id.replace("unlock-", "") as SkillKey;
    state.skills[key].unlocked = true;
    state.skills[key].level = 1;
  }
  if (upgrade.id === "attack-up") state.player.attackPower *= 1.15;
  if (upgrade.id === "speed-up") state.player.moveSpeed *= 1.1;
  if (upgrade.id === "rate-up") state.player.attackInterval *= 0.9;
  if (upgrade.id === "hp-up") {
    state.player.maxHp += 20;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 20);
  }
  if (upgrade.id === "w-damage") state.skills.w.level += 1;
  if (upgrade.id === "q-range") state.skills.q.level += 1;
  state.levelUpChoices = [];
  state.mode = "playing";
  state.message = `${upgrade.title} 적용!`;
}
