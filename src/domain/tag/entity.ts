//DBが満たすべきルールを決めるところ　model層に相当だけど実際の操作はinfra層で行う

// src/domain/tag/entity.ts

export class Tag {
    constructor(
        public readonly id: number | null, // 新規作成時はnull
        public readonly name: string,
    ) {
        // 【ドメインルール】タグネームは空であってはならない
        if (name.length === 0) {
            throw new Error("タグネームを入力してください");
        }
    }
}