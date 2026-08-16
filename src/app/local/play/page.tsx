import Link from "next/link";
import { LocalGamePlayEntry } from "@/features/local-game/components/LocalGamePlayEntry";

export default function LocalPlayPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">ローカル対戦開始準備</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          セットアップ結果を確認し、今後のプレイ画面実装へ繋げる導線です。
        </p>
      </header>
      <LocalGamePlayEntry />
      <Link
        href="/"
        className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        モード選択へ戻る
      </Link>
    </main>
  );
}
