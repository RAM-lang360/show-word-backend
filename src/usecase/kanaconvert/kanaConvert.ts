import { KanaConvertUsecase } from "./KanaConvertUsecase";
import Kuroshiro from 'kuroshiro';

export class KanaConvertInteractor implements KanaConvertUsecase {
    private kuroshiro: Kuroshiro;

    constructor(kuroshiro: Kuroshiro) {
        this.kuroshiro = kuroshiro;
    }

    async convert(input: string): Promise<string> {
        return await this.kuroshiro.convert(input, { to: 'hiragana' });
    }
}