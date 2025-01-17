# node:22-slimを使用
FROM node:22-slim

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー（もしあれば）
COPY package.json ./

# package-lock.json がない場合、npm install で依存関係をインストール
RUN npm install --frozen-lockfile || npm install

# ソースコードをコピー
COPY . .

# Vite の開発サーバーを起動
CMD ["npm", "run", "dev"]
