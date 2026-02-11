import { SearchUsecase, SearchInput } from "../../../usecase/search/SearchUsecase";
import { SearchInteractor } from "../../../usecase/search/search";
import { ArticleRepository } from "../../../domain/article/repository";


describe("SearchInteractor", () => {
    let searchInteractor: SearchInteractor;

    beforeEach(() => {
        // モックのArticleRepositoryとKanaConvertUsecaseを作成
        const mockArticleRepository: ArticleRepository = {
            findByKeyword: vi.fn().mockResolvedValue([]), // デフォルトは空の配列を返す
        } as any;

        const mockKanaConvertUsecase = {
            convert: vi.fn().mockResolvedValue("テスト"), // デフォルトは「テスト」を返す
        };

        searchInteractor = new SearchInteractor(mockArticleRepository, mockKanaConvertUsecase);
    });

    it("空のキーワードで検索すると空の配列が返ること", async () => {
        const input = { keyword: "" };
        const result = await searchInteractor.search(input);
        expect(result).toEqual([]);
    });

    it("キーワードが正規化されてリポジトリに渡されること", async () => {
        const input = { keyword: "テスト" };
        await searchInteractor.search(input);
        expect(searchInteractor['kanaConvertUsecase'].convert).toHaveBeenCalledWith("テスト");
        expect(searchInteractor['articleRepository'].findByKeyword).toHaveBeenCalledWith("テスト");
    });
});