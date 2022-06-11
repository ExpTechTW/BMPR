# 插件開發指南

## 索引
- [結構](#結構)
- [BMPR.json](#BMPR.json)
- [權限](#權限)
- [依賴注入](#依賴注入)
- [範例](#範例)
- [發布](#發布)

## 結構
- BMPR 與 MPR 有著非常大的不同，BMPR 允許插件有多個檔案，而 MPR 僅能有一個，此外，插件的加載方式也有所改變，棄用了 Hot Loading，提升插件穩定性。
```
插件文件結構
|── /JavaScript | JavaScript 文件夾
│  ├── Time.js | 獲取時間功能
│  └── Count.js | 數學計算功能
│── /index.js | 入口點
│── /config.json | 插件自己的配置文件
└── /BMPR.json | BMPR 插件 基本資訊
```
- `index.js` 插件從此處被加載
- `config` 插件自己的 config ，如果插件須提供自定義功能，才創建此文件
- `BMPR.json` 給 BMPR 讀取的 資本資訊
#### 封裝
- 將 文件夾 改成 `插件名稱 (須和 BMPR.json "name" 屬性一致)` ，並壓縮成 `.zip` 檔，最後將副檔名改成 `.bmpr`

## BMPR.json
```json5
{
    "version": "1.0.0", // 插件 版本
    "name": "Example", // 插件 名稱
    "description": { // 插件 介紹
        "zh_tw": "B-MPR 的範例插件"
    },
    "events": [ // 插件 註冊事件
        "messageCreate"
    ],
    "commands": [ // 插件 註冊指令
        {
            "name": "ping", // 指令名稱
            "note": "pong", // 指令註釋
            "permission": 1 // 指令權限
        }
    ],
    "author": [ // 插件 作者
        "whes1015"
    ],
    "dependencies": { // 插件 依賴
        "BMPR": ">=1.0.0"
    },
    "resources": [ // 插件 開源協議
        "AGPL-3.0"
    ],
    "link": "https://github.com/ExpTechTW/B-MPR" // 插件 GitHub 倉庫地址
}
```

## 權限
- 所有成員 默認 `1`
```
0 guest | 最低權限，如訪客或者熊孩子
1 user | 普通玩家
2 helper | 助手，可以協助管理員進行服務器管理。例子：值得信賴的成員
3 admin | 管理員，擁有控制 BMPR 的能力。
4 owner | 最高權限，所有者，具有控制物理服務器的能力。例子：服務器擁有者
```

## 依賴注入
```js
const bmpr = require('../../../BMPR') // 導入 BMPR 全家桶
bmpr.Console // 日誌系統
bmpr.Permission // 權限系統
bmpr.Loader // 加載系統
bmpr.Handler // 指令處理系統
bmpr.Config // BMPR 自身 config
bmpr.Structure // Discord 構造器
```

## 範例
- 一切完成之後 你的檔案看起來會像這樣
#### index.js
```JavaScript
const bmpr = require('../../../BMPR')

async function messageCreate(message) {
    if (message.content == "ping") {
        bmpr.Console.main("ping",2,"Example","Main")
        message.reply("pong")
    }
}

module.exports = {
    messageCreate
}
```
#### BMPR.json
```json
{
    "version": "1.0.0",
    "name": "Example",
    "description": {
        "zh_tw": "B-MPR 的範例插件"
    },
    "events": [
        "messageCreate"
    ],
    "commands": [
        {
            "name": "ping",
            "note": "簡單回應功能",
            "permission": 1
        }
    ],
    "author": [
        "whes1015"
    ],
    "dependencies": {
        "BMPR": ">=1.0.0"
    },
    "resources": [
        "AGPL-3.0"
    ],
    "link": "https://github.com/ExpTechTW/B-MPR"
}
```
