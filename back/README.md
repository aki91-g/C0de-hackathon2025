## 構成
```
back
├── main.py
├── api/
│   └──routers/
│       ├── crud.py
│       ├── external_api.py
│       ├── initialize.py
│       └── status.py
├── app/
│   ├── schemas/
│   │   ├── books.py
│   │   └── external_books.py
│   └── services/
│       ├── external_api_service.py
│       └── put_service.py
└── database/
    ├── connection.py 
    └── models/
        ├── book_model.py
        └── 
```
---
### 1. 書籍情報エンドポイント (external apis)：

`api/routers/external_api.py` <p>
- GOOGLE BOOKS APIから書籍情報を取得<br>
- 取得負荷の場合、国立国会図書館サーチAPI (SRU)にフォールバック<br>

**依存関係**
- `app/schemas/external_books.py` <br>
- `app/services/external_api_service.py` <br>


---
### 2. 登録書籍CRUDエンドポイント (books)：

**依存関係**
- `app/schemas/books.py` <br>
- `app/services/put_service.py` <br>
- `database/connection.py` <br>
- `database/models/book_model.py` <br>
---


### 3. 初期化エンドポイント (initialize)：
- 外部API取得エンドポイントのテスト兼用
- 20個のうち、1個はNot foundになる
- 登録本を増やしたかったら、api/endpoints/initialize.pyのTEST_ISBNsに追加
- パラメータに`confirm = true`必要


Response body<br>
```
{
  "message": "Database successfully initialized. 19 books inserted from external API. 1 books failed to load.",
  "status": "success",
  "failed_isbns": [
    "9781250005574"
  ]
}
```

**依存関係**
- `app/services/external_api_service.py` <br>
- `database/connection.py` <br>
- `database/models/book_model.py` <br>

---
### 4. ステータスカウント取得エンドポイント (status count)：
`app/endpoints/initialize.py` <p>

**依存関係**
- `app/schemas/books.py` <br>
- `database/connection.py` <br>
- `database/models/book_model.py` <br>

---

###
# 猫へ

## はじめに
バックエンドへようこそ。
ここでは、主に以下の3つのpythonライブラリを使用しています。
- fastAPI
- pydantic
- SQLalchemy
<p>
fastAPIは、エンドポイントをfunctionとして記述することで、APIを構築できるライブラリです。さらに、Webブラウザで試せるAPIのドキュメントを自動で作成してくれます。(/doc 機能)<p>
pydanticは、Pythonのクラスと型ヒントを使って、受け取るデータや返すデータのスキーマを管理できるライブラリです<p>
SQLalchemyは、データベースにアクセス、操作できるようにするライブラリです。これにより、データベースのテーブルをpythonのclassとして扱えるようになります。<br><small>このようなシステムのことを一般にO/Rマッパーなどとも言います。</small><p>

---

今回のタスクでは、fastAPIやSQLalchemyのロジックを編集する必要はありませんが、依存関係にpydanticが含まれます。また、スキーマを編集したい場合はpydanticを直接使用します。

## タスク

### 書籍情報エンドポイント (external apis)の拡張
このエンドポイントの役割は大きく2段階に分けられます。
1. 本についての必要な情報を、ISBNを用いて外部のAPIまたは公開データベースから取得する。

2. 形式をスキーマを用いて整えて返す。

**現在実装済み機能**
- GOOGLE BOOKS APIから書籍情報を取得<br>
- 取得できなかった場合、国立国会図書館サーチAPI (SRU)にフォールバック<br>
- 取得した情報をスキーマを用いて整えて返す。<br>

**新たに実装してほしいこと** <p>
1. **情報源の拡張**:<br>
GOOGLE BOOKS APIや国立国会図書館サーチAPI (SRU)からデータを取得する関数を参考に、
信頼できる外部のAPIまたは公開データベースから情報を取得する関数を`app/services/external_api_service.py` に追加する。<p>
2. **情報の補足**<br>
現在はGOOGLE BOOKS APIからデータを取得できなかったときのみ、国立国会図書館サーチAPIを試している。これを、足りない情報だけを補うように修正する。<br>
例：Google Books APIで「本の表紙の画像URL」のみが取れなかった場合、新しく追加したAPIに問い合わせて、「本の表紙の画像URL」のみを補足する。

**編集するファイル**
- `app/services/external_api_service.py` <br>
主に編集するファイル。外部APIとの連携を行う。<p>
- `app/schemas/external_books.py` <br>
取得するデータの形式を更新する場合に編集するファイル。<br>
**(注)**<br>
スキーマを更新したいときは、他のスキーマと連携させるため、更新内容を共有してください。できるだけ早く対応します。<br>
<small>余裕があれば、READMEに形式を追記しておいてくれると、助かります。（書き方については、このREADME上部、初期化エンドポイント部分参照）</small>
