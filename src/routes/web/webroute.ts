import { Hono } from 'hono'
import { Env } from '../../types'
const webArticle = new Hono<Env>()

webArticle.get('/all_article', async (c) => {
    //getはtype.tsで定義したEnvの型情報を持っているからここで依存されたインスタンスができる
    const repo = c.get('articleRepo')
    // ここでrepoのメソッドを使って記事を取得したりできる
    const all_articles = await repo.findAll()
    return c.json({ message: "This is all articles", data: all_articles })
})

webArticle.get('/all_actor', async (c) => {
    const repo = c.get('actorRepo')
    // ここでrepoのメソッドを使ってアクターを取得したりできる
    const all_actors = await repo.findAll()
    return c.json({ message: "This is all actors", data: all_actors })
})

webArticle.get('/all_tag', async (c) => {
    const repo = c.get('tagRepo')
    // ここでrepoのメソッドを使ってタグを取得したりできる
    const all_tags = await repo.findAll()
    return c.json({ message: "This is all tags", data: all_tags })
})

webArticle.get('/search_by_everything', async (c) => {
    const keyword = c.req.query('q')?.trim() ?? ''
    if (!keyword) {
        return c.json({ message: 'query "q" is required', data: [] }, 400)
    }

    const repo = c.get('articleRepo')
    const searched_articles = await repo.findByKeyword(keyword)
    if (searched_articles.length === 0) {
        return c.json({ message: 'No articles found', data: [] })
    }

    return c.json({ message: 'This is searched articles', data: searched_articles })
})


export default webArticle