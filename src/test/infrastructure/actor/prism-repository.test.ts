import { PrismaActorRepository } from '../../../infrastructure/actor/prisma-repository';
import { Actor } from '../../../domain/actor/entity';
import { prisma as testPrisma } from '../../test-db';
import { clearAllTestData } from '../../factory/articleFactory';

describe('PrismaActorRepository', () => {
    let repository: PrismaActorRepository;
    const prisma = testPrisma;
    beforeAll(() => {
        repository = new PrismaActorRepository(prisma);
    });

    beforeEach(async () => {
        // テスト前に全テーブルをクリーンアップ
        await clearAllTestData();
    });

    afterAll(async () => {
        // テスト終了後にクリーンアップとコネクション切断
        await clearAllTestData();
        await prisma.$disconnect();
    });

    describe('save', () => {
        it('Actorを保存できること', async () => {
            const actor = new Actor(null, '山崎桃', 'ヤマザキモモ');

            await repository.save(actor);

            const savedActors = await prisma.actor.findMany({
                where: { actor_name: '山崎桃' }
            });
            expect(savedActors).toHaveLength(1);
            expect(savedActors[0].actor_name).toBe('山崎桃');
            expect(savedActors[0].actor_kana).toBe('ヤマザキモモ');
        });
    });

    describe('findAll', () => {
        it('全てのActorを取得できること', async () => {
            // テストデータを準備
            await prisma.actor.createMany({
                data: [
                    { actor_name: '俳優A', actor_kana: 'ハイユウA' },
                    { actor_name: '俳優B', actor_kana: 'ハイユウB' },
                    { actor_name: '俳優C', actor_kana: 'ハイユウC' },
                ]
            });

            const actors = await repository.findAll();

            expect(actors).toHaveLength(3);
            expect(actors.map(a => a.actor_name)).toEqual(
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
                data: { actor_name: '検索対象俳優', actor_kana: 'ケンサクタイショウハイユウ' }
            });

            const actor = await repository.findById(created.id);

            expect(actor).not.toBeNull();
            expect(actor?.id).toBe(created.id);
            expect(actor?.actor_name).toBe('検索対象俳優');
            expect(actor?.actor_kana).toBe('ケンサクタイショウハイユウ');
        });

        it('存在しないIDの場合、nullを返すこと', async () => {
            const actor = await repository.findById(99999);

            expect(actor).toBeNull();
        });
    });

    describe('delete', () => {
        it('指定したIDのActorを削除できること', async () => {
            const created = await prisma.actor.create({
                data: { actor_name: '削除対象俳優', actor_kana: 'サクジョタイショウハイユウ' }
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
