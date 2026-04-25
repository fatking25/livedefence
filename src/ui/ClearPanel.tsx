import type { GameState } from "../game/types";

export default function ClearPanel({ state, onRetry, onMain }: { state: GameState; onRetry: () => void; onMain: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="panel compact">
        <h2>클리어</h2>
        <p>KYMA의 라이브가 끝까지 지켜졌습니다.</p>
        <p>생존 시간 {Math.floor(state.elapsedSec)}초 · 레벨 {state.player.level}</p>
        <button onClick={onRetry}>다시 시작</button>
        <button onClick={onMain}>메인화면</button>
      </section>
    </div>
  );
}
