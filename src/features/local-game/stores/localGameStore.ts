"use client";

import {
  createDeck,
  dealInitialHands,
  shuffleDeck,
} from "../../../game-engine/lib/card";
import type { Card, GameState, Player } from "../../../game-engine/types/game";
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

export type LocalGameSession = Readonly<{
  hands: Readonly<Record<string, readonly Card[]>>;
  drawPile: readonly Card[];
  state: GameState;
}>;

type LocalGameState = {
  readonly setup: LocalGameSetup | null;
  readonly session: LocalGameSession | null;
  initializeSetup: (setup: LocalGameSetup) => void;
  resetSetup: () => void;
};

type CreateLocalGameSessionOptions = Readonly<{
  deck?: readonly Card[];
  random?: () => number;
}>;

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

const createLocalPlayerUids = (playerCount: number) =>
  Array.from({ length: playerCount }, (_, index) => `player-${index + 1}`);

const createLocalPlayers = (
  playerUids: readonly string[],
  hands: Readonly<Record<string, readonly Card[]>>,
): readonly Player[] =>
  playerUids.map((uid, index) => ({
    uid,
    displayName: `プレイヤー ${index + 1}`,
    seatIndex: index,
    handCount: hands[uid]?.length ?? 0,
    hasCalledUno: false,
    isConnected: true,
  }));

const selectOpeningDiscard = (remainingDeck: readonly Card[]) => {
  const discardIndex = remainingDeck.findIndex((card) => card.color !== "wild");

  if (discardIndex < 0) {
    throw new Error("Opening discard card is unavailable.");
  }

  return {
    discardTop: remainingDeck[discardIndex],
    drawPile: [
      ...remainingDeck.slice(0, discardIndex),
      ...remainingDeck.slice(discardIndex + 1),
    ],
  } as const;
};

export function createLocalGameSession(
  setup: LocalGameSetup,
  options: CreateLocalGameSessionOptions = {},
): LocalGameSession {
  const normalizedSetup: LocalGameSetup = {
    ...setup,
    playerCount: normalizePlayerCount(setup.playerCount),
  };
  const playerUids = createLocalPlayerUids(normalizedSetup.playerCount);
  const deck = options.deck ?? shuffleDeck(createDeck(), options.random);
  const { hands, remainingDeck } = dealInitialHands(playerUids, deck);
  const { discardTop, drawPile } = selectOpeningDiscard(remainingDeck);

  return {
    hands,
    drawPile,
    state: {
      players: createLocalPlayers(playerUids, hands),
      currentTurnUid: playerUids[0],
      direction: 1,
      discardTop,
      drawPileCount: drawPile.length,
      pendingDrawCount: 0,
      status: "playing",
      houseRules: normalizedSetup.houseRules,
    },
  };
}

export const useLocalGameStore = create<LocalGameState>((set) => ({
  setup: null,
  session: null,
  initializeSetup: (setup) => {
    const normalizedSetup: LocalGameSetup = {
      ...setup,
      playerCount: normalizePlayerCount(setup.playerCount),
    };

    set({
      setup: normalizedSetup,
      session: createLocalGameSession(normalizedSetup),
    });
  },
  resetSetup: () => set({ setup: null, session: null }),
}));
