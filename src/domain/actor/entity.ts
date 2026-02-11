//DBが満たすべきルールを決めるところ　model層に相当だけど実際の操作はinfra層で行う


export class Actor {
    constructor(
        public readonly id: number | null, // 新規作成時はnull
        public readonly actor_name: string,
        public readonly actor_kana: string
    ) {
        // 【ドメインルール】名前は空であってはならない
        if (actor_name.length === 0) {
            throw new Error("名前を入力してください");
        }

        if (actor_kana.length === 0) {
            throw new Error("名前(カナ)を入力してください");
        }
    }
}