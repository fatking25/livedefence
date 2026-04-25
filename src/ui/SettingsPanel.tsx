import type { Settings } from "../game/types";

type Props = {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onClose: () => void;
};

export default function SettingsPanel({ settings, onChange, onClose }: Props) {
  const patch = (next: Partial<Settings>) => onChange({ ...settings, ...next });
  return (
    <div className="modal-backdrop top">
      <section className="panel">
        <h2>세팅</h2>
        <label><input type="checkbox" checked={settings.bgmEnabled} onChange={(e) => patch({ bgmEnabled: e.target.checked })} /> 배경음악</label>
        <input type="range" min="0" max="100" value={settings.bgmVolume} onChange={(e) => patch({ bgmVolume: Number(e.target.value) })} />
        <label><input type="checkbox" checked={settings.sfxEnabled} onChange={(e) => patch({ sfxEnabled: e.target.checked })} /> 효과음</label>
        <input type="range" min="0" max="100" value={settings.sfxVolume} onChange={(e) => patch({ sfxVolume: Number(e.target.value) })} />
        <button onClick={onClose}>닫기</button>
      </section>
    </div>
  );
}
