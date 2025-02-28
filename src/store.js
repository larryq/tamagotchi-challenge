import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useStore = create((set) => ({
  isGrown: false,
  setIsGrown: (isGrown) => set({ isGrown }),

  isReset: true,
  setIsReset: (isReset) => set({ isReset }),

  tamagotchiTotal: 0,
  tamagotchis: [],
  addTamagotchis: (tamagotchi) =>
    set((s) => ({
      tamagotchis: [...s.tamagotchis, tamagotchi],
      tamagotchiTotal: s.tamagotchiTotal + 1,
    })),
  removeTamagotchis: (tamagotchi) =>
    set((s) => ({
      tamagotchis: s.tamagotchis.filter((g) => g !== tamagotchi),
    })),

  tamagotchis: [],
  setTamagotchis: (tamagotchis) => set({ tamagotchis }),
  addTamagotchi: (tamagotchi) =>
    set((s) => ({ tamagotchis: [...s.tamagotchis, tamagotchi] })),
  removeTamagotchi: (tamagotchi) =>
    set((s) => ({
      tamagotchis: s.tamagotchis.filter((g) => g !== tamagotchi),
    })),
}));
