"use client";
let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    return ctx;
  } catch {
    return null;
  }
}
export function tone(freq: number, dur = 0.09, type: OscillatorType = "sine", gain = 0.03) {
  try {
    const c = ac();
    if (!c) return;
    if (c.state === "suspended") void c.resume();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(Math.max(gain, 0.0001), c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + Math.max(dur, 0.02));
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  } catch {
    /* phones often block audio until a tap — never crash the floor */
  }
}
export function bootTick(i: number) {
  tone(220 + i * 40, 0.05, "square", 0.02);
}
export function lock() {
  tone(140, 0.12, "triangle", 0.04);
  window.setTimeout(() => tone(280, 0.08, "sine", 0.03), 80);
}
export function release() {
  tone(420, 0.08, "sine", 0.025);
}
