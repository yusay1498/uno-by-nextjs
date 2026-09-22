"use client";

import {
  createInitialGameSession,
  type InitialGameSession,
  type SessionPlayerSeed,
} from "../../../game-engine/lib/session";
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

export type LocalGameSession = InitialGameSession;

type LocalGameState = {
  readonly setup: LocalGameSetup | null;
  readonly session: LocalGameSession | null;
  initializeSetup: (setup: LocalGameSetup) => void;
  resetSetup: () => void;
};

type CreateLocalGameSessionOptions = Parameters<typeof createInitialGameSession>[2];

export const defaultLocalGameSetup: LocalGameSetup = {
  playerCount: 4,
  houseRules: {
    stacking: false,
    sevenZero: false,
  },
};

const normalizePlayerCount = (playerCount: number) =>
  Number.isFinite(playerCount)
    ? Math.min(
        LOCAL_PLAYER_COUNT.max,
        Math.max(LOCAL_PLAYER_COUNT.min, Math.trunc(playerCount)),
      )
    : defaultLocalGameSetup.playerCount;

const normalizeLocalGameSetup = (setup: LocalGameSetup): LocalGameSetup => ({
  ...setup,
  playerCount: normalizePlayerCount(setup.playerCount),
});

const createLocalPlayerUids = (playerCount: number) =>
  Array.from({ length: playerCount }, (_, index) => `player-${index + 1}`);

const createLocalPlayerSeeds = (
  playerUids: readonly string[],
): readonly SessionPlayerSeed[] =>
  playerUids.map((uid, index) => ({
    uid,
    displayName: `プレイヤー ${index + 1}`,
    seatIndex: index,
  }));

export function createLocalGameSession(
  setup: LocalGameSetup,
  options: CreateLocalGameSessionOptions = {},
): LocalGameSession {
  const normalizedSetup = normalizeLocalGameSetup(setup);
  const playerUids = createLocalPlayerUids(normalizedSetup.playerCount);
  return createInitialGameSession(
    createLocalPlayerSeeds(playerUids),
    normalizedSetup.houseRules,
    options,
  );
}

export const useLocalGameStore = create<LocalGameState>((set) => ({
  setup: null,
  session: null,
  initializeSetup: (setup) => {
    const normalizedSetup = normalizeLocalGameSetup(setup);

    set({
      setup: normalizedSetup,
      session: createLocalGameSession(normalizedSetup),
    });
  },
  resetSetup: () => set({ setup: null, session: null }),
}));
