import { describe, expect, test } from "vitest";
import { createDeck } from "../../../game-engine/lib/card";
import {
  createLocalGameSession,
  defaultLocalGameSetup,
} from "./localGameStore";

describe("createLocalGameSession", () => {
  test("セットアップから初期配札済みのローカル対戦セッションを生成する", () => {
    const session = createLocalGameSession({
      ...defaultLocalGameSetup,
      playerCount: 3,
      houseRules: {
        stacking: true,
        sevenZero: false,
      },
    });

    expect(session.state.status).toBe("playing");
    expect(session.state.players).toHaveLength(3);
    expect(session.state.currentTurnUid).toBe("player-1");
    expect(session.state.houseRules).toEqual({
      stacking: true,
      sevenZero: false,
    });
    expect(session.state.discardTop.color).not.toBe("wild");
    expect(session.state.drawPileCount).toBe(86);
    expect(session.drawPile).toHaveLength(86);
    expect(session.hands["player-1"]).toHaveLength(7);
    expect(session.hands["player-2"]).toHaveLength(7);
    expect(session.hands["player-3"]).toHaveLength(7);
    expect(session.state.players.map((player) => player.handCount)).toEqual([
      7, 7, 7,
    ]);
  });

  test("開始時の場札候補が wild の場合は次の色付きカードを選ぶ", () => {
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
      ...remainingCards.slice(0, 14),
      openingWild!,
      openingColored!,
      ...remainingCards.slice(14),
    ];

    const session = createLocalGameSession(
      {
        ...defaultLocalGameSetup,
        playerCount: 2,
      },
      { deck: customDeck },
    );

    expect(session.state.discardTop.id).toBe(openingColored?.id);
    expect(session.state.discardTop.color).not.toBe("wild");
    expect(session.state.drawPileCount).toBe(deck.length - 15);
    expect(session.drawPile).toHaveLength(deck.length - 15);
    expect(session.drawPile.some((card) => card.id === openingWild?.id)).toBe(true);
  });
});
