import { PrismaActorRepository } from '../../../infrastructure/actor/prisma-repository';
import { Actor } from '../../../domain/actor/entity';
import { prisma } from '../../../../lib/prisma';

describe('PrismaActorRepository', () => {
    let repository: PrismaActorRepository;

    beforeAll(() => {
        repository = new PrismaActorRepository();
    });

    beforeEach(async () => {
        // テスト前にActorテーブルをクリーンアップ
        await prisma.articleOnActors.deleteMany();
        await prisma.actor.deleteMany();
    });

    afterAll(async () => {
        // テスト終了後にクリーンアップとコネクション切断
        await prisma.articleOnActors.deleteMany();
        await prisma.actor.deleteMany();
        await prisma.$disconnect();
    });

    describe('save', () => {
        it('Actorを保存できること', async () => {
            const actor = new Actor(null, 'テスト俳優');

            await repository.save(actor);

            const savedActors = await prisma.actor.findMany({
                where: { name: 'テスト俳優' }
            });
            expect(savedActors).toHaveLength(1);
            expect(savedActors[0].name).toBe('テスト俳優');
        });
    });

    describe('findAll', () => {
        it('全てのActorを取得できること', async () => {
            // テストデータを準備
            await prisma.actor.createMany({
                data: [
                    { name: '俳優A' },
                    { name: '俳優B' },
                    { name: '俳優C' },
                ]
            });

            const actors = await repository.findAll();

            expect(actors).toHaveLength(3);
            expect(actors.map(a => a.name)).toEqual(
                expect.arrayContaining(['俳優A', '俳優B', '俳優C'])
            );
        });

        it('Actorが存在しない場合、空配列を返すこと', async () => {
            const actors = await repository.findAll();

            expect(actors).toHaveLength(0);
            expect(actors).toEqual([]);
        });
    });

    describe('findById', () => {
        it('指定したIDのActorを取得できること', async () => {
            const created = await prisma.actor.create({
                data: { name: '検索対象俳優' }
            });

            const actor = await repository.findById(created.id);

            expect(actor).not.toBeNull();
            expect(actor?.id).toBe(created.id);
            expect(actor?.name).toBe('検索対象俳優');
        });

        it('存在しないIDの場合、nullを返すこと', async () => {
            const actor = await repository.findById(99999);

            expect(actor).toBeNull();
        });
    });

    describe('delete', () => {
        it('指定したIDのActorを削除できること', async () => {
            const created = await prisma.actor.create({
                data: { name: '削除対象俳優' }
            });

            await repository.delete(created.id);

            const deletedActor = await prisma.actor.findUnique({
                where: { id: created.id }
            });
            expect(deletedActor).toBeNull();
        });

        it('存在しないIDを削除しようとした場合、エラーがスローされること', async () => {
            await expect(repository.delete(99999)).rejects.toThrow();
        });
    });
});
