import { PrismaClient } from '../../../generated/prisma/client';
import { ActorRepository } from '../../domain/actor/repository';
import { Actor } from '../../domain/actor/entity';

export class PrismaActorRepository implements ActorRepository {
    constructor(private readonly prisma: PrismaClient) { }
    private toEntity(data: any): Actor {
        return new Actor(
            data.id,
            data.name,
        );
    }

    async findAll(): Promise<Actor[]> {
        const record = await this.prisma.actor.findMany();
        return record.map(item => this.toEntity(item));
    }

    async findById(id: number): Promise<Actor | null> {
        const record = await this.prisma.actor.findUnique({
            where: { id }
        });
        if (!record) {
            return null;
        }
        return this.toEntity(record);
    }

    async save(actor: Actor): Promise<void> {
        const record = await this.prisma.actor.create({
            data: {
                name: actor.name,
            }
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.actor.delete({
            where: { id }
        });
    }
}