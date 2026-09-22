"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Card } from "@/game-engine/types/game";
import { useLocalGameStore } from "@/features/local-game/stores/localGameStore";

const cardColorLabel: Record<Card["color"], string> = {
  red: "赤",
  yellow: "黄",
  green: "緑",
  blue: "青",
  wild: "ワイルド",
};

const cardValueLabel: Record<Card["value"], string> = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  skip: "スキップ",
  reverse: "リバース",
  drawTwo: "ドロー2",
  wild: "ワイルド",
  wildDrawFour: "ワイルドドロー4",
};

const formatCardLabel = (card: Card) =>
  card.color === "wild"
    ? cardValueLabel[card.value]
    : `${cardColorLabel[card.color]} ${cardValueLabel[card.value]}`;

export function LocalGamePlayEntry() {
  const router = useRouter();
  const setup = useLocalGameStore((state) => state.setup);
  const session = useLocalGameStore((state) => state.session);
  const resetSetup = useLocalGameStore((state) => state.resetSetup);
  const [isHandVisible, setIsHandVisible] = useState(false);

  const currentPlayer = useMemo(() => {
    if (!session) {
      return null;
    }

    return (
      session.state.players.find(
        (player) => player.uid === session.state.currentTurnUid,
      ) ?? session.state.players[0]
    );
  }, [session]);
  const currentHand = currentPlayer ? session?.hands[currentPlayer.uid] ?? [] : [];

  useEffect(() => {
    if (!setup || !session) {
      router.replace("/local");
    }
  }, [router, session, setup]);

  if (!setup || !session || !currentPlayer) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        セットアップ情報を確認しています。
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-zinc-300 p-5 dark:border-zinc-700">
        <h2 className="text-lg font-semibold">セットアップ内容</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-zinc-600 dark:text-zinc-300">プレイヤー人数</dt>
            <dd className="mt-1 text-lg font-semibold">{setup.playerCount}人</dd>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-zinc-600 dark:text-zinc-300">有効ルール</dt>
            <dd className="mt-1 font-medium">
              {[
                setup.houseRules.stacking ? "重ね出し" : null,
                setup.houseRules.sevenZero ? "チャレンジ7-0" : null,
              ]
                .filter(Boolean)
                .join(" / ") || "なし"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-300 p-5 dark:border-zinc-700">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">初期配札サマリー</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            最初の手番と場札を確認し、現在のプレイヤーへ端末を渡してください。
          </p>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-zinc-600 dark:text-zinc-300">現在の手番</dt>
            <dd className="mt-1 text-base font-semibold">{currentPlayer.displayName}</dd>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-zinc-600 dark:text-zinc-300">開始時の場札</dt>
            <dd className="mt-1 text-base font-semibold">
              {formatCardLabel(session.state.discardTop)}
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <dt className="text-zinc-600 dark:text-zinc-300">山札残り枚数</dt>
            <dd className="mt-1 text-base font-semibold">
              {session.state.drawPileCount}枚
            </dd>
          </div>
        </dl>
        <ul className="grid gap-3 text-sm sm:grid-cols-2">
          {session.state.players.map((player) => (
            <li
              key={player.uid}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="font-medium">{player.displayName}</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                手札 {player.handCount}枚
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">手札確認ガード</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            他のプレイヤーが見ていないことを確認してから、手札を表示してください。
          </p>
        </div>
        {isHandVisible ? (
          <ul className="flex flex-wrap gap-2" aria-label={`${currentPlayer.displayName}の手札`}>
            {currentHand.map((card) => (
              <li
                key={card.id}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
              >
                {formatCardLabel(card)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg bg-zinc-100 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {currentPlayer.displayName}の手札は非表示です。
          </p>
        )}
        <button
          type="button"
          onClick={() => setIsHandVisible((current) => !current)}
          className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isHandVisible
            ? `${currentPlayer.displayName}の手札を隠す`
            : `${currentPlayer.displayName}の手札を表示する`}
        </button>
      </section>

      <section className="space-y-2 rounded-xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
        <h2 className="text-lg font-semibold">次の実装予定</h2>
        <p>このPRでは初期配札と確認導線までを追加しています。</p>
        <p>次段階ではカード操作と手番交代の進行処理を小さく分けて追加できます。</p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/local"
          onClick={resetSetup}
          className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          設定をやり直す
        </Link>
        <button
          type="button"
          onClick={resetSetup}
          className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          セットアップを破棄する
        </button>
      </div>
    </div>
  );
}
