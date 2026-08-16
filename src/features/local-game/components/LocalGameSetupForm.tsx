"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  defaultLocalGameSetup,
  LOCAL_PLAYER_COUNT,
  useLocalGameStore,
} from "@/features/local-game/stores/localGameStore";

export function LocalGameSetupForm() {
  const router = useRouter();
  const initializeSetup = useLocalGameStore((state) => state.initializeSetup);
  const [playerCount, setPlayerCount] = useState(defaultLocalGameSetup.playerCount);
  const [stacking, setStacking] = useState(
    defaultLocalGameSetup.houseRules.stacking,
  );
  const [sevenZero, setSevenZero] = useState(
    defaultLocalGameSetup.houseRules.sevenZero,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    initializeSetup({
      playerCount,
      houseRules: {
        stacking,
        sevenZero,
      },
    });
    router.push("/local/play");
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-3 rounded-xl border border-zinc-300 p-5 dark:border-zinc-700">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">プレイヤー人数</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            2〜10人でローカル対戦を開始できます。
          </p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="player-count">
          人数
          <input
            id="player-count"
            name="playerCount"
            type="range"
            min={LOCAL_PLAYER_COUNT.min}
            max={LOCAL_PLAYER_COUNT.max}
            value={playerCount}
            onChange={(event) => setPlayerCount(Number(event.target.value))}
            className="w-full"
          />
          <span className="text-base font-semibold">{playerCount}人</span>
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-zinc-300 p-5 dark:border-zinc-700">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">ハウスルール</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            対局開始前のみ切り替えできます。
          </p>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
          <input
            type="checkbox"
            checked={stacking}
            onChange={(event) => setStacking(event.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="font-medium">重ね出し</span>
            <span className="mt-1 block text-zinc-600 dark:text-zinc-300">
              drawTwo / wildDrawFour を連続で重ねられる想定です。
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
          <input
            type="checkbox"
            checked={sevenZero}
            onChange={(event) => setSevenZero(event.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="font-medium">チャレンジ7-0</span>
            <span className="mt-1 block text-zinc-600 dark:text-zinc-300">
              7で手札交換、0で手札回転を有効にします。
            </span>
          </span>
        </label>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
        >
          この設定で開始準備へ進む
        </button>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          次の画面で設定内容を確認し、対戦画面実装へ繋げられる状態にします。
        </p>
      </div>
    </form>
  );
}
