import type { GameMode, Settings } from "./types";

const SFX_FILES = {
  hit: "/audio/hit.ogg",
  click: "/audio/cllick.ogg"
} as const;

let bgm: HTMLAudioElement | null = null;

export function syncBgm(mode: GameMode, settings: Settings) {
  if (!settings.bgmEnabled || mode === "mainMenu" || mode === "gameOver" || mode === "cleared") {
    stopBgm();
    return;
  }

  if (!bgm) {
    bgm = new Audio("/audio/bgm.mp3");
    bgm.loop = true;
  }

  bgm.volume = settings.bgmVolume / 100;
  bgm.play().catch(() => {
    return;
  });
}

export function stopBgm() {
  if (!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
}

export function playSfx(name: keyof typeof SFX_FILES, settings?: Settings) {
  if (settings && (!settings.sfxEnabled || settings.sfxVolume <= 0)) return;
  const sound = new Audio(SFX_FILES[name]);
  sound.volume = settings ? settings.sfxVolume / 100 : 0.75;
  sound.play().catch(() => {
    return;
  });
}
