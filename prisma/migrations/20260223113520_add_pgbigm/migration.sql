CREATE EXTENSION IF NOT EXISTS pg_bigm;

CREATE INDEX IF NOT EXISTS idx_article_title_bigm
	ON "Article" USING gin (title gin_bigm_ops);

CREATE INDEX IF NOT EXISTS idx_article_explanation_bigm
	ON "Article" USING gin (explanation gin_bigm_ops);

CREATE INDEX IF NOT EXISTS idx_tag_name_bigm
	ON "Tag" USING gin (name gin_bigm_ops);

CREATE INDEX IF NOT EXISTS idx_actor_name_bigm
	ON "Actor" USING gin (actor_name gin_bigm_ops);

CREATE INDEX IF NOT EXISTS idx_actor_kana_bigm
	ON "Actor" USING gin (actor_kana gin_bigm_ops);
