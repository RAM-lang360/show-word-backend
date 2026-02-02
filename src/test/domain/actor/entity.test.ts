import { Actor } from '../../../domain/actor/entity';

describe('Actor Entity', () => {
    it('正しいデータを与えられたとき、正常にインスタンスが作成されること', () => {
        const actor = new Actor(null, '俳優名');
        expect(actor).toBeInstanceOf(Actor);
        expect(actor.name).toBe('俳優名');
    });

    it('名前が空文字のとき、エラーがスローされること', () => {
        expect(() => {
            new Actor(null, '');
        }).toThrowError("名前を入力してください");
    });
});