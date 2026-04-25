import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createInitialState } from "./game/entities";
import { loadSettings, saveSettings } from "./game/settings";
import { downloadSave, fromSaveData } from "./game/save";
import type { GameState, Settings, Upgrade } from "./game/types";
import MainMenu from "./ui/MainMenu";
import GameCanvas from "./ui/GameCanvas";
import Hud from "./ui/Hud";
import PauseMenu from "./ui/PauseMenu";
import SettingsPanel from "./ui/SettingsPanel";
import HelpPanel from "./ui/HelpPanel";
import InfoPanel from "./ui/InfoPanel";
import LevelUpPanel from "./ui/LevelUpPanel";
import GameOverPanel from "./ui/GameOverPanel";
import ClearPanel from "./ui/ClearPanel";
import { applyUpgrade } from "./game/upgrades";
import { resetSpawner } from "./game/spawner";
import { playSfx, syncBgm } from "./game/audio";

type Overlay = "settings" | "help" | "info" | null;

export default function App() {
  const initialSettings = useMemo(() => loadSettings(), []);
  const [game, setGame] = useState<GameState>(() => createInitialState(initialSettings));
  const gameRef = useRef(game);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const sync = useCallback((next: GameState) => {
    gameRef.current = next;
    setGame({ ...next });
  }, []);

  const mutate = useCallback((fn: (state: GameState) => void) => {
    const next = gameRef.current;
    fn(next);
    sync(next);
  }, [sync]);

  const startGame = useCallback(() => {
    resetSpawner();
    const next = createInitialState(gameRef.current.settings);
    next.mode = "playing";
    sync(next);
    setOverlay(null);
  }, [sync]);

  const updateSettings = useCallback((settings: Settings) => {
    saveSettings(settings);
    mutate((state) => {
      state.settings = settings;
    });
  }, [mutate]);

  useEffect(() => {
    syncBgm(game.mode, game.settings);
  }, [game.mode, game.settings]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement | null)?.closest("button, .button-like")) playSfx("click", gameRef.current.settings);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const loadSave = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    resetSpawner();
    sync(fromSaveData(parsed, gameRef.current.settings));
    setOverlay(null);
  }, [sync]);

  const chooseUpgrade = useCallback((upgrade: Upgrade) => {
    mutate((state) => applyUpgrade(state, upgrade));
  }, [mutate]);

  return (
    <main className="app-shell">
      {game.mode === "mainMenu" ? (
        <MainMenu onStart={startGame} onLoad={loadSave} onOpen={setOverlay} />
      ) : (
        <section className="game-shell">
          <GameCanvas gameRef={gameRef} onFrame={setGame} />
          <Hud state={game} />
        </section>
      )}

      {game.mode === "paused" && (
        <PauseMenu
          onResume={() => mutate((state) => { state.mode = "playing"; })}
          onMain={() => sync(createInitialState(gameRef.current.settings))}
          onSave={() => downloadSave(gameRef.current)}
          onOpen={setOverlay}
        />
      )}

      {game.mode === "levelUp" && <LevelUpPanel choices={game.levelUpChoices} onChoose={chooseUpgrade} />}
      {game.mode === "gameOver" && <GameOverPanel message={game.message} onRetry={startGame} onMain={() => sync(createInitialState(gameRef.current.settings))} />}
      {game.mode === "cleared" && <ClearPanel state={game} onRetry={startGame} onMain={() => sync(createInitialState(gameRef.current.settings))} />}
      {overlay === "settings" && <SettingsPanel settings={game.settings} onChange={updateSettings} onClose={() => setOverlay(null)} />}
      {overlay === "help" && <HelpPanel onClose={() => setOverlay(null)} />}
      {overlay === "info" && <InfoPanel onClose={() => setOverlay(null)} />}
    </main>
  );
}
