type Props = {
  onStart: () => void;
  onLoad: (file: File) => void;
  onOpen: (panel: "settings" | "help" | "info") => void;
};

export default function MainMenu({ onStart, onLoad, onOpen }: Props) {
  return (
    <section className="menu-screen">
      <div className="title-block">
        <p>부제: KYMA 편</p>
        <h1>Live Defense</h1>
      </div>
      <div className="menu-actions">
        <button onClick={onStart}>게임 시작</button>
        <label className="button-like">
          불러오기
          <input type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && onLoad(event.target.files[0])} />
        </label>
        <button onClick={() => onOpen("settings")}>세팅</button>
        <button onClick={() => onOpen("help")}>도움말</button>
        <button onClick={() => onOpen("info")}>정보</button>
      </div>
    </section>
  );
}
