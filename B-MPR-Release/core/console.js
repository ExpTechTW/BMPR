const reload = require('require-reload')(require)
const Config = reload('../../Database/config/main')
const Structure = reload('./structure')
const Handler = reload('./handler')
const Time = reload('./api/time')

let c = null
let cache = -1
let msgID = 0
let body = ""

async function init(client) {
    c = await client.channels.fetch(Config.config["Bot.Console"]).catch(err => {
        main("日誌輸出到 Discord 時發生異常", 4)
    })
    return
}

async function main(msg, level, sender, fun) {
    if (sender == undefined) sender = "N/A"
    if (fun == undefined) fun = "Main"
    if (level == undefined) level = 2
    // Track 0
    // Debug 1
    // Info 2
    // Warn 3
    // Error 4
    if (Config.config["Bot.Console.outLevel"] <= level) {
        if (level == 1) {
            console.log(`[${sender}][${await Time.Simple()}][${fun}]: ${msg}`)
        } else if (level == 0) {
            console.log("\x1b[90m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m")
        } else if (level == 4) {
            console.log("\x1b[31m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m")
        } else if (level == 3) {
            console.log("\x1b[33m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m")
        } else {
            console.log("\x1b[32m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m")
        }
        if (c == null) return
        if (cache == level) {
            let MSG = await c.messages.fetch(msgID.id)
            body += `\n[${sender}][${await Time.Simple()}][${fun}]: ${msg}`
            if (level == 1) {
                await MSG.edit(await Structure.embed("**日誌**\n\n```" + body + "```", "#FFFFFF"))
            } else if (level == 0) {
                await MSG.edit(await Structure.embed("**追蹤**\n\n```" + body + "```", "#6C6C6C"))
            } else if (level == 4) {
                await MSG.edit(await Structure.embed("**錯誤**\n\n```" + body + "```", "#FF0000"))
            } else if (level == 3) {
                await MSG.edit(await Structure.embed("**警告**\n\n```" + body + "```", "#FF9224"))
            } else {
                await MSG.edit(await Structure.embed("**訊息**\n\n```" + body + "```", "#00EC00"))
            }
            check()
        } else {
            cache = level
            body = `[${sender}][${await Time.Simple()}][${fun}]: ${msg}`
            if (level == 1) {
                msgID = await c.send(await Structure.embed("**日誌**\n\n```" + body + "```", "#FFFFFF"))
            } else if (level == 0) {
                msgID = await c.send(await Structure.embed("**追蹤**\n\n```" + body + "```", "#6C6C6C"))
            } else if (level == 4) {
                msgID = await c.send(await Structure.embed("**錯誤**\n\n```" + body + "```", "#FF0000"))
            } else if (level == 3) {
                msgID = await c.send(await Structure.embed("**警告**\n\n```" + body + "```", "#FF9224"))
            } else {
                msgID = await c.send(await Structure.embed("**訊息**\n\n```" + body + "```", "#00EC00"))
            }
        }
    }
}

process.stdin.on('data', async data => {
    data = `\n${data}`
    if (c == null) return
    if (cache == 5) {
        let MSG = await c.messages.fetch(msgID.id)
        body += `\n[Console][${await Time.Simple()}][Main]: ${data}`
        await MSG.edit(await Structure.embed("**控制臺**\n\n```" + body + "```", "#00EC00"))
        check()
    } else {
        body = `[Console][${await Time.Simple()}][Main]: ${data}`
        msgID = await c.send(await Structure.embed("**控制臺**\n\n```" + body + "```", "#00EC00"))
        cache = 5
    }
    data = data.replaceAll("\n", "")
    if (data.startsWith("mpr")) Handler.main(data)
})

async function check() {
    if (body.length > 400) {
        cache = -1
    }
}

module.exports = {
    init,
    main
}