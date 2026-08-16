import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-12">
      <header className="space-y-3 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          UNO by Next.js
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
          プレイモードを選択してください。
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/local"
          className="rounded-xl border border-zinc-300 p-5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold">ローカル対戦</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            1台の端末を使って順番にプレイします。
          </p>
        </Link>
        <Link
          href="/online"
          className="rounded-xl border border-zinc-300 p-5 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold">オンライン対戦</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            ルームを作成して複数人でリアルタイム対戦します。
          </p>
        </Link>
      </section>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        詳細なゲーム画面は今後のPRで段階的に実装します。
      </p>
    </main>
  );
}
