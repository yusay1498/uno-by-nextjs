import Link from "next/link";

export default function OnlineEntryPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">オンライン対戦</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          設計書のルーム作成・参加フローに向けた初期導線ページです。
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
        ルーム作成・参加フォームとFirebase連携は次のPRで実装予定です。
      </div>
      <Link
        href="/"
        className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        モード選択へ戻る
      </Link>
    </main>
  );
}
