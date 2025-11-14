## C0deハッカソン

Next.js 16 + TypeScript（`front/`）と FastAPI（`back/`）で構成されたシンプルな
フルスタック構成です。両者を同時に起動するとフロントエンドがサーバーコンポーネントから
バックエンドの REST API を叩き、取得したメッセージを画面へ表示します。

### Backend

```bash
cd back
uv sync  # もしくは `pip install -r requirements.txt`
uv run python main.py  # http://127.0.0.1:8000 で FastAPI が立ち上がります
```

エンドポイント:

- `GET /api/health` : ヘルスチェック
- `GET /api/greeting?name=YOUR_NAME` : フロントエンドが利用するメッセージ API
- `POST /api/books/search` : ISBN を JSON (`{"isbn": "978-4-04-102622-5"}` など) で渡すと
  Google Books API を経由してリアルタイムに書誌情報を返却

ポートを変更したい場合は `BACKEND_PORT` 環境変数を設定してください。

#### Google Books APIの設定

- `GOOGLE_BOOKS_API_URL` : デフォルトは `https://www.googleapis.com/books/v1/volumes`
- `GOOGLE_BOOKS_API_KEY` : 未設定でも動作しますが、独自の API キーを設定すると
  レート制限に余裕ができます

### Frontend

```bash
cd front
NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000" pnpm run dev
```

`NEXT_PUBLIC_BACKEND_URL` は `.env.local` でも設定可能です（未設定時は
`http://127.0.0.1:8000` にフォールバックします）。

画面内の「ISBN検索デモ」フォームから送信すると `POST /api/books/search` に対して
fetch を行い、戻ってきた Google Books の検索結果がカードに表示されます。
インターネット接続が必要です。テスト用 ISBN: `978-4-16-758312-8`,
`978-4-04-102622-5`, `978-4-08-771112-1`。

### 動作確認

1. 上記手順で FastAPI と Next.js の両方を起動
2. ブラウザで http://localhost:3000 を開く
3. 画面中央の「最新のバックエンドレスポンス」に API から取得したメッセージが表示されれば成功です 🎉
