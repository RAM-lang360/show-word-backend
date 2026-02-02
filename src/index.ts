import { Hono } from 'hono'
import { Env } from './types'
import { PrismaArticleRepository } from './infrastructure/article/prisma-repository'
import { PrismaActorRepository } from './infrastructure/actor/prisma-repository'
import { PrismaTagRepository } from './infrastructure/tag/prisma-repository'
import { prisma } from '../lib/prisma'
const app = new Hono<Env>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// 依存性の注入を実行するミドルウェア *はワイルドカードを意味する
app.use('*', async (c, next) => {
  //本物のprismaクライアントを使ってリポジトリを生成
  const repo = new PrismaArticleRepository(prisma)
  c.set('articleRepo', repo)
  await next()
})

app.use('*', async (c, next) => {
  const repo = new PrismaActorRepository(prisma)
  c.set('actorRepo', repo)
  await next()
})

app.use('*', async (c, next) => {
  const repo = new PrismaTagRepository(prisma)
  c.set('tagRepo', repo)
  await next()
})

// ルートの登録
import webArticle from './routes/web/webroute'
app.route('/web/articles', webArticle)
export default app
