import { KanaConvertUsecase } from "./KanaConvertUsecase";
import Kuroshiro from 'kuroshiro';

export class KanaConvertInteractor implements KanaConvertUsecase {
    private kuroshiro: Kuroshiro;

    constructor(kuroshiro: Kuroshiro) {
        this.kuroshiro = kuroshiro;
    }

    async convert(input: string): Promise<string> {
        const converted = await this.kuroshiro.convert(input, { to: 'hiragana' });

        return converted.replace(/[\u30a1-\u30f6]/g, (match) => {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    }
}