"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocalGameStore } from "@/features/local-game/stores/localGameStore";

export function LocalGamePlayEntry() {
  const router = useRouter();
  const setup = useLocalGameStore((state) => state.setup);
  const resetSetup = useLocalGameStore((state) => state.resetSetup);

  useEffect(() => {
    if (!setup) {
      router.replace("/local");
    }
  }, [router, setup]);

  if (!setup) {
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

      <section className="space-y-2 rounded-xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
        <h2 className="text-lg font-semibold">次の実装予定</h2>
        <p>この画面は、今後のローカル対戦ボード実装へ接続するための開始地点です。</p>
        <p>次段階では配札・手番管理・画面受け渡しUIをここへ追加できます。</p>
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
