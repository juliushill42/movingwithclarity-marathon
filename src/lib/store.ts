"use client";
import { create } from "zustand";
import type { Concept } from "./catalog";
export type World = "idle" | "core" | "mesh" | "vault" | "ledger";
type FactoryState = {
  booted: boolean; webgl: boolean; reduced: boolean; mobile: boolean; world: World;
  hover: World | "operator" | null; concepts: Concept[]; selected: Concept | null; query: string;
  setBooted: (v: boolean) => void;
  setFlags: (p: Partial<Pick<FactoryState, "webgl" | "reduced" | "mobile">>) => void;
  setWorld: (w: World) => void; setHover: (h: FactoryState["hover"]) => void;
  setConcepts: (c: Concept[]) => void; setSelected: (c: Concept | null) => void; setQuery: (q: string) => void;
};
export const useFactory = create<FactoryState>((set) => ({
  booted: false, webgl: true, reduced: false, mobile: false, world: "idle", hover: null,
  concepts: [], selected: null, query: "",
  setBooted: (v) => set({ booted: v }), setFlags: (p) => set(p),
  setWorld: (w) => set({ world: w, selected: null }), setHover: (h) => set({ hover: h }),
  setConcepts: (c) => set({ concepts: c }), setSelected: (c) => set({ selected: c }), setQuery: (q) => set({ query: q }),
}));
