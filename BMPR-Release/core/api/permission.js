const fs = require('fs')

let BMPR = null
let Console = null

// 0 guest | 最低權限，如訪客或者熊孩子
// 1 user | 普通玩家
// 2 helper | 助手，可以協助管理員進行服務器管理。例子：值得信賴的成員
// 3 admin | 管理員，擁有控制 BMPR 的能力。
// 4 owner | 最高權限，所有者，具有控制物理服務器的能力。例子：服務器擁有者

async function init(bmpr) {
    BMPR = bmpr
    Console = BMPR.Console
}

async function main(User) {
    if (!fs.existsSync(path.resolve("./Database/data/permission.json"))) {
        fs.writeFileSync(path.resolve("./Database/data/permission.json"), "[]")
    }
    let user = JSON.parse(fs.readFileSync(path.resolve("./Database/data/permission.json")).toString())
    for (let index = 0; index < user.length; index++) {
        if (user[index]["id"] == User.id) {
            user[index]["name"] = User.username
            return true
        }
    }
    user.push({
        id: User.id,
        name: User.username,
        permission: 1
    })
    fs.writeFileSync(path.resolve("./Database/data/permission.json"), JSON.stringify(user))
    return true
}

async function set(user, level) {
    if (Number(level) < 0 || Number(level) > 4) return false
    for (let index = 0; index < user.length; index++) {
        if (user[index]["id"] == User.id || user[index]["name"] == User.username) {
            user[index]["permission"] = Number(level)
            await Console.main(`已設定 名稱: ${user[index]["name"]} | ID: ${user[index]["id"]} | 權限: ${Number(level)}`, 0, "API", "Permission")
            return true
        }
    }
    return false
}

async function get(user) {
    for (let index = 0; index < user.length; index++) {
        if (user[index]["id"] == User.id || user[index]["name"] == User.username) {
            return user[index]["permission"]
        }
    }
    return false
}

module.exports = {
    init,
    main,
    set,
    get
}
