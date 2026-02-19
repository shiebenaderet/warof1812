/**
 * War of 1812 — Sound Engine
 *
 * All sounds synthesized via Web Audio API. No external audio files needed.
 * Produces period-appropriate fife & drum style music and battle sounds.
 */

let audioCtx = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicInterval = null;
let isMuted = false;
let musicPlaying = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);

    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0.25;
    musicGain.connect(masterGain);

    sfxGain = audioCtx.createGain();
    sfxGain.gain.value = 0.6;
    sfxGain.connect(masterGain);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ── Utilities ──

function playTone(freq, duration, type = 'square', gain = sfxGain, volume = 0.3) {
  const ctx = getCtx();
  if (isMuted) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(volume, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g);
  g.connect(gain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration, volume = 0.3, gain = sfxGain) {
  const ctx = getCtx();
  if (isMuted) return;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const g = ctx.createGain();
  g.gain.setValueAtTime(volume, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  source.connect(filter);
  filter.connect(g);
  g.connect(gain);
  source.start(ctx.currentTime);
}

// ── Sound Effects ──

export function playClick() {
  playTone(800, 0.06, 'square', sfxGain, 0.15);
}

export function playConfirm() {
  getCtx();
  if (isMuted) return;
  playTone(523, 0.1, 'triangle', sfxGain, 0.2);
  setTimeout(() => playTone(659, 0.1, 'triangle', sfxGain, 0.2), 80);
  setTimeout(() => playTone(784, 0.15, 'triangle', sfxGain, 0.2), 160);
}

export function playPhaseAdvance() {
  playTone(392, 0.12, 'triangle', sfxGain, 0.2);
  setTimeout(() => playTone(523, 0.15, 'triangle', sfxGain, 0.25), 100);
}

export function playPlaceTroop() {
  playTone(600, 0.08, 'square', sfxGain, 0.12);
}

export function playCannon() {
  playNoise(0.5, 0.4);
  playTone(80, 0.4, 'sine', sfxGain, 0.3);
}

export function playMusket() {
  playNoise(0.15, 0.25);
  playTone(200, 0.08, 'square', sfxGain, 0.1);
}

export function playBattleStart() {
  // Drum roll
  getCtx();
  if (isMuted) return;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => playNoise(0.06, 0.15), i * 60);
  }
  setTimeout(() => playNoise(0.2, 0.25), 500);
}

export function playVictory() {
  // Rising fanfare
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, 'triangle', sfxGain, 0.25), i * 150);
  });
}

export function playDefeat() {
  // Descending sad tones
  const notes = [392, 330, 262, 196];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'triangle', sfxGain, 0.2), i * 200);
  });
}

export function playEventCard() {
  // Dramatic reveal
  playTone(330, 0.15, 'triangle', sfxGain, 0.15);
  setTimeout(() => playTone(440, 0.2, 'triangle', sfxGain, 0.2), 120);
}

export function playQuizCorrect() {
  playTone(523, 0.1, 'sine', sfxGain, 0.2);
  setTimeout(() => playTone(784, 0.2, 'sine', sfxGain, 0.25), 100);
}

export function playQuizWrong() {
  playTone(200, 0.2, 'sawtooth', sfxGain, 0.1);
  setTimeout(() => playTone(160, 0.3, 'sawtooth', sfxGain, 0.1), 150);
}

// ── Background Music (Fife & Drum) ──

// Simple melody: "Yankee Doodle"-inspired fife pattern in C major
const MELODY = [
  523, 523, 587, 659, 523, 659, 587, 392,
  523, 523, 587, 659, 523, 0, 494, 0,
  523, 523, 587, 659, 698, 659, 587, 523,
  494, 392, 440, 494, 523, 523, 0, 0,
];

const DRUM_PATTERN = [
  1, 0, 0, 1, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 0, 1, 0, 0,
  1, 0, 1, 0, 1, 0, 0, 0,
];

let melodyIndex = 0;

function playMusicNote() {
  if (isMuted || !musicPlaying) return;
  const ctx = getCtx();

  // Fife note
  const freq = MELODY[melodyIndex % MELODY.length];
  if (freq > 0) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(g);
    g.connect(musicGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

  // Drum
  const drumHit = DRUM_PATTERN[melodyIndex % DRUM_PATTERN.length];
  if (drumHit) {
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    source.connect(filter);
    filter.connect(g);
    g.connect(musicGain);
    source.start(ctx.currentTime);
  }

  melodyIndex++;
}

export function startMusic() {
  if (musicPlaying) return;
  getCtx();
  musicPlaying = true;
  melodyIndex = 0;
  musicInterval = setInterval(playMusicNote, 220); // ~136 BPM
}

export function stopMusic() {
  musicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

export function toggleMusic() {
  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
  return musicPlaying;
}

export function setMuted(muted) {
  isMuted = muted;
  if (muted) stopMusic();
}

export function getMuted() {
  return isMuted;
}

export function isMusicPlaying() {
  return musicPlaying;
}

export function setMasterVolume(vol) {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
}

// Initialize audio context on first user interaction
export function initAudio() {
  getCtx();
}
