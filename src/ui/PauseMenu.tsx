type Props = {
  onResume: () => void;
  onMain: () => void;
  onSave: () => void;
  onOpen: (panel: "settings" | "help" | "info") => void;
};

export default function PauseMenu({ onResume, onMain, onSave, onOpen }: Props) {
  return (
    <div className="modal-backdrop">
      <section className="panel compact">
        <h2>일시정지</h2>
        <button onClick={onResume}>계속하기</button>
        <button onClick={onSave}>저장하기</button>
        <button onClick={() => onOpen("settings")}>세팅</button>
        <button onClick={() => onOpen("help")}>도움말</button>
        <button onClick={() => onOpen("info")}>정보</button>
        <button onClick={onMain}>메인화면</button>
      </section>
    </div>
  );
}
