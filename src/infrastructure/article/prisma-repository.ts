import { PrismaClient } from '../../../generated/prisma/client';
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
        return [];
    }
}   
