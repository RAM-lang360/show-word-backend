# Node.jsではなくBunのイメージを使う
FROM oven/bun:latest

WORKDIR /app
COPY . .
RUN bun install

# 起動コマンド
CMD ["bun", "run", "--hot", "src/index.ts"]