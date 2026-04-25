import type { Upgrade } from "../game/types";

export default function LevelUpPanel({ choices, onChoose }: { choices: Upgrade[]; onChoose: (upgrade: Upgrade) => void }) {
  return (
    <div className="modal-backdrop">
      <section className="panel level-panel">
        <h2>레벨업</h2>
        <div className="choice-grid">
          {choices.map((choice) => (
            <button className="choice-card" key={choice.id} onClick={() => onChoose(choice)}>
              <strong>{choice.title}</strong>
              <span>{choice.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
