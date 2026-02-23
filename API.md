# API仕様書

## 概要
- 本APIは記事・タグ・アクター情報の取得と、横断検索を提供します。
- ルートベースは ` /web/articles ` です（`GET /` はヘルスチェック）。

## 共通
- レスポンス形式: JSON（`GET /` のみテキスト）
- 文字コード: UTF-8

### ステータスコード方針
- `200 OK`: 正常終了（検索APIは0件でも200）
- `400 Bad Request`: リクエスト不正（例: 必須クエリ不足）
- `404 Not Found`: 未定義パス、または未対応HTTPメソッド
- `500 Internal Server Error`: 想定外エラー（DB接続失敗など）

---

## 1. ヘルスチェック

### GET /

#### 説明
サーバーの疎通確認用エンドポイント。

#### レスポンス
- 200 OK
```text
Hello Hono!
```

#### 失敗時
- 404 Not Found
	- 例: `POST /`（未対応メソッド）
- 500 Internal Server Error
	- 例: ランタイム例外発生時

---

## 2. 記事一覧取得

### GET /web/articles/all_article

#### 説明
公開済み記事（`published = true`）の一覧を返します。

#### レスポンス
- 200 OK
```json
{
	"message": "This is all articles",
	"data": [
		{
			"id": 1,
			"title": "記事タイトル",
			"explanation": "記事説明",
			"published": true
		}
	]
}
```

#### 失敗時
- 404 Not Found
	- 例: `POST /web/articles/all_article`（未対応メソッド）
- 500 Internal Server Error
	- 例: 記事取得時のDBエラー

---

## 3. タグ一覧取得

### GET /web/articles/all_tag

#### 説明
タグ一覧を返します。

#### レスポンス
- 200 OK
```json
{
	"message": "This is all tags",
	"data": [
		{
			"id": 1,
			"name": "TypeScript"
		}
	]
}
```

#### 失敗時
- 404 Not Found
	- 例: `POST /web/articles/all_tag`（未対応メソッド）
- 500 Internal Server Error
	- 例: タグ取得時のDBエラー

---

## 4. アクター一覧取得

### GET /web/articles/all_actor

#### 説明
アクター一覧を返します。

#### レスポンス
- 200 OK
```json
{
	"message": "This is all actors",
	"data": [
		{
			"id": 1,
			"actor_name": "山田太郎",
			"actor_kana": "ヤマダタロウ"
		}
	]
}
```

#### 失敗時
- 404 Not Found
	- 例: `POST /web/articles/all_actor`（未対応メソッド）
- 500 Internal Server Error
	- 例: アクター取得時のDBエラー

---

## 5. 全文検索（記事・タグ・アクター横断）

### GET /web/articles/search_by_everything

#### 説明
以下フィールドを横断して記事を検索します。

- 記事: `title`, `explanation`
- タグ: `Tag.name`
- アクター: `Actor.actor_name`, `Actor.actor_kana`

#### クエリパラメータ
- `q` (string, 必須)
	- 検索語
	- 複数語は空白区切り（半角/全角どちらも可）

#### 検索仕様
- 1語の場合: 各対象フィールドに対して OR 検索
- 複数語の場合: **語ごとの OR 条件を AND 結合**
	- 例: `q=TypeScript 山田太郎`
	- 意味: 「TypeScript に一致」かつ「山田太郎に一致」する記事

#### レスポンス

##### 200 OK（ヒットあり）
```json
{
	"message": "This is searched articles",
	"data": [
		{
			"id": 1,
			"title": "TypeScript基礎",
			"explanation": "...",
			"published": true
		}
	]
}
```

##### 200 OK（ヒットなし）
```json
{
	"message": "No articles found",
	"data": []
}
```

##### 400 Bad Request（`q` 未指定）
```json
{
	"message": "query \"q\" is required",
	"data": []
}
```

#### 失敗時
- 400 Bad Request
  - 条件: `q` が未指定、または空文字
  - レスポンス:
```json
{
	"message": "query \"q\" is required",
	"data": []
}
```
- 404 Not Found
  - 例: `POST /web/articles/search_by_everything`（未対応メソッド）
- 500 Internal Server Error
  - 例: 検索実行時のDBエラー

---

## 6. 存在しないルート

### 任意の未定義パス

#### レスポンス
- 404 Not Found

#### 代表例
- `GET /not-found`
- `POST /web/articles/all_article`
- `PUT /web/articles/search_by_everything`

