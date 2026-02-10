// tests/factories/article.factory.ts
import { prisma } from "../test-db";

/**
 * テストデータを全てクリアする
 */
export async function clearAllTestData() {
    await prisma.articleOnActors.deleteMany()
    await prisma.articleOnTags.deleteMany()
    await prisma.article.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.actor.deleteMany()
}

/**
 * タグを作成する
 */
export async function createTagFactory(name?: string) {
    return prisma.tag.create({
        data: { name: name ?? `テストタグ${Date.now()}` }
    })
}

/**
 * アクターを作成する
 */
export async function createActorFactory(name?: string) {
    return prisma.actor.create({
        data: { name: name ?? `テストアクター${Date.now()}` }
    })
}

export const createArticleFactory = async (overrides: {
    title?: string;
    explanation?: string;
    tags?: string[];   // タグ名の一覧
    actors?: string[]; // アクター名の一覧
} = {}) => {
    return await prisma.article.create({
        data: {
            title: overrides.title ?? "テスト記事タイトル",
            explanation: overrides.explanation ?? "テスト用の説明文です。",
            published: true,
            // 中間テーブルとマスタを同時に作成/紐付け
            tags: {
                create: overrides.tags?.map((name) => ({
                    tag: {
                        connectOrCreate: {
                            where: { name },
                            create: { name },
                        },
                    },
                })) ?? [],
            },
            actors: {
                create: overrides.actors?.map((name) => ({
                    actor: {
                        create: { name },
                    },
                })) ?? [],
            },
        },
        include: {
            tags: { include: { tag: true } },
            actors: { include: { actor: true } },
        },
    });
};