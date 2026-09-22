import {
  actionCardValues,
  standardCardColors,
  type Card,
  type CardValue,
  numberCardValues,
  wildCardValues,
} from "../types/game";

const INITIAL_HAND_SIZE = 7;
const WILD_CARD_COPIES = 4;

type DrawDeck = readonly Card[];
type DealHandsResult = Readonly<{
  hands: Readonly<Record<string, readonly Card[]>>;
  remainingDeck: readonly Card[];
}>;

const createCard = (color: Card["color"], value: CardValue, copyIndex: number): Card => ({
  id: `${color}-${value}-${copyIndex}`,
  color,
  value,
});

export function createDeck(): readonly Card[] {
  const coloredCards = standardCardColors.flatMap((color) => [
    createCard(color, "0", 0),
    ...numberCardValues
      .filter((value) => value !== "0")
      .flatMap((value) => [
        createCard(color, value, 0),
        createCard(color, value, 1),
      ]),
    ...actionCardValues.flatMap((value) => [
      createCard(color, value, 0),
      createCard(color, value, 1),
    ]),
  ]);

  const wildCards = wildCardValues.flatMap((value) =>
    Array.from({ length: WILD_CARD_COPIES }, (_, index) =>
      createCard("wild", value, index),
    ),
  );

  return [...coloredCards, ...wildCards];
}

export function shuffleDeck(
  deck: DrawDeck,
  random: () => number = Math.random,
): readonly Card[] {
  const shuffled = [...deck];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function dealInitialHands(
  playerUids: readonly string[],
  deck: DrawDeck,
  handSize: number = INITIAL_HAND_SIZE,
): DealHandsResult {
  if (playerUids.length === 0) {
    throw new Error("At least one player is required.");
  }

  if (new Set(playerUids).size !== playerUids.length) {
    throw new Error("Player UIDs must be unique.");
  }

  if (!Number.isInteger(handSize) || handSize <= 0) {
    throw new Error("Hand size must be a positive integer.");
  }

  const requiredCards = playerUids.length * handSize;
  if (deck.length < requiredCards) {
    throw new Error("Deck does not contain enough cards.");
  }

  const hands = Object.fromEntries(playerUids.map((uid) => [uid, [] as Card[]]));
  let nextCardIndex = 0;

  for (let round = 0; round < handSize; round += 1) {
    for (const uid of playerUids) {
      hands[uid].push(deck[nextCardIndex]);
      nextCardIndex += 1;
    }
  }

  return {
    hands,
    remainingDeck: deck.slice(nextCardIndex),
  };
}
