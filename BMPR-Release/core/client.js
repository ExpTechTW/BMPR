let Console = null
let Loader = null
let Handler = null
let User = null
let Permission = null
let Rely = null
const { Client } = require('discord.js')
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

async function main(bmpr) {
    BMPR = bmpr
    Config = await bmpr.Config.main()
    Console = bmpr.Console
    Loader = bmpr.Loader
    Handler = bmpr.Handler
    Rely = bmpr.Rely
    User = bmpr.User
    Permission = bmpr.Permission
    Info = bmpr.Info
    client.login(Config["Bot.Token"])
}

client.on('ready', async (client) => {
    await Console.init(client, Config, BMPR)
    if (Info.reload != undefined) {
        if (Info.reload == "Reload from Update") {
            await Console.main("正在下載 更新包...", 3, "Core", "Update")
            await Console.main("更新包 下載完成", 3, "Core", "Update")
            await Console.main("正在解壓縮 更新包...", 3, "Core", "Update")
            await Console.main("更新包 解壓縮完成", 3, "Core", "Update")
            await Console.main("已套用 更新包", 3, "Core", "Update")
            await Console.main("已刪除 更新包", 3, "Core", "Update")
            await Console.main("更新完成", 2, "Core", "Update")
        }
        await Console.main(Info.reload, 3, "Main", "Main")
    }
    delete Info.reload
    await Rely.init(BMPR)
    await Loader.init(BMPR)
    await Permission.init(BMPR)
    await Handler.init(BMPR)
    await Loader.ready(client)
    client.user.setActivity('Powered by ExpTech')
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
    if (num == 0) {
        await Console.main(`已是最新版本`, 2, "Core", "Client")
    } else {
        await Console.main(`最新版本: ${last} 落後 最新版本 ${num} 個版本`, 3, "Core", "Client")
    }
    await Console.main(`BMPR 版本: ${Info.version} | 目前登入身份: ${client.user.tag} | 群組數量: ${client.guilds.cache.size}`, 2, "Core", "Client")
})

client.on('messageCreate', async message => {
    try {
        if (message.channel.id == Config["Bot.Console"]) {
            if (message.author.id != client.user.id) await Console.clear()
            if (message.content.startsWith("bmpr")) Handler.main(message.content)
        }
        await Loader.messageCreate(message)
        await User.main(message.author)
        await Permission.main(message.author)
    } catch (error) {

    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    await Loader.messageReactionAdd(reaction, user)
})

client.on('messageReactionRemove', async (reaction, user) => {
    await Loader.messageReactionRemove(reaction, user)
})

client.on("channelCreate", async channel => {
    await Loader.channelCreate(channel)
})

client.on("channelDelete", async channel => {
    await Loader.channelDelete(channel)
})

client.on("messageDelete", async (message) => {
    await Loader.messageDelete(message)
})

client.on("messageUpdate", async (Old, New) => {
    await Loader.messageUpdate(Old, New)
})

module.exports = {
    main
}