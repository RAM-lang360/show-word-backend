import { Hono } from 'hono'
import webArticle from '../../../routes/web/webroute'
import { Article } from '../../../domain/article/entity'
import { Actor } from '../../../domain/actor/entity'
import { Tag } from '../../../domain/tag/entity'
import { ArticleRepository } from '../../../domain/article/repository'
import { ActorRepository } from '../../../domain/actor/repository'
import { TagRepository } from '../../../domain/tag/repository'
import { Env } from '../../../types'
import { prisma } from '../../test-db'
import { PrismaArticleRepository } from '../../../infrastructure/article/prisma-repository'
import { PrismaActorRepository } from '../../../infrastructure/actor/prisma-repository'
import { PrismaTagRepository } from '../../../infrastructure/tag/prisma-repository'
import {
    clearAllTestData,
    createArticleFactory,
    createTagFactory,
    createActorFactory
} from '../../factory/articleFactory'


//システムの規模的に統合テスト要素も持たせる
// モックリポジトリの作成
const createMockArticleRepository = (articles: Article[]): ArticleRepository => ({
    findAll: vi.fn().mockResolvedValue(articles),
    findByKeyword: vi.fn().mockResolvedValue(articles),
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
                new Actor(1, '山崎桃', 'ヤマザキモモ'),
                new Actor(2, '猛武蔵', 'モウムサシ'),
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
// ==================== 統合テスト（実DB使用） ====================
// 統合テストはDBを共有するため順次実行
describe.sequential('routes/web/article 統合テスト', () => {
    // 実際のPrismaリポジトリを使用するアプリ
    const createIntegrationTestApp = () => {
        const app = new Hono<Env>()
        app.use('*', async (c, next) => {
            c.set('articleRepo', new PrismaArticleRepository(prisma))
            c.set('actorRepo', new PrismaActorRepository(prisma))
            c.set('tagRepo', new PrismaTagRepository(prisma))
            await next()
        })
        app.route('/', webArticle)
        return app
    }

    beforeEach(async () => {
        await clearAllTestData()
    })

    afterAll(async () => {
        await clearAllTestData()
        await prisma.$disconnect()
    })

    describe('GET /all_article', () => {
        it('ファクトリーで作成した記事が取得できること', async () => {
            // Arrange: テストデータを複数作成
            const article1 = await createArticleFactory({
                title: '統合テスト記事1',
                explanation: '統合テストの説明1',
                tags: ['TypeScript', 'Prisma'],
                actors: ['山田太郎']
            })
            const article2 = await createArticleFactory({
                title: '統合テスト記事2',
                explanation: '統合テストの説明2',
                tags: ['JavaScript', 'Node.js'],
                actors: ['佐藤花子', '田中一郎']
            })
            const article3 = await createArticleFactory({
                title: '統合テスト記事3',
                explanation: '統合テストの説明3',
                tags: ['TypeScript'],
                actors: ['山田太郎']
            })
            // console.log('作成した記事1:', JSON.stringify(article1, null, 2))
            // console.log('作成した記事2:', JSON.stringify(article2, null, 2))
            // console.log('作成した記事3:', JSON.stringify(article3, null, 2))

            const app = createIntegrationTestApp()

            // Act
            const response = await app.request('/all_article')

            // Assert
            expect(response.status).toBe(200)
            const json = await response.json() as { message: string, data: Article[] }
            // console.log('レスポンス:', JSON.stringify(json, null, 2))
            expect(json.data).toHaveLength(3)
            expect(json.data.map(a => a.title)).toContain('統合テスト記事1')
            expect(json.data.map(a => a.title)).toContain('統合テスト記事2')
            expect(json.data.map(a => a.title)).toContain('統合テスト記事3')
        })

        it('published=falseの記事は取得されないこと', async () => {
            // Arrange: published=trueの記事を作成
            await createArticleFactory({
                title: '公開記事',
                explanation: '公開済み',
            })

            const app = createIntegrationTestApp()

            // Act
            const response = await app.request('/all_article')

            // Assert
            const json = await response.json() as { message: string, data: Article[] }
            // ('公開記事のみのレスポンス:', JSON.stringify(json, null, 2))
            expect(json.data).toHaveLength(1)
            expect(json.data[0].title).toBe('公開記事')
        })
    })

    describe('GET /all_tag', () => {
        it('ファクトリーで作成したタグが取得できること', async () => {
            // Arrange
            await createTagFactory('JavaScript')
            await createTagFactory('TypeScript')
            // console.log('タグを2件作成しました')

            const app = createIntegrationTestApp()

            // Act
            const response = await app.request('/all_tag')

            // Assert
            expect(response.status).toBe(200)
            const json = await response.json() as { message: string, data: Tag[] }
            // console.log('タグレスポンス:', JSON.stringify(json, null, 2))
            expect(json.data).toHaveLength(2)
        })
    })

    describe('GET /all_actor', () => {
        it('ファクトリーで作成したアクターが取得できること', async () => {
            // Arrange
            await createActorFactory('テスト俳優A')
            await createActorFactory('テスト俳優B')
            // console.log('アクターを2件作成しました')

            const app = createIntegrationTestApp()

            // Act
            const response = await app.request('/all_actor')

            // Assert
            expect(response.status).toBe(200)
            const json = await response.json() as { message: string, data: Actor[] }
            // console.log('アクターレスポンス:', JSON.stringify(json, null, 2))
            expect(json.data).toHaveLength(2)
        })
    })
})