// 2. ユースケースのインターフェース
// 「search」というメソッドを呼び出すと、Articleの配列が返ることを約束する
export interface KanaConvertUsecase {
    convert(input: string): Promise<string>;
}