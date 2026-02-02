import { prisma } from '../../../lib/prisma'
import { ActorRepository } from '../../domain/actor/repository';
import { Actor } from '../../domain/actor/entity';

export class PrismaActorRepository implements ActorRepository {
    private toEntity(data: any): Actor {
        return new Actor(
            data.id,
            data.name,
        );
    }

    async findAll(): Promise<Actor[]> {
        const record = await prisma.actor.findMany();
        return record.map(item => this.toEntity(item));
    }

    async findById(id: number): Promise<Actor | null> {
        const record = await prisma.actor.findUnique({
            where: { id }
        });
        if (!record) {
            return null;
        }
        return this.toEntity(record);
    }

    async save(actor: Actor): Promise<void> {
        const record = await prisma.actor.create({
            data: {
                name: actor.name,
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.actor.delete({
            where: { id }
        });
    }
}