"use client";

import { create } from "zustand";

export const LOCAL_PLAYER_COUNT = {
  min: 2,
  max: 10,
} as const;

export type LocalHouseRules = {
  readonly stacking: boolean;
  readonly sevenZero: boolean;
};

export type LocalGameSetup = {
  readonly playerCount: number;
  readonly houseRules: LocalHouseRules;
};

type LocalGameState = {
  readonly setup: LocalGameSetup | null;
  initializeSetup: (setup: LocalGameSetup) => void;
  resetSetup: () => void;
};

export const defaultLocalGameSetup: LocalGameSetup = {
  playerCount: 4,
  houseRules: {
    stacking: false,
    sevenZero: false,
  },
};

export const useLocalGameStore = create<LocalGameState>((set) => ({
  setup: null,
  initializeSetup: (setup) =>
    set({
      setup: {
        ...setup,
        playerCount: Number.isFinite(setup.playerCount)
          ? Math.min(
              LOCAL_PLAYER_COUNT.max,
              Math.max(LOCAL_PLAYER_COUNT.min, Math.trunc(setup.playerCount)),
            )
          : defaultLocalGameSetup.playerCount,
      },
    }),
  resetSetup: () => set({ setup: null }),
}));
