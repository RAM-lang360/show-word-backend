//DBが満たすべきルールを決めるところ　model層に相当だけど実際の操作はinfra層で行う


export class Actor {
    constructor(
        public readonly id: number | null, // 新規作成時はnull
        public readonly name: string,
    ) {
        // 【ドメインルール】名前は空であってはならない
        if (name.length === 0) {
            throw new Error("名前を入力してください");
        }
    }
}