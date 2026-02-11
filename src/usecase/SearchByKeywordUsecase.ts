import { Article } from "../domain/article/entity";

// 1. 入力の型（Input Boundary）
// 検索に必要な情報をまとめる。今はキーワードだけですが、
// 将来的に「ページ番号」や「ソート順」を増やすときに便利です。
export interface SearchByKeywordInput {
    keyword: string;
}

// 2. ユースケースのインターフェース
// 「search」というメソッドを呼び出すと、Articleの配列が返ることを約束する
export interface SearchByKeywordUsecase {
    search(input: SearchByKeywordInput): Promise<Article[]>;
}