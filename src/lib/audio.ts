"use client";
let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}
export function tone(freq: number, dur = 0.09, type: OscillatorType = "sine", gain = 0.03) {
  const c = ac(); if (!c) return;
  if (c.state === "suspended") c.resume();
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.value = freq; g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur);
}
export function bootTick(i: number) { tone(220 + i * 40, 0.05, "square", 0.02); }
export function lock() { tone(140, 0.12, "triangle", 0.04); setTimeout(() => tone(280, 0.08, "sine", 0.03), 80); }
export function release() { tone(420, 0.08, "sine", 0.025); }
