// Pure Web Audio API gentle purring & cute chime synthesizer (zero external assets needed)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Generates a soft, gentle feline purring loop
 */
export function playPurrSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Low frequency oscillator for the rhythmic purr vibration (approx 25Hz - 30Hz)
    const purrOsc = ctx.createOscillator();
    purrOsc.type = 'sawtooth';
    purrOsc.frequency.setValueAtTime(28, now);

    // Filter to make it warm, muffled and throat-like
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);

    // Gain envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.16, now + 1.1);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.6);

    // Secondary subtle sine harmonic
    const sineOsc = ctx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.setValueAtTime(56, now);

    const sineGain = ctx.createGain();
    sineGain.gain.setValueAtTime(0.08, now);

    purrOsc.connect(filter);
    sineOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    purrOsc.start(now);
    sineOsc.start(now);
    purrOsc.stop(now + 1.6);
    sineOsc.stop(now + 1.6);
  } catch (e) {
    console.error("Purr sound error", e);
  }
}

/**
 * Generates a cute happy soft chirp chime
 */
export function playHappyChirp() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.28); // C6

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.error("Chirp sound error", e);
  }
}
