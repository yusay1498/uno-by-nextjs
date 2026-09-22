export const standardCardColors = ["red", "yellow", "green", "blue"] as const;
export const cardColors = [...standardCardColors, "wild"] as const;

export const numberCardValues = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;
export const actionCardValues = ["skip", "reverse", "drawTwo"] as const;
export const wildCardValues = ["wild", "wildDrawFour"] as const;
export const cardValues = [
  ...numberCardValues,
  ...actionCardValues,
  ...wildCardValues,
] as const;

export type CardColor = (typeof cardColors)[number];
export type CardValue = (typeof cardValues)[number];
export type Direction = 1 | -1;

export type Card = Readonly<{
  id: string;
  color: CardColor;
  value: CardValue;
}>;

export type HouseRules = Readonly<{
  stacking: boolean;
  sevenZero: boolean;
}>;

export type Player = Readonly<{
  uid: string;
  displayName: string;
  seatIndex: number;
  handCount: number;
  hasCalledUno: boolean;
  isConnected: boolean;
}>;

export type GameState = Readonly<{
  players: readonly Player[];
  currentTurnUid: string;
  direction: Direction;
  discardTop: Card;
  drawPileCount: number;
  pendingDrawCount: number;
  status: "waiting" | "playing" | "finished";
  houseRules: HouseRules;
}>;

export type GameAction =
  | Readonly<{ type: "playCard"; uid: string; card: Card; declaredColor?: CardColor }>
  | Readonly<{ type: "drawCard"; uid: string }>
  | Readonly<{ type: "callUno"; uid: string }>
  | Readonly<{ type: "challenge"; uid: string; targetUid: string }>;
