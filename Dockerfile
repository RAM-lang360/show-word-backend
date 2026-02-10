# Node.jsではなくBunのイメージを使う
FROM oven/bun:latest

WORKDIR /app
COPY . .\
RUN apt-get update && apt-get install -y git
RUN bun install

# 起動コマンド
CMD ["bun", "run", "--hot", "src/index.ts"]