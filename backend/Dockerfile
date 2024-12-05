# node:22-slimを使用
FROM node:22-slim

# 作業ディレクトリを設定
WORKDIR /app

# パッケージ管理ファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# サーバーをポート5000で起動
CMD ["npm", "run", "dev"]
