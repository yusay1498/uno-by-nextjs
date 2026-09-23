import { createDeck, dealInitialHands, shuffleDeck } from "./card";
import type { Card, GameState, HouseRules, Player } from "../types/game";

const DRAW_TWO_PENALTY = 2;

export type SessionPlayerSeed = Readonly<{
  uid: string;
  displayName: string;
  seatIndex: number;
}>;

export type InitialGameSession = Readonly<{
  hands: Readonly<Record<string, readonly Card[]>>;
  drawPile: readonly Card[];
  state: GameState;
}>;

type CreateInitialGameSessionOptions = Readonly<{
  deck?: readonly Card[];
  random?: () => number;
}>;

const getNextPlayerIndex = (
  currentIndex: number,
  direction: GameState["direction"],
  playerCount: number,
  stepCount = 1,
) => (((currentIndex + direction * stepCount) % playerCount) + playerCount) % playerCount;

const createPlayers = (
  playerSeeds: readonly SessionPlayerSeed[],
  hands: Readonly<Record<string, readonly Card[]>>,
): readonly Player[] =>
  playerSeeds.map((player) => ({
    uid: player.uid,
    displayName: player.displayName,
    seatIndex: player.seatIndex,
    handCount: hands[player.uid]?.length ?? 0,
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

const createOpeningTurnState = (
  players: readonly Player[],
  discardTop: Card,
): Pick<GameState, "currentTurnUid" | "direction" | "pendingDrawCount"> => {
  let direction: GameState["direction"] = 1;
  let currentPlayerIndex = 0;
  let pendingDrawCount = 0;

  switch (discardTop.value) {
    case "skip":
      currentPlayerIndex = getNextPlayerIndex(0, direction, players.length);
      break;
    case "reverse":
      direction = -1;
      currentPlayerIndex =
        players.length === 2
          ? 0
          : getNextPlayerIndex(0, direction, players.length);
      break;
    case "drawTwo":
      currentPlayerIndex = getNextPlayerIndex(0, direction, players.length);
      pendingDrawCount = DRAW_TWO_PENALTY;
      break;
    default:
      break;
  }

  return {
    currentTurnUid: players[currentPlayerIndex].uid,
    direction,
    pendingDrawCount,
  };
};

export function createInitialGameSession(
  playerSeeds: readonly SessionPlayerSeed[],
  houseRules: HouseRules,
  options: CreateInitialGameSessionOptions = {},
): InitialGameSession {
  if (playerSeeds.length < 2) {
    throw new Error("At least two players are required.");
  }

  const deck = options.deck ?? shuffleDeck(createDeck(), options.random);
  const playerUids = playerSeeds.map((player) => player.uid);
  const { hands, remainingDeck } = dealInitialHands(playerUids, deck);
  const { discardTop, drawPile } = selectOpeningDiscard(remainingDeck);
  const players = createPlayers(playerSeeds, hands);
  const openingTurnState = createOpeningTurnState(players, discardTop);

  return {
    hands,
    drawPile,
    state: {
      players,
      discardTop,
      drawPileCount: drawPile.length,
      status: "waiting",
      houseRules,
      ...openingTurnState,
    },
  };
}
