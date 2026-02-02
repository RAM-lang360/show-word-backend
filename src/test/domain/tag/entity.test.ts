import { Tag } from '../../../domain/tag/entity';

describe('Tag Entity', () => {
    it('正しいデータを与えられたとき、正常にインスタンスが作成されること', () => {
        const tag = new Tag(null, 'タグ名');
        expect(tag).toBeInstanceOf(Tag);
        expect(tag.name).toBe('タグ名');
    });

    it('IDを指定してインスタンスを作成できること', () => {
        const tag = new Tag(1, 'タグ名');
        expect(tag).toBeInstanceOf(Tag);
        expect(tag.id).toBe(1);
        expect(tag.name).toBe('タグ名');
    });

    it('名前が空文字のとき、エラーがスローされること', () => {
        expect(() => {
            new Tag(null, '');
        }).toThrowError("タグネームを入力してください");
    });
});
