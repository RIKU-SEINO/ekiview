# 環境構築手順（MacBookをお使いの方）
## 1. プロジェクトのリポジトリをクローン
1. プロジェクトのリポジトリをクローン
```bash
git clone https://github.com/RIKU-SEINO/ekiview.git
```
2. プロジェクトのディレクトリに移動

```bash
cd ekiview
```

3. .env.sampleを.envとしてコピーし、作成された.envのGOOGLE_MAPS_API_KEYのxxxを書き換える

```bash
cp .env.sample .env
```
この後に.envのGOOGLE_MAPS_API_KEYのxxxを書き換える（APIキーはSlackの12/12 02:31の情野のスレッドに書いています）

## 2. Docker / Docker Composeの環境構築

### 2-1. Docker / Docker Composeのインストール

https://matsuand.github.io/docs.docker.jp.onthefly/desktop/mac/install/

### 2-2. バージョンの確認
下記二つを確認し、それぞれDockerとDocker Composeのバージョンがそれぞれ出力されればOKです。

```markdown
docker --version
docker compose version
```

Tips: 
Docker Desktopは立ち上げたままにしておきましょう（今後開発する際はこれを立ち上げておく必要があります）

## 3. Node.jsのインストール

[Windows への Node.js（npm）のインストール - Qiita](https://qiita.com/gahoh/items/8444da99a1f93b6493b4)

## 4. 必要なパッケージのインストール

### 4-1. バックエンドで必要なパッケージのインストール
1. backendフォルダに移動
```bash
cd backend
```
2. インストール
```bash
npm install
```

### 4-2. フロントエンドで必要なパッケージのインストール
1. ルートディレクトリに戻り、frontendフォルダに移動
```bash
cd ../frontend
```
2. インストール
```bash
npm install
```

## 5. Dockerコンテナの起動
ここのステップでは、2.でインストールしたDocker Desktopを立ち上げておく必要があります
1. ルートディレクトリに戻る
```bash
cd ..
```
2. Dockerイメージのビルド
```bash
docker compose build
```
3. Dockerコンテナの立ち上げ
```bash
docker compose up -d
```
下記のようなものが出ればOK
```bash
 ✔ Container cpi-frontend-1  Running
 ✔ Container cpi-db-1        Running
 ✔ Container cpi-backend-1   Running  
```

## 6. アクセスできるか確認
下記2つのURLにアクセスできるかを確認してください。もしアクセスできない場合は連絡お願いします
- http://localhost:5000/
- http://localhost:3000/

## 7. Dockerコンテナの停止
```bash
docker compose stop
```
# もう一度開発に取り組む場合
1. Docker Desktopを開く
2. Dockerコンテナを立ち上げる
```bash
docker compose up -d
```

# コンテナの最新化
1. Docker Desktopを開く
2. Dockerイメージを再ビルド
```bash
docker compose build --no-cache
```
3. Dockerコンテナを再作成
```bash
docker compose up -d
```
# seedデータの投入
1. backendディレクトリに移動
```bash
cd backend
```
2. seedデータの投入
```bash
docker compose exec backend npx sequelize-cli db:seed:all
```

# エラーに遭遇した時の対処
- 「5. Dockerコンテナの起動」で、`error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH, out: `というエラーが出た時

  - [WSL2でDocker buildをすると止まる問題("docker-credential-desktop.exe": executable file not found in $PATH, out: ``) - Qiita](https://qiita.com/rasuk/items/a36b29b8c79d02fc551a)

- それ以外のエラー
  - Docker DesktopのContainersで作成されているコンテナをクリックすると、一つだけContainersがあるので、それをクリックし、止まっているコンテナのログを送って欲しいです。

# Windows PCをお使いの方

https://www.notion.so/Windows-15f8ebd4568080e8afeefd6755234ede?pvs=4
