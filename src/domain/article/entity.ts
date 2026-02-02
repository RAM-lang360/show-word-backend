//DBが満たすべきルールを決めるところ　model層に相当だけど実際の操作はinfra層で行う

// src/domain/article/entity.ts

export class Article {
    constructor(
        public readonly id: number | null, // 新規作成時はnull
        public readonly title: string,
        public readonly explanation: string,
        public readonly published: boolean
    ) {
        // 【ドメインルール】タイトルは空であってはならない
        if (title.length === 0) {
            throw new Error("タイトルを入力してください");
        }
        if (explanation.length === 0) {
            throw new Error("説明文を入力してください");
        }
    }

    //タイトルを短く丸める処理
    // get summary(): string {
    //     return this.explanation.slice(0, 50) + "...";
    // }
}