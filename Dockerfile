## 起動前にenvファイルにDBを記述」

# Node.jsではなくBunのイメージを使う
FROM oven/bun:latest

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y git
RUN bun install

# Prisma 初期化（未初期化環境向け）
RUN bunx --bun prisma init --db --output ../generated/prisma || true

# Prisma Client 生成
RUN bunx prisma generate --schema=./prisma/schema.prisma

# 起動時に生成＋マイグレーション適用（bind mount対策）
CMD ["sh", "-lc", "bunx prisma generate --schema=./prisma/schema.prisma && bunx prisma migrate deploy --schema=./prisma/schema.prisma && bun run --hot src/index.ts"]


