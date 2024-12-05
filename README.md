# 環境構築手順

## 1. プロジェクトのリポジトリをクローン
1. プロジェクトのリポジトリをクローン
```bash
$ git clone https://github.com/RIKU-SEINO/ekiview.git
```
2. プロジェクトのディレクトリに移動

```bash
$ cd ekiview
```

## 2. Docker / Docker Composeの環境構築

### 2-1. Docker / Docker Composeのインストール

[Windows 11でWSLを使ってDockerとDocker Composeをセットアップする方法 - Qiita](https://qiita.com/c8h9no2/items/63207d8343566a489bdd)

※↑上記がやや難しければ、下記↓でもできるかなと思います

[Dockerのインストール（Windows向け)](https://sukkiri.jp/technologies/virtualizers/wsl2%E3%81%AE%E5%B0%8E%E5%85%A5%E3%80%90windows10%EF%BC%88%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B32004-%E4%BB%A5%E4%B8%8A-or-windows11%E3%80%91.html)

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
1. ルートディンレクトリに戻り、frontendフォルダに移動
```bash
cd ../frontend
```
2. インストール
```bash
npm install
```

## 5. Dockerコンテナの起動
ここのステップでは、2.でインストールしたDocker Desktopを立ち上げておく必要があります
1. Dockerイメージのビルド
```bash
docker compose build --no-cache
```
2. Dockerコンテナの立ち上げ
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

# エラーに遭遇した時の対処
- 「5. Dockerコンテナの起動」で、`error getting credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH, out: `というエラーが出た時

  - [Windows への Node.js（npm）のインストール - Qiita](https://qiita.com/gahoh/items/8444da99a1f93b6493b4)

- それ以外のエラー
  - Docker DesktopのContainersで作成されているコンテナをクリックすると、一つだけContainersがあるので、それをクリックし、止まっているコンテナのログを送って欲しいです。