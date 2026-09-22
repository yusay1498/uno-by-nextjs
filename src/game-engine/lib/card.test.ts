import { describe, expect, test } from "vitest";
import { createDeck, dealInitialHands, shuffleDeck } from "./card";

describe("createDeck", () => {
  test("標準UNOデッキ 108 枚を生成する", () => {
    const deck = createDeck();

    expect(deck).toHaveLength(108);
    expect(new Set(deck.map((card) => card.id)).size).toBe(deck.length);
    expect(
      deck.filter((card) => card.color === "wild" && card.value === "wild"),
    ).toHaveLength(4);
    expect(
      deck.filter(
        (card) => card.color === "wild" && card.value === "wildDrawFour",
      ),
    ).toHaveLength(4);
  });
});

describe("shuffleDeck", () => {
  test("元の配列を破壊せず、同じ要素を並べ替える", () => {
    const deck = createDeck();
    const randomValues = [0.9, 0.1, 0.5, 0.3];
    let index = 0;

    const shuffled = shuffleDeck(
      deck,
      () => randomValues[index++ % randomValues.length] ?? 0,
    );

    expect(shuffled).not.toBe(deck);
    expect(new Set(shuffled.map((card) => card.id))).toEqual(
      new Set(deck.map((card) => card.id)),
    );
    expect(shuffled).not.toEqual(deck);
  });
});

describe("dealInitialHands", () => {
  test("各プレイヤーへ 7 枚ずつ配り、残り山札を返す", () => {
    const deck = createDeck();
    const playerUids = ["p1", "p2", "p3"] as const;

    const result = dealInitialHands(playerUids, deck);

    expect(result.hands.p1).toHaveLength(7);
    expect(result.hands.p2).toHaveLength(7);
    expect(result.hands.p3).toHaveLength(7);
    expect(result.remainingDeck).toHaveLength(deck.length - playerUids.length * 7);
    expect(result.hands.p1[0]?.id).toBe(deck[0]?.id);
    expect(result.hands.p2[0]?.id).toBe(deck[1]?.id);
    expect(result.hands.p3[0]?.id).toBe(deck[2]?.id);
  });

  test("重複したプレイヤーIDは拒否する", () => {
    const deck = createDeck();

    expect(() => dealInitialHands(["p1", "p1"], deck)).toThrow(
      "Player UIDs must be unique.",
    );
  });

  test.each([0.5, Number.NaN, Number.POSITIVE_INFINITY, 0, -1])(
    "無効な handSize=%p は拒否する",
    (handSize) => {
      const deck = createDeck();

      expect(() => dealInitialHands(["p1", "p2"], deck, handSize)).toThrow(
        "Hand size must be a positive integer.",
      );
    },
  );
});
