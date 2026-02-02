import { Hono } from 'hono'

const webArticle = new Hono()

webArticle.get('/all_article', (c) => {
    return c.json({ message: "This is all articles" })
})

webArticle.get('/all_tag', (c) => {
    return c.json({ message: "This is all tags" })
})

webArticle.get('/all_actor', (c) => {
    return c.json({ message: "This is all actors" })
})

export default webArticle