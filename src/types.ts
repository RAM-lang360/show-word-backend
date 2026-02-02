// src/types.ts (新設)
import { ArticleRepository } from './domain/article/repository'
import { ActorRepository } from './domain/actor/repository'
import { TagRepository } from './domain/tag/repository'
// route/web/aricleでarticleRepoの関数を使えるようにするためにEnvを定義。domainに変更があってもここだけ変えればよい
export type Env = {
    Variables: {
        articleRepo: ArticleRepository,
        actorRepo: ActorRepository,
        tagRepo: TagRepository
    }
}