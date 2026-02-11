import { KanaConvertInteractor } from "../../../usecase/kanaconvert/kanaConvert";
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'; // 解析器が必要

describe("KanaConvertInteractor", () => {
    let kanaConvertInteractor: KanaConvertInteractor;
    const kuroshiro = new Kuroshiro();

    beforeAll(async () => {
        // テスト全体が始まる前に一度だけ初期化
        await kuroshiro.init(new KuromojiAnalyzer());
    });

    it("ひらがな変換が正しく行われること", async () => {
        kanaConvertInteractor = new KanaConvertInteractor(kuroshiro);

        const input = "林檎";
        const result = await kanaConvertInteractor.convert(input);
        expect(result).toBe("りんご");
    });

    it("カタカナ変換が正しく行われること", async () => {
        kanaConvertInteractor = new KanaConvertInteractor(kuroshiro);

        const input = "バナナ";
        const result = await kanaConvertInteractor.convert(input);
        expect(result).toBe("ばなな");
    });
}); 