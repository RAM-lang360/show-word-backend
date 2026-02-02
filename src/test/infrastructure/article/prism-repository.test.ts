import { PrismaArticleRepository } from '../../../infrastructure/article/prisma-repository';
import { Article } from '../../../domain/article/entity';
import { prisma as testPrisma } from '../../test-db';
import { TestAPI } from 'vitest';

describe('PrismaArticleRepository', () => {
    let repository: PrismaArticleRepository;
    const prisma = testPrisma;
    beforeAll(() => {
        repository = new PrismaArticleRepository(prisma);
    });

    beforeEach(async () => {
        // テスト前にArticle関連テーブルをクリーンアップ
        await prisma.articleOnTags.deleteMany();
        await prisma.articleOnActors.deleteMany();
        await prisma.article.deleteMany();
    });

    afterAll(async () => {
        // テスト終了後にクリーンアップとコネクション切断
        await prisma.articleOnTags.deleteMany();
        await prisma.articleOnActors.deleteMany();
        await prisma.article.deleteMany();
        await prisma.$disconnect();
    });

    describe('save', () => {
        it('Articleを保存できること', async () => {
            const article = new Article(null, 'テストタイトル', 'テスト説明文', false);

            await repository.save(article);

            const savedArticles = await prisma.article.findMany({
                where: { title: 'テストタイトル' }
            });
            expect(savedArticles).toHaveLength(1);
            expect(savedArticles[0].title).toBe('テストタイトル');
            expect(savedArticles[0].explanation).toBe('テスト説明文');
            expect(savedArticles[0].published).toBe(false);
        });
    });

    describe('findAll', () => {
        it('公開されている全てのArticleを取得できること', async () => {
            // テストデータを準備（公開済み2件、未公開1件）
            await prisma.article.createMany({
                data: [
                    { title: '記事A', explanation: '説明A', published: true },
                    { title: '記事B', explanation: '説明B', published: true },
                    { title: '記事C', explanation: '説明C', published: false },
                ]
            });

            const articles = await repository.findAll();

            // 公開されている記事のみ取得される
            expect(articles).toHaveLength(2);
            expect(articles.map(a => a.title)).toEqual(
                expect.arrayContaining(['記事A', '記事B'])
            );
        });

        it('公開されているArticleが存在しない場合、空配列を返すこと', async () => {
            // 未公開の記事のみ作成
            await prisma.article.create({
                data: { title: '未公開記事', explanation: '説明', published: false }
            });

            const articles = await repository.findAll();

            expect(articles).toHaveLength(0);
            expect(articles).toEqual([]);
        });
    });

    describe('findById', () => {
        it('指定したIDのArticleを取得できること', async () => {
            const created = await prisma.article.create({
                data: { title: '検索対象記事', explanation: '検索対象説明', published: true }
            });

            const article = await repository.findById(created.id);

            expect(article).not.toBeNull();
            expect(article?.id).toBe(created.id);
            expect(article?.title).toBe('検索対象記事');
        });

        it('未公開のArticleもIDで取得できること', async () => {
            const created = await prisma.article.create({
                data: { title: '未公開記事', explanation: '未公開説明', published: false }
            });

            const article = await repository.findById(created.id);

            expect(article).not.toBeNull();
            expect(article?.id).toBe(created.id);
        });

        it('存在しないIDの場合、nullを返すこと', async () => {
            const article = await repository.findById(99999);

            expect(article).toBeNull();
        });
    });

    describe('delete', () => {
        it('指定したIDのArticleを削除できること', async () => {
            const created = await prisma.article.create({
                data: { title: '削除対象記事', explanation: '削除対象説明', published: false }
            });

            await repository.delete(created.id);

            const deletedArticle = await prisma.article.findUnique({
                where: { id: created.id }
            });
            expect(deletedArticle).toBeNull();
        });

        it('存在しないIDを削除しようとした場合、エラーがスローされること', async () => {
            await expect(repository.delete(99999)).rejects.toThrow();
        });
    });
});
