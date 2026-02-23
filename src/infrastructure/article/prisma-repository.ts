import { Prisma, PrismaClient } from '../../../generated/prisma/client';
import { ArticleRepository } from '../../domain/article/repository';
import { Article } from '../../domain/article/entity';

export class PrismaArticleRepository implements ArticleRepository {
    constructor(private readonly prisma: PrismaClient) { }
    //domainのArticleエンティティに変換するメソッド、もしDBのコラムが変更されてもここだけかえればそれより上層は大丈夫
    private toEntity(data: any): Article {
        return new Article(
            data.id,
            data.title,
            data.explanation,
            data.published
        );
    }

    async findAll(): Promise<Article[]> {
        const record = await this.prisma.article.findMany({
            where: { published: true }
        });
        return record.map(item => this.toEntity(item));
    }

    async findById(id: number): Promise<Article | null> {
        const record = await this.prisma.article.findUnique({
            where: { id }
        });
        if (!record) {
            return null;
        }
        return this.toEntity(record);
    }

    async save(article: Article): Promise<void> {
        await this.prisma.article.create({
            data: {
                title: article.title,
                explanation: article.explanation,
                published: false
            }
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.article.delete({
            where: { id }
        });
    }
    // ひらがなから全体検索をするメソッド
    async findByKeyword(keyword: string): Promise<Article[]> {
        const tokens = keyword
            .split(/[\s\u3000]+/)
            .map((token) => token.trim())
            .filter((token) => token.length > 0);

        if (tokens.length === 0) {
            return [];
        }

        const tokenConditions = tokens.map((token) => {
            const likePattern = `%${token}%`;
            return Prisma.sql`
                (
                    a.title ILIKE ${likePattern}
                    OR a.explanation ILIKE ${likePattern}
                    OR EXISTS (
                        SELECT 1
                        FROM "ArticleOnTags" aot
                        INNER JOIN "Tag" t ON t.id = aot."tagId"
                        WHERE aot."articleId" = a.id
                          AND t.name ILIKE ${likePattern}
                    )
                    OR EXISTS (
                        SELECT 1
                        FROM "ArticleOnActors" aoa
                        INNER JOIN "Actor" ac ON ac.id = aoa."actorId"
                        WHERE aoa."articleId" = a.id
                          AND (
                              ac.actor_name ILIKE ${likePattern}
                              OR ac.actor_kana ILIKE ${likePattern}
                          )
                    )
                )
            `;
        });

        const records = await this.prisma.$queryRaw<
            { id: number; title: string; explanation: string; published: boolean }[]
        >(Prisma.sql`
            SELECT a.id, a.title, a.explanation, a.published
            FROM "Article" a
            WHERE a.published = true
                            AND ${Prisma.join(tokenConditions, ' AND ')}
            ORDER BY a.id DESC
        `);

        return records.map((item) => this.toEntity(item));
    }
}
