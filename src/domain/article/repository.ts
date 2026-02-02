import { Article } from "./entity";

export interface ArticleRepository {
    //サイト用
    findAll(): Promise<Article[]>;
    //findBykeyword(keyword: string): Promise<Article[]>;

    //開発者用
    findById(id: number): Promise<Article | null>;
    save(article: Article): Promise<void>;
    delete(id: number): Promise<void>;
}