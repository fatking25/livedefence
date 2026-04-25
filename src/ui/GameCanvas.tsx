import { useEffect, useRef, type MutableRefObject } from "react";
import { GAME_HEIGHT, GAME_WIDTH } from "../game/constants";
import { createInputState, updateInput } from "../game/input";
import { drawGame, updateGame } from "../game/engine";
import type { GameState } from "../game/types";

type Props = {
  gameRef: MutableRefObject<GameState>;
  onFrame: (state: GameState) => void;
};

export default function GameCanvas({ gameRef, onFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef(createInputState());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "q", "w", "e", "r", "Q", "W", "E", "R"].includes(event.key)) event.preventDefault();
      if (event.key === "Escape") {
        const state = gameRef.current;
        if (state.mode === "playing") state.mode = "paused";
        else if (state.mode === "paused") state.mode = "playing";
        onFrame({ ...state });
      } else {
        updateInput(inputRef.current, event.key, true);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => updateInput(inputRef.current, event.key, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameRef, onFrame]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let notify = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      updateGame(gameRef.current, inputRef.current, dt);
      drawGame(ctx, gameRef.current);
      notify += dt;
      if (notify > 0.08 || gameRef.current.mode !== "playing") {
        notify = 0;
        onFrame({ ...gameRef.current });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gameRef, onFrame]);

  return <canvas className="game-canvas" ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} />;
}
