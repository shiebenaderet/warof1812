import { useState, useCallback, useEffect } from 'react';
import {
  initAudio,
  playClick,
  playConfirm,
  playPhaseAdvance,
  playPlaceTroop,
  playCannon,
  playBattleStart,
  playVictory,
  playDefeat,
  playEventCard,
  playQuizCorrect,
  playQuizWrong,
  startMusic,
  stopMusic,
  isMusicPlaying,
  setMuted,
  getMuted,
} from '../lib/sounds';

export default function useSounds() {
  const [muted, _setMuted] = useState(() => {
    try { return localStorage.getItem('war1812_muted') === 'true'; } catch { return false; }
  });
  const [musicOn, setMusicOn] = useState(false);

  // Apply mute state
  useEffect(() => {
    setMuted(muted);
    try { localStorage.setItem('war1812_muted', String(muted)); } catch { /* */ }
  }, [muted]);

  const toggleMute = useCallback(() => {
    _setMuted((prev) => {
      const next = !prev;
      if (next) stopMusic();
      return next;
    });
    setMusicOn(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (getMuted()) return;
    if (isMusicPlaying()) {
      stopMusic();
      setMusicOn(false);
    } else {
      initAudio();
      startMusic();
      setMusicOn(true);
    }
  }, []);

  // Sound trigger wrappers (no-op when muted)
  const sfx = {
    click: useCallback(() => { if (!getMuted()) { initAudio(); playClick(); } }, []),
    confirm: useCallback(() => { if (!getMuted()) { initAudio(); playConfirm(); } }, []),
    phaseAdvance: useCallback(() => { if (!getMuted()) { initAudio(); playPhaseAdvance(); } }, []),
    placeTroop: useCallback(() => { if (!getMuted()) { initAudio(); playPlaceTroop(); } }, []),
    cannon: useCallback(() => { if (!getMuted()) { initAudio(); playCannon(); } }, []),
    battleStart: useCallback(() => { if (!getMuted()) { initAudio(); playBattleStart(); } }, []),
    victory: useCallback(() => { if (!getMuted()) { initAudio(); playVictory(); } }, []),
    defeat: useCallback(() => { if (!getMuted()) { initAudio(); playDefeat(); } }, []),
    eventCard: useCallback(() => { if (!getMuted()) { initAudio(); playEventCard(); } }, []),
    quizCorrect: useCallback(() => { if (!getMuted()) { initAudio(); playQuizCorrect(); } }, []),
    quizWrong: useCallback(() => { if (!getMuted()) { initAudio(); playQuizWrong(); } }, []),
  };

  return {
    muted,
    musicOn,
    toggleMute,
    toggleMusic,
    sfx,
  };
}
