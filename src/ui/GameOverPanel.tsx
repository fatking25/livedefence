export default function GameOverPanel({ message, onRetry, onMain }: { message: string; onRetry: () => void; onMain: () => void }) {
  return (
    <div className="modal-backdrop">
      <section className="panel compact">
        <h2>게임오버</h2>
        <p>{message}</p>
        <button onClick={onRetry}>다시 시작</button>
        <button onClick={onMain}>메인화면</button>
      </section>
    </div>
  );
}
