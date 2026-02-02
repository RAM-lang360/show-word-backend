import { prisma } from '../../../lib/prisma'
import { ArticleRepository } from '../../domain/article/repository';
import { Article } from '../../domain/article/entity';

export class PrismaArticleRepository implements ArticleRepository {

    //domainのArticleエンティティに変換するメソッド、もしDBのコラムが変更されてもここだけかえればそれより上層は大丈夫
    private toEntity(data: any): Article {
        return new Article(
            data.id,
            data.title,
            data.content,
            data.published
        );
    }

    async findAll(): Promise<Article[]> {
        const record = await prisma.article.findMany({
            where: { published: true }
        });
        return record.map(item => this.toEntity(item));
    }

    async findById(id: number): Promise<Article | null> {
        const record = await prisma.article.findUnique({
            where: { id }
        });
        if (!record) {
            return null;
        }
        return this.toEntity(record);
    }

    async save(article: Article): Promise<void> {
        await prisma.article.create({
            data: {
                title: article.title,
                explanation: article.explanation,
                published: false
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.article.delete({
            where: { id }
        });
    }
}   
