// Gentle, synthesized wrong-answer sound. No audio files, API keys or network.
// The AudioContext is created only from a real button click to comply with autoplay rules.
let context = null;

export function playWrongBeep() {
  if (typeof window === 'undefined') return false;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  try {
    if (!context || context.state === 'closed') context = new AudioContextClass();
    if (context.state === 'suspended') void context.resume().catch(() => {});
    const time = context.currentTime + 0.008;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.055, time + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
    gain.connect(context.destination);
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(390, time);
    oscillator.frequency.setValueAtTime(310, time + 0.13);
    oscillator.connect(gain);
    oscillator.start(time);
    oscillator.stop(time + 0.29);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    return true;
  } catch {
    // The game still works if sound is disabled by the browser or device.
    return false;
  }
}
