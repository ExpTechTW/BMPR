let Console = null
let Loader = null
let Handler = null
let User = null
let Permission = null
let Rely = null
const { Client } = require('discord.js')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const client = new Client({
    intents: [
        'Guilds',
        "GuildMembers",
        "GuildBans",
        "GuildEmojisAndStickers",
        "GuildIntegrations",
        "GuildWebhooks",
        "GuildInvites",
        "GuildVoiceStates",
        "GuildPresences",
        "GuildMessages",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "DirectMessages",
        "DirectMessageReactions",
        "DirectMessageTyping",
        "MessageContent",
        "GuildScheduledEvents"
    ]
})

let Info = null
let Config = null
let BMPR = null
let Check = false

async function main(bmpr, info) {
    BMPR = bmpr
    Config = await bmpr.Config.main()
    BMPR.Config = Config
    BMPR.Prefix = Config.Prefix
    Console = bmpr.Console
    Loader = bmpr.Loader
    Handler = bmpr.Handler
    Rely = bmpr.Rely
    User = bmpr.User
    Permission = bmpr.Permission
    Info = info
    client.login(Config["Bot.Token"])
}

client.on('ready', async (client) => {
    BMPR.Client = client
    await Console.init(client, Config, BMPR)
    let list = fs.readdirSync(path.resolve("./Database/cache/"))
    if (list.includes("update.tmp")) {
        fs.unlinkSync(path.resolve("./Database/cache/update.tmp"))
        await Console.main("更新完成", 2, "Core", "Update")
    }
    if (Info.reload != undefined) {
        await Console.main(Info.reload, 3, "Main", "Main")
    }
    delete Info.reload
    await Rely.init(BMPR)
    await Loader.init(BMPR)
    await Permission.init(BMPR)
    await Handler.init(BMPR)
    await Loader.ready(client)
    client.user.setActivity(`${Config["Prefix"]}help | Powered by ExpTech`)
    const res = await fetch('https://api.github.com/repos/ExpTechTW/BMPR/releases')
    const data = await res.json()
    let num = 0
    let last = ""
    for (let index = 0; index < data.length; index++) {
        if (Config["Pre-Release"]) {
            if (data[index]["tag_name"] != Info.version) {
                num++
                if (last == "") {
                    last = data[index]["tag_name"]
                }
            }
        } else {
            if (data[index]["prerelease"] == false && data[index]["tag_name"] != Info.version) {
                num++
                if (last == "") {
                    last = data[index]["tag_name"]
                }
            }
        }
        if (data[index]["tag_name"] == Info.version) break
    }
    await Console.main(`BMPR 版本: ${Info.version} | 目前登入身份: ${client.user.tag} | 群組數量: ${client.guilds.cache.size}`, 2, "Core", "Client")
    let info = JSON.parse(fs.readFileSync(path.resolve("./Database/cache/info.tmp")).toString())
    await Console.main(`主線程 PID: ${info.PID} | 副線程 PID: ${info.pid}`, 2, "Core", "Client")
    if (num == 0) {
        await Console.main(`已是最新版本`, 2, "Core", "Client")
    } else {
        await Console.main(`最新版本: ${last} 落後 最新版本 ${num} 個版本 使用 bmpr upgrade 更新`, 3, "Core", "Client")
    }
    Check = true
    client.guilds.cache.forEach(async (guild) => {
        if (!guild.members.me.permissions.has("Administrator")) {
            let U = await client.users.fetch(guild.ownerId).catch((err) => { })
            U.send("請給予機器人 **管理者** 權限\n從我的簡介重新邀請我")
            guild.leave()
        }
    })
})

client.on('messageCreate', async message => {
    if (!Check) return
    if (message.channel.id == Config["Bot.Console"]) {
        if (message.author.id != client.user.id) await Console.clear()
        if (message.content.startsWith("bmpr")) Handler.main(message.content)
    }
    await Loader.messageCreate(message)
    await User.main(message.author)
    await Permission.main(message.author)
    if (message.content == `${Config["Prefix"]}help`) message.reply(">>> " + await BMPR.Help.main())
    if (message.content.startsWith(`${Config["Prefix"]}help `)) message.reply(">>> " + await BMPR.Help.main(message.content.replace(`${Config["Prefix"]}help `, "")))
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (!Check) return
    await Loader.messageReactionAdd(reaction, user)
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (!Check) return
    await Loader.messageReactionRemove(reaction, user)
})

client.on("channelCreate", async channel => {
    if (!Check) return
    await Loader.channelCreate(channel)
})

client.on("channelDelete", async channel => {
    if (!Check) return
    await Loader.channelDelete(channel)
})

client.on("messageDelete", async (message) => {
    if (!Check) return
    await Loader.messageDelete(message)
})

client.on("messageUpdate", async (Old, New) => {
    if (!Check) return
    await Loader.messageUpdate(Old, New)
})

client.on("guildCreate", async (guild) => {
    if (!Check) return
    if (!guild.members.me.permissions.has("Administrator")) {
        let U = await client.users.fetch(guild.ownerId).catch((err) => { })
        U.send("請給予機器人 **管理者** 權限\n從我的簡介重新邀請我")
        guild.leave()
    }
    await Loader.guildCreate(guild)
})

client.on("guildDelete", async (guild) => {
    if (!Check) return
    await Loader.guildDelete(guild)
})

module.exports = {
    main
}