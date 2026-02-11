import { Article } from "../domain/article/entity";
import { ArticleRepository } from "../domain/article/repository";
import { SearchByKeywordUsecase, SearchByKeywordInput } from "./SearchByKeywordUsecase";

// UseCase用のインターフェースを実装する
export class SearchByKeywordInteractor implements SearchByKeywordUsecase {
    constructor(private readonly articleRepository: ArticleRepository) { }

    async search(input: SearchByKeywordInput): Promise<Article[]> { // メソッド名も行動の名前に

        if (!input.keyword || input.keyword.trim() === "") {
            return [];
        }

        const normalizedKeyword = this.normalize(input.keyword);
        return await this.articleRepository.findByKeyword(normalizedKeyword);
    }

    private normalize(keyword: string): string {
        return 'test'
    }
}