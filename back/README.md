### 書籍情報APIエンドポイント：
GOOGLE BOOKS APIから書籍情報を取得<br>
取得負荷の場合、国立国会図書館サーチAPI (SRU)にフォールバック

### 登録書籍CRUDエンドポイント：

### 初期化エンドポイント：
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
