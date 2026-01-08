# 済読
**C0deハッカソン Human Intelligence Award 受賞作品 (2025年10月)**

書店での出会いを大切にしたい、という思いから、書店で出会った本を（たとえ購入しなくても）記録しておけるアプリ、積んだままにしないためのアプリをつくりました。
表紙が一覧として表示されることで、積まれた状態の背表紙ではなく、出会った時の思いを思い出してほしい、という願いをこめています。

## 主な機能
* **自動書籍情報取得:** Google Books APIと連携し、ISBN入力のみで書名、著者、表紙画像などを自動補完。
* **ISBNバーコード読み込み:** ISBNを書籍バーコードから読み取り。
* **読了状況管理:**　本屋で出会った本を登録可能。所有している本、読了した本と分けて表示。

## 🛠 技術スタック
| カテゴリ | 使用技術 |
| :--- | :--- |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, pnpm |
| **Backend** | FastAPI, Uvicorn, Pydantic, uv |
| **Database** | PostgreSQL |
| **API** | Google Books API |

## Screenshots & Demo
### Main Interface
<p align="center">
  <img src="https://github.com/user-attachments/assets/9ad3e211-a740-4844-b929-f9f8d2b28bd2" width="90%" alt="Main Dashboard">
</p>

### Features
| Feature Analysis | User Interaction |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/c691aea7-e5f7-4e62-b721-d2f8adbe2aa7" width="100%"> | <img src="https://github.com/user-attachments/assets/83c18d2f-6bcb-4b65-8fc2-2404aa95743a" width="100%"> |
| <img src="https://github.com/user-attachments/assets/e8011a76-e816-4cc6-9cc9-842c6236808d" width="100%"> | <img src="https://github.com/user-attachments/assets/b46e2b4d-c1fc-4d38-9da6-92a6bf283c40" width="100%"> |

### Detail Views
<p align="center">
  <img src="https://github.com/user-attachments/assets/644c0448-7b9c-4709-8bdf-73c034fc6083" width="30%">
  <img src="https://github.com/user-attachments/assets/30aa40a9-eb7c-456a-be76-d0319aadb1d6" width="30%">
  <img src="https://github.com/user-attachments/assets/41e02f0e-8f60-4762-bf72-6bdab7f18a1c" width="30%">
</p>

### System Workflow / Data Flow
<p align="center">
  <img src="https://github.com/user-attachments/assets/6fe4b931-872e-4bfe-9ad2-a5403c9342b6" width="45%">
  <img src="https://github.com/user-attachments/assets/c6e3b71c-3fe9-4a10-b257-3be9d87fdd9d" width="45%">
</p>

## システム構成・ディレクトリ構造(バックエンド)

```
back/
├── api/routers/      # APIエンドポイント定義（CRUD、外部API連携など）
├── app/              # ビジネスロジック
│   ├── schemas/      # Pydanticによるデータモデル定義
│   └── services/     # DB操作や外部API呼び出しの具体的な処理
└── database/         # DB接続設定およびSQLAlchemyモデル
```

## ローカル起動方法
Next.js 16 + TypeScript（`front/`）と FastAPI（`back/`）で構成されたシンプルなフルスタック構成です。両者を同時に起動するとフロントエンドがサーバーコンポーネントから
バックエンドの REST API を叩き、取得したメッセージを画面へ表示します。

### Backend
```bash
cd back
uv sync  # もしくは `pip install -r requirements.txt`
uv run python main.py  # http://127.0.0.1:8000 で FastAPI が立ち上がります
```
エンドポイントを確認したい場合は、backのREADMEまたは、FastAPIのドキュメントを参照してください。
ポートを変更したい場合は `BACKEND_PORT` 環境変数を設定してください。

#### Google Books APIの設定

- `GOOGLE_BOOKS_API_URL` : デフォルトは `https://www.googleapis.com/books/v1/volumes`
- `GOOGLE_BOOKS_API_KEY` : 未設定でも動作しますが、独自の API キーを設定するとレート制限に余裕ができます

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
