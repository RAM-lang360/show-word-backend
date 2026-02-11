import { Article } from "../../domain/article/entity";
import { ArticleRepository } from "../../domain/article/repository";
import { SearchUsecase, SearchInput } from "./SearchUsecase";
import { KanaConvertUsecase } from "../kanaconvert/KanaConvertUsecase";

// UseCase用のインターフェースを実装する
export class SearchInteractor implements SearchUsecase {
    constructor(private readonly articleRepository: ArticleRepository,
        private readonly kanaConvertUsecase: KanaConvertUsecase) { }

    async search(input: SearchInput): Promise<Article[]> { // メソッド名も行動の名前に

        if (!input.keyword || input.keyword.trim() === "") {
            return [];
        }

        const normalizedKeyword = await this.normalize(input.keyword);
        return await this.articleRepository.findByKeyword(normalizedKeyword);
    }

    private normalize(keyword: string): Promise<string> {
        return this.kanaConvertUsecase.convert(keyword);
    }
}