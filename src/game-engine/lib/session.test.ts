import { describe, expect, test } from "vitest";
import { createDeck } from "./card";
import {
  createInitialGameSession,
  type SessionPlayerSeed,
} from "./session";

const playerSeeds: readonly SessionPlayerSeed[] = [
  { uid: "player-1", displayName: "プレイヤー 1", seatIndex: 0 },
  { uid: "player-2", displayName: "プレイヤー 2", seatIndex: 1 },
  { uid: "player-3", displayName: "プレイヤー 3", seatIndex: 2 },
] as const;
const twoPlayerSeeds = playerSeeds.slice(0, 2);

const defaultHouseRules = {
  stacking: false,
  sevenZero: false,
} as const;

const createDeckWithOpeningDiscard = (cardId: string, playerCount = 3) => {
  const deck = createDeck();
  const openingCard = deck.find((card) => card.id === cardId);

  expect(openingCard).toBeDefined();

  const remainingCards = deck.filter((card) => card.id !== openingCard?.id);
  return [
    ...remainingCards.slice(0, playerCount * 7),
    openingCard!,
    ...remainingCards.slice(playerCount * 7),
  ];
};

describe("createInitialGameSession", () => {
  test("プレイヤー情報と初期配札済みセッションを生成する", () => {
    const session = createInitialGameSession(playerSeeds, defaultHouseRules, {
      deck: createDeckWithOpeningDiscard("red-1-0"),
    });

    expect(session.state.status).toBe("playing");
    expect(session.state.players).toHaveLength(3);
    expect(session.state.currentTurnUid).toBe("player-1");
    expect(session.state.direction).toBe(1);
    expect(session.state.pendingDrawCount).toBe(0);
    expect(session.state.discardTop.color).not.toBe("wild");
    expect(session.state.drawPileCount).toBe(86);
    expect(session.drawPile).toHaveLength(86);
    expect(session.hands["player-1"]).toHaveLength(7);
    expect(session.hands["player-2"]).toHaveLength(7);
    expect(session.hands["player-3"]).toHaveLength(7);
  });

  test("開始時の場札候補が wild の場合は次の色付きカードを場札にして wild は山札へ残す", () => {
    const deck = createDeck();
    const openingWild = deck.find((card) => card.color === "wild");
    const openingColored = deck.find(
      (card) => card.color !== "wild" && card.id !== openingWild?.id,
    );

    expect(openingWild).toBeDefined();
    expect(openingColored).toBeDefined();

    const remainingCards = deck.filter(
      (card) => card.id !== openingWild?.id && card.id !== openingColored?.id,
    );
    const customDeck = [
      ...remainingCards.slice(0, 21),
      openingWild!,
      openingColored!,
      ...remainingCards.slice(21),
    ];

    const session = createInitialGameSession(playerSeeds, defaultHouseRules, {
      deck: customDeck,
    });

    expect(session.state.discardTop.id).toBe(openingColored?.id);
    expect(session.state.drawPileCount).toBe(deck.length - 22);
    expect(session.drawPile).toHaveLength(deck.length - 22);
    expect(session.drawPile.some((card) => card.id === openingWild?.id)).toBe(true);
  });

  test("開始時の場札が skip の場合は次のプレイヤーから開始する", () => {
    const session = createInitialGameSession(playerSeeds, defaultHouseRules, {
      deck: createDeckWithOpeningDiscard("red-skip-0"),
    });

    expect(session.state.currentTurnUid).toBe("player-2");
    expect(session.state.direction).toBe(1);
    expect(session.state.pendingDrawCount).toBe(0);
  });

  test("開始時の場札が reverse の場合は進行方向を反転して前のプレイヤーから開始する", () => {
    const session = createInitialGameSession(playerSeeds, defaultHouseRules, {
      deck: createDeckWithOpeningDiscard("red-reverse-0"),
    });

    expect(session.state.currentTurnUid).toBe("player-3");
    expect(session.state.direction).toBe(-1);
    expect(session.state.pendingDrawCount).toBe(0);
  });

  test("2人対戦で開始時の場札が reverse の場合はスキップ相当で最初のプレイヤーが続けて手番になる", () => {
    const session = createInitialGameSession(twoPlayerSeeds, defaultHouseRules, {
      deck: createDeckWithOpeningDiscard("red-reverse-0", 2),
    });

    expect(session.state.currentTurnUid).toBe("player-1");
    expect(session.state.direction).toBe(-1);
    expect(session.state.pendingDrawCount).toBe(0);
  });

  test("開始時の場札が drawTwo の場合は次のプレイヤーへペナルティを適用する", () => {
    const session = createInitialGameSession(playerSeeds, defaultHouseRules, {
      deck: createDeckWithOpeningDiscard("red-drawTwo-0"),
    });

    expect(session.state.currentTurnUid).toBe("player-2");
    expect(session.state.direction).toBe(1);
    expect(session.state.pendingDrawCount).toBe(2);
  });

  test("開始時の場札に色付きカードがない場合は例外を投げる", () => {
    const wildCard = createDeck().find((card) => card.color === "wild");

    expect(wildCard).toBeDefined();

    const wildOnlyDeck = Array.from({ length: 15 }, (_, index) => ({
      ...wildCard!,
      id: `${wildCard!.id}-${index}`,
    }));

    expect(() =>
      createInitialGameSession(playerSeeds.slice(0, 2), defaultHouseRules, {
        deck: wildOnlyDeck,
      }),
    ).toThrow("Opening discard card is unavailable.");
  });
});
