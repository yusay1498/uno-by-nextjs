---
applyTo: "**/Dockerfile,**/compose*.yml,**/docker-compose*.yml,**/compose*.yaml,**/docker-compose*.yaml"
---

# Docker 固有レビュー観点

## Dockerfile
- マルチステージビルドを活用しているか（最終イメージの軽量化）
- 不要なファイルを `.dockerignore` で除外しているか
- レイヤーキャッシュを意識した命令順序になっているか（変更頻度の低い命令を先に）
- root ユーザーで実行していないか（`USER` ディレクティブの使用）
- 機密情報（パスワード、キー）がイメージに含まれていないか
- `HEALTHCHECK` が定義されているか

## docker-compose
- サービス間の依存関係（`depends_on` + ヘルスチェック条件）が適切か
- ボリュームのマウントが適切か（データ永続化）
- 環境変数に機密情報を直書きしていないか（`.env` ファイルやシークレット管理）
- PostgreSQL のデータが永続化されているか（named volume）
