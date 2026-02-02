import { Article } from '../../../domain/article/entity';

describe('Article Entity', () => {
    it('正しいデータを与えられたとき、正常にインスタンスが作成されること'), () => {
        const article = new Article(null, 'タイトル', '説明文', false);
        expect(article).toBeInstanceOf(Article);
        expect(article.title).toBe('タイトル');
    }

    it('タイトルが空文字のとき、エラーがスローされること', () => {
        expect(() => {
            new Article(null, '', '説明文', false);
        }).toThrowError("タイトルを入力してください");
    });

    it('説明文が空文字のとき、エラーがスローされること', () => {
        expect(() => {
            new Article(null, 'タイトル', '', false);
        }).toThrowError("説明文を入力してください");
    });
});