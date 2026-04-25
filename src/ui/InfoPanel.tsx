export default function InfoPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop top">
      <section className="panel">
        <h2>정보</h2>
        <p>게임명: Live Defense</p>
        <p>부제: KYMA 편</p>
        <p>버전: 0.1.0</p>
        <p>장르: 아이돌 액션 생존 디펜스</p>
        <p>배경: 도심 게릴라 라이브 맵</p>
        <p>제작: 개인 팬게임 프로토타입</p>
        <p>저작권 안내: 비상업적 팬게임 프로토타입</p>
        <button onClick={onClose}>닫기</button>
      </section>
    </div>
  );
}
