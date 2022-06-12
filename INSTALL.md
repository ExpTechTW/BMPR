# 安裝指南

## 索引
- [下載](#下載)
- [解壓縮](#解壓縮)
- [環境](#環境)

## 下載
- [下載](https://github.com/ExpTechTW/BMPR/releases/download/1.0.0/BMPR.zip)
- BMPR 沒有提供 `1.0.0` 以上版本的載點
- 不要直接下載倉庫

## 解壓縮
![image](https://user-images.githubusercontent.com/44525760/173214647-203d91df-d81b-47f3-98fe-703d5d0dfa42.png)
- `BMPR.zip` 解壓縮後應和圖片一致
```
文件結構
|── /BMPR-Release/ | BMPR 核心文件
|── /Database/ | BMPR 資料存放
|── /node_modules/ | node 模組
│── index.js | 入口點
│── package.json | node 依賴
└── BMPR.js | BMPR 插件 依賴
```

## 環境
![image](https://user-images.githubusercontent.com/44525760/173214875-8b808422-4f12-4ec2-8719-6185459d81c3.png)
![image](https://user-images.githubusercontent.com/44525760/173214879-ec26aa23-4fba-462e-9ce8-49b4d8e5326e.png)
- `nodejs_17`

## 啟動
- 在 `Database/config/BMPR.json` 設定 `Bot.Token` `Bot.Console` 基本參數
- 啟動 機器人 後 請在 console 使用 `bmpr upgrade` ' 將 機器人 升級至最新版本

## 錯誤
#### 未放入 機器人 Token
![image](https://user-images.githubusercontent.com/44525760/173214906-62631f3c-b808-451c-9a6f-77d677eeccc0.png)
