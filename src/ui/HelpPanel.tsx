export default function HelpPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop top">
      <section className="panel">
        <h2>도움말</h2>
        <p>방향키로 이동하고, 평타는 자동으로 가장 가까운 악성 팬에게 발사됩니다.</p>
        <p>Q 팬서비스 오라, W 라이트 쇼, E 아이돌 스텝, R KYMA 라이브를 레벨업 보상으로 해금하세요.</p>
        <p>KYMA HP 또는 무대 코어 HP가 0이 되면 패배합니다. 최종 보스 집착 팬 리더를 처치하면 승리합니다.</p>
        <button onClick={onClose}>닫기</button>
      </section>
    </div>
  );
}
