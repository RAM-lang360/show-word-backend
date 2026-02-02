import { Actor } from "./entity";

export interface ActorRepository {
    //サイト用
    findAll(): Promise<Actor[]>;
    //findBykeyword(keyword: string): Promise<Actor[]>;

    //開発者用
    findById(id: number): Promise<Actor | null>;
    save(actor: Actor): Promise<void>;
    delete(id: number): Promise<void>;
}