import { prisma } from '../../../lib/prisma'
import { TagRepository } from '../../domain/tag/repository';
import { Tag } from '../../domain/tag/entity';

export class PrismaTagRepository implements TagRepository {

    //domainのTagエンティティに変換するメソッド、もしDBのコラムが変更されてもここだけかえればそれより上層は大丈夫
    private toEntity(data: any): Tag {
        return new Tag(
            data.id,
            data.name,
        );
    }

    async findAll(): Promise<Tag[]> {
        const record = await prisma.tag.findMany();
        return record.map(item => this.toEntity(item));
    }

    async findById(id: number): Promise<Tag | null> {
        const record = await prisma.tag.findUnique({
            where: { id }
        });
        if (!record) {
            return null;
        }
        return this.toEntity(record);
    }

    async save(tag: Tag): Promise<void> {
        await prisma.tag.create({
            data: {
                name: tag.name,
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.tag.delete({
            where: { id }
        });
    }
}   
