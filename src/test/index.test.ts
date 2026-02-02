import app from '../index'

describe('GET /', () => {
    it('ルートアクセスでHello Hono!が返ること', async () => {
        const response = await app.request('http://localhost:3000/')
        const text = await response.text()
        expect(text).toBe('Hello Hono!')
    })

    it('ステータスコード200が返ること', async () => {
        const response = await app.request('http://localhost:3000/')
        expect(response.status).toBe(200)
    })
})

describe('GET /web/articles/all_article', () => {
    it('全記事取得エンドポイントにアクセスできること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_article')
        expect(response.status).toBe(200)
    })

    it('JSON形式でレスポンスが返ること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_article')
        const json = await response.json() as { message: string, data: unknown[] }
        expect(json.message).toBe("This is all articles")
        expect(Array.isArray(json.data)).toBe(true)
    })
})

describe('GET /web/articles/all_tag', () => {
    it('全タグ取得エンドポイントにアクセスできること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_tag')
        expect(response.status).toBe(200)
    })

    it('JSON形式でレスポンスが返ること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_tag')
        const json = await response.json() as { message: string, data: unknown[] }
        expect(json.message).toBe("This is all tags")
        expect(Array.isArray(json.data)).toBe(true)
    })
})

describe('GET /web/articles/all_actor', () => {
    it('全アクター取得エンドポイントにアクセスできること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_actor')
        expect(response.status).toBe(200)
    })

    it('JSON形式でレスポンスが返ること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_actor')
        const json = await response.json() as { message: string, data: unknown[] }
        expect(json.message).toBe("This is all actors")
        expect(Array.isArray(json.data)).toBe(true)
    })
})

describe('存在しないルート', () => {
    it('404が返ること', async () => {
        const response = await app.request('http://localhost:3000/not-found')
        expect(response.status).toBe(404)
    })
})

describe('ミドルウェア', () => {
    it('リクエストが正常に処理されること', async () => {
        const response = await app.request('http://localhost:3000/web/articles/all_article')
        expect(response.ok).toBe(true)
    })
})