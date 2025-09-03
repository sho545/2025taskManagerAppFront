// src/apis/client.ts

import { Configuration } from "../apis/configuration"; // 生成された部品をインポート
import { DefaultApi } from "../apis/api"; 

// 1. 設定を集約
const config = new Configuration({
  basePath: "http://localhost:8080", 
});

// 2 & 3. インスタンス化してエクスポート
export const tasksApi = new DefaultApi(config);