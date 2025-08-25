import { Configuration, DefaultApi } from "."; // 生成されたファイルからインポート

// APIサーバーのURLを設定
const config = new Configuration({
  basePath: "http://localhost:8080", // あなたのAPIサーバーのURL
});

// 設定を適用してAPIクライアントのインスタンスを作成
export const tasksApi = new DefaultApi(config);