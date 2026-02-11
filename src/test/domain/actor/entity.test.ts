import { Actor } from '../../../domain/actor/entity';

describe('Actor Entity', () => {
    it('正しいデータを与えられたとき、正常にインスタンスが作成されること', () => {
        const actor = new Actor(null, ' 山崎桃', 'ヤマザキモモ');
        expect(actor).toBeInstanceOf(Actor);
        expect(actor.actor_name).toBe(' 山崎桃');
    });

    it('名前が空文字のとき、エラーがスローされること', () => {
        expect(() => {
            new Actor(null, '', 'ヤマザキモモ');

        }).toThrowError("名前を入力してください");
    });
});
it('名前(カナ)が空文字のとき、エラーがスローされること', () => {
    expect(() => {
        new Actor(null, ' 山崎桃', '');
    }).toThrowError("名前(カナ)を入力してください");
});
