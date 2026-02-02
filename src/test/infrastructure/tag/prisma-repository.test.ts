import { PrismaTagRepository } from '../../../infrastructure/tag/prisma-repository';
import { Tag } from '../../../domain/tag/entity';
import { prisma as testPrisma } from '../../test-db';

describe('PrismaTagRepository', () => {
    let repository: PrismaTagRepository;
    const prisma = testPrisma;
    beforeAll(() => {
        repository = new PrismaTagRepository(prisma);
    });

    beforeEach(async () => {
        // テスト前にTag関連テーブルをクリーンアップ
        await prisma.articleOnTags.deleteMany();
        await prisma.tag.deleteMany();
    });

    afterAll(async () => {
        // テスト終了後にクリーンアップとコネクション切断
        await prisma.articleOnTags.deleteMany();
        await prisma.tag.deleteMany();
        await prisma.$disconnect();
    });

    describe('save', () => {
        it('Tagを保存できること', async () => {
            const tag = new Tag(null, 'テストタグ');

            await repository.save(tag);

            const savedTags = await prisma.tag.findMany({
                where: { name: 'テストタグ' }
            });
            expect(savedTags).toHaveLength(1);
            expect(savedTags[0].name).toBe('テストタグ');
        });
    });

    describe('findAll', () => {
        it('全てのTagを取得できること', async () => {
            // テストデータを準備
            await prisma.tag.createMany({
                data: [
                    { name: 'タグA' },
                    { name: 'タグB' },
                    { name: 'タグC' },
                ]
            });

            const tags = await repository.findAll();

            expect(tags).toHaveLength(3);
            expect(tags.map(t => t.name)).toEqual(
                expect.arrayContaining(['タグA', 'タグB', 'タグC'])
            );
        });

        it('Tagが存在しない場合、空配列を返すこと', async () => {
            const tags = await repository.findAll();

            expect(tags).toHaveLength(0);
            expect(tags).toEqual([]);
        });
    });

    describe('findById', () => {
        it('指定したIDのTagを取得できること', async () => {
            const created = await prisma.tag.create({
                data: { name: '検索対象タグ' }
            });

            const tag = await repository.findById(created.id);

            expect(tag).not.toBeNull();
            expect(tag?.id).toBe(created.id);
            expect(tag?.name).toBe('検索対象タグ');
        });

        it('存在しないIDの場合、nullを返すこと', async () => {
            const tag = await repository.findById(99999);

            expect(tag).toBeNull();
        });
    });

    describe('delete', () => {
        it('指定したIDのTagを削除できること', async () => {
            const created = await prisma.tag.create({
                data: { name: '削除対象タグ' }
            });

            await repository.delete(created.id);

            const deletedTag = await prisma.tag.findUnique({
                where: { id: created.id }
            });
            expect(deletedTag).toBeNull();
        });

        it('存在しないIDを削除しようとした場合、エラーがスローされること', async () => {
            await expect(repository.delete(99999)).rejects.toThrow();
        });
    });
});
