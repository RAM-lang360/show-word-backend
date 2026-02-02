import app from '../index'

describe('GET /', () => {
    it('ルートアクセスでHello Hono!が返ること', async () => {
        const response = await app.request('http://localhost:3000/')
        const text = await response.text()
        expect(text).toBe('Hello Hono!')
    })
})