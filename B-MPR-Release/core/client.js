const reload = require('require-reload')(require)
const Config = reload('../../Database/config/main')
const Console = reload('./console')
const Loader = reload('./loader')
const Handler = reload('./handler')
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

async function main(info) {
    Info = info
    client.login(Config.config["Bot.Token"])
}

client.on('ready', async () => {
    await Console.init(client)
    Loader.init()
    client.user.setActivity('Powered by ExpTech')
    Console.main(`目前登入身份: ${client.user.tag} | 群組數量: ${client.guilds.cache.size}`, 2, "Core", "Client")
})

client.on('messageCreate', async message => {
    if (message.content.startsWith("mpr")) Handler.main(message.content)
})

// client.on('messageReactionAdd', async (reaction, user) => {
//     pluginLoader.messageReactionAdd(reaction, user)
// })

// client.on('messageReactionRemove', async (reaction, user) => {
//     pluginLoader.messageReactionRemove(reaction, user)
// })

// client.on("channelCreate", async channel => {
//     pluginLoader.channelCreate(channel)
// })

// client.on("channelDelete", async channel => {
//     pluginLoader.channelDelete(channel)
// })

// client.on("messageDelete", async (message) => {
//     pluginLoader.messageDelete(message)
// })

// client.on("messageUpdate", async (Old, New) => {
//     pluginLoader.messageUpdate(Old, New)
// })

module.exports = {
    main
}