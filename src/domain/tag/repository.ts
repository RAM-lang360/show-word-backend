import { Tag } from "./entity";

export interface TagRepository {
    //サイト用
    findAll(): Promise<Tag[]>;
    //findBykeyword(keyword: string): Promise<Tag[]>;

    //開発者用
    findById(id: number): Promise<Tag | null>;
    save(tag: Tag): Promise<void>;
    delete(id: number): Promise<void>;
}