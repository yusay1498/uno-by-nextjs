---
applyTo: "src/**/*.ts,src/**/*.tsx"
---

# Next.js / React / TypeScript 固有レビュー観点

このファイルは `src/` 配下のTypeScript/TSXファイルに対して適用されます。

## TypeScript
- `any` を使用していないか（`unknown` で代替できないか）
- `discriminated union`、`satisfies`、`as const` を適切に活用しているか
- API境界の型安全が確保されているか
- `readonly` で不変性を表現できる箇所を見逃していないか

## Reactパターン/副作用
- `useEffect` の依存配列が正しいか、クリーンアップが適切か
- 再レンダ最適化（`memo`/`useMemo`/`useCallback`）が適切に使われているか（過剰な最適化も指摘する）
- Suspense/エラーバウンダリの設計が適切か

## Next.js App Router
- **Server Components / Client Components の使い分け**
  - `use client` は本当に必要な箇所のみに限定しているか
  - Server Component で完結できる処理を Client Component にしていないか
- **データ取得とキャッシュ**
  - `revalidate`/`dynamic`/`generateStaticParams` の設定が適切か
  - 不要な動的レンダリングを避けているか
- **レイアウト構成**
  - `layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx` が適切に配置されているか
- **画像/フォント最適化**
  - `next/image`、`next/font` を使用しているか
  - コード分割（`dynamic import`）が適切か
- **Turbopack**
  - Turbopack 使用時の制約・互換性（外部プラグインやビルド結果の検証）
