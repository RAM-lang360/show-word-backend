import { Hono } from 'hono'
import webArticle from '../../../routes/web/webroute'
import { Article } from '../../../domain/article/entity'
import { Actor } from '../../../domain/actor/entity'
import { Tag } from '../../../domain/tag/entity'
import { ArticleRepository } from '../../../domain/article/repository'
import { ActorRepository } from '../../../domain/actor/repository'
import { TagRepository } from '../../../domain/tag/repository'
import { Env } from '../../../types'

// モックリポジトリの作成
const createMockArticleRepository = (articles: Article[]): ArticleRepository => ({
    findAll: vi.fn().mockResolvedValue(articles),
    findById: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
})

const createMockActorRepository = (actors: Actor[]): ActorRepository => ({
    findAll: vi.fn().mockResolvedValue(actors),
    findById: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
})

const createMockTagRepository = (tags: Tag[]): TagRepository => ({
    findAll: vi.fn().mockResolvedValue(tags),
    findById: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
})

type MockRepos = {
    articleRepo: ArticleRepository
    actorRepo: ActorRepository
    tagRepo: TagRepository
}

// テスト用のアプリを作成（ミドルウェアでモックリポジトリを注入）
const createTestApp = (repos: MockRepos) => {
    const app = new Hono<Env>()
    app.use('*', async (c, next) => {
        c.set('articleRepo', repos.articleRepo)
        c.set('actorRepo', repos.actorRepo)
        c.set('tagRepo', repos.tagRepo)
        await next()
    })
    app.route('/', webArticle)
    return app
}

// デフォルトのモックリポジトリセットを作成
const createDefaultMockRepos = (): MockRepos => ({
    articleRepo: createMockArticleRepository([]),
    actorRepo: createMockActorRepository([]),
    tagRepo: createMockTagRepository([]),
})

describe('routes/web/article', () => {
    describe('GET /all_article', () => {
        it('記事一覧を取得できること', async () => {
            const mockArticles = [
                new Article(1, 'テスト記事1', '説明1', true),
                new Article(2, 'テスト記事2', '説明2', true),
            ]
            const repos = createDefaultMockRepos()
            repos.articleRepo = createMockArticleRepository(mockArticles)
            const app = createTestApp(repos)

            const response = await app.request('/all_article')

            expect(response.status).toBe(200)
            const json = await response.json() as { message: string, data: Article[] }
            expect(json.data).toHaveLength(2)
            expect(repos.articleRepo.findAll).toHaveBeenCalledTimes(1)
        })

        it('記事が0件の場合は空配列が返ること', async () => {
            const repos = createDefaultMockRepos()
            const app = createTestApp(repos)

            const response = await app.request('/all_article')

            expect(response.status).toBe(200)
            const json = await response.json() as { message: string, data: Article[] }
            expect(json.data).toEqual([])
        })

        it('レスポンスにJSON形式で記事データが含まれること', async () => {
            const mockArticles = [
                new Article(1, 'タイトル', '説明文', true),
            ]
            const repos = createDefaultMockRepos()
            repos.articleRepo = createMockArticleRepository(mockArticles)
            const app = createTestApp(repos)

            const response = await app.request('/all_article')

            const json = await response.json() as { message: string, data: Article[] }
            expect(json.data[0].id).toBe(1)
            expect(json.data[0].title).toBe('タイトル')
            expect(json.data[0].explanation).toBe('説明文')
            expect(json.data[0].published).toBe(true)
        })
    })

    describe('GET /all_tag', () => {
        it('全タグ取得エンドポイントにアクセスできること', async () => {
            const repos = createDefaultMockRepos()
            const app = createTestApp(repos)

            const response = await app.request('/all_tag')

            expect(response.status).toBe(200)
        })

        it('タグ一覧を取得できること', async () => {
            const mockTags = [
                new Tag(1, 'タグ1'),
                new Tag(2, 'タグ2'),
            ]
            const repos = createDefaultMockRepos()
            repos.tagRepo = createMockTagRepository(mockTags)
            const app = createTestApp(repos)

            const response = await app.request('/all_tag')

            const json = await response.json() as { message: string, data: Tag[] }
            expect(json.message).toBe("This is all tags")
            expect(repos.tagRepo.findAll).toHaveBeenCalledTimes(1)
        })
    })

    describe('GET /all_actor', () => {
        it('全アクター取得エンドポイントにアクセスできること', async () => {
            const repos = createDefaultMockRepos()
            const app = createTestApp(repos)

            const response = await app.request('/all_actor')

            expect(response.status).toBe(200)
        })

        it('アクター一覧を取得できること', async () => {
            const mockActors = [
                new Actor(1, 'アクター1'),
                new Actor(2, 'アクター2'),
            ]
            const repos = createDefaultMockRepos()
            repos.actorRepo = createMockActorRepository(mockActors)
            const app = createTestApp(repos)

            const response = await app.request('/all_actor')

            const json = await response.json() as { message: string, data: Actor[] }
            expect(json.message).toBe("This is all actors")
            expect(repos.actorRepo.findAll).toHaveBeenCalledTimes(1)
        })
    })

    describe('存在しないルート', () => {
        it('404が返ること', async () => {
            const repos = createDefaultMockRepos()
            const app = createTestApp(repos)

            const response = await app.request('/not-found')

            expect(response.status).toBe(404)
        })
    })
})
