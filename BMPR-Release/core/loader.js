const reload = require('require-reload')(require)
let Console = null
let Rely = null
const fs = require('fs')
const path = require("path")
const zl = require("zip-lib")
let User = reload('./api/user')

let Function = {}
let list = []
let WatchdogL = {
    init: {},
    ready: {},
    messageCreate: {},
    messageReactionAdd: {},
    messageReactionRemove: {},
    channelCreate: {},
    channelDelete: {},
    messageDelete: {},
    messageUpdate: {}
}
let Config = {}
let BMPR = null

async function PluginUnload(Plugin) {
    for (let index = 0; index < list.length; index++) {
        if (Plugin.includes(list[index])) {
            await Console.main(`${list[index]} 插件 已卸載`, 3, "Core", "Loader")
            list.splice(index, 1)
            return
        }
    }
    await Console.main(`未發現 ${list[index]} 插件`, 3, "Core", "Loader")
    return
}

async function PluginLoad(Plugin) {
    let LIST = fs.readdirSync(path.resolve("./Plugin/lock"))
    for (let index = 0; index < LIST.length; index++) {
        if (Plugin.includes(LIST[index])) {
            await Console.main(`${LIST[index]} 插件 已加載`, 3, "Core", "Loader")
            if (!list.includes(LIST[index])) list.push(LIST[index])
            return
        }
    }
    await Console.main(`未發現 ${list[index]} 插件`, 3, "Core", "Loader")
    return
}

setInterval(async () => {
    for (let index = 0; index < Object.keys(WatchdogL).length; index++) {
        let Event = Object.keys(WatchdogL)[index]
        for (let Index = 0; Index < Object.keys(WatchdogL[Event]).length; Index++) {
            let Plugin = Object.keys(WatchdogL[Event])[Index]
            if (new Date().getTime() - WatchdogL[Event][Plugin] > 5000) {
                delete WatchdogL[Event][Plugin]
                if (!Plugin.includes(".js")) {
                    Function[Plugin] = await reload(`../../Plugin/lock/${Plugin}/index.js`)
                    let Info = JSON.parse(fs.readFileSync(path.resolve("./Plugin/lock/" + Plugin + "/info.json")).toString())
                    Function[Plugin].Info = Info
                    await Console.main(`${Plugin} Watchdog 已重載 Package | 版本: ${Info.version}`, 3, "Core", "Loader")
                } else {
                    Function[Plugin] = reload(`../../Plugin/lock/${Plugin}`)
                    await Console.main(`${Plugin} Watchdog 已重載 Single | 版本: ${Info.version}`, 3, "Core", "Loader")
                }
            }
        }
    }
}, 1000)

async function init(bmpr) {
    BMPR = bmpr
    Console = BMPR.Console
    Rely = BMPR.Rely
    let List = fs.readdirSync(path.resolve("./Plugin"))
    for (let index = 0; index < List.length; index++) {
        try {
            if (List[index] != "lock" && (List[index].includes(".js") || List[index].includes(".zip") || List[index].includes(".bmpr"))) {
                if (List[index].includes(".zip") || List[index].includes(".bmpr")) {
                    fs.copyFileSync(path.resolve("./Plugin/" + List[index]), path.resolve("./Plugin/lock/" + List[index]))
                    const unzip = new zl.Unzip()
                    await unzip.extract(path.resolve("./Plugin/lock/" + List[index]), path.resolve("./Plugin/lock/"))
                    fs.unlinkSync(path.resolve("./Plugin/lock/" + List[index]))
                    await Console.main(`${List[index]} 緩存 Package 插件`, 1, "Core", "Loader")
                } else {
                    fs.copyFileSync(path.resolve("./Plugin/" + List[index]), path.resolve("./Plugin/lock/" + List[index]))
                    await Console.main(`${List[index]} 緩存 Single 插件`, 1, "Core", "Loader")
                }
            }
        } catch (error) {
            await Console.main(`${List[index]} 緩存 >> ${error}`, 4, "Core", "Loader")
        }
    }
    await Load()
    await RelyCheck()
    await BMPR.Help.init(Function, list, await BMPR.Config.main())
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("init")) {
                WatchdogL["init"][list[index]] = new Date().getTime()
                await Function[list[index]].init()
                await Console.main(`${list[index]} init`, 1, "Core", "Loader")
                delete WatchdogL["init"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} init 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function Load() {
    list = fs.readdirSync(path.resolve("./Plugin/lock"))
    for (let index = 0; index < list.length; index++) {
        if (list[index].includes(".zip") || list[index].includes(".bmpr")) {
            fs.unlinkSync(path.resolve("./Plugin/lock/" + list[index]))
            continue
        }
        try {
            if (!list[index].includes(".js")) {
                Function[list[index]] = await reload(`../../Plugin/lock/${list[index]}/index.js`)
                let Info = JSON.parse(fs.readFileSync(path.resolve("./Plugin/lock/" + list[index] + "/BMPR.json")).toString())
                Function[list[index]].Info = Info
                if (fs.existsSync(path.resolve(`./Plugin/lock/${list[index]}/config.json`))) {
                    if (!fs.existsSync(path.resolve(`./Database/config/${list[index]}.json`))) {
                        fs.copyFileSync(path.resolve(`./Plugin/lock/${list[index]}/config.json`), path.resolve(`./Database/config/${list[index]}.json`))
                    } else {
                        Config[index] = JSON.parse(fs.readFileSync(path.resolve(`./Database/config/${list[index]}.json`)).toString())
                    }
                }
                await Console.main(`${list[index]} 已加載 Package 插件 | 版本: ${Info.version}`, 1, "Core", "Loader")
            } else {
                Function[list[index]] = reload(`../../Plugin/lock/${list[index]}`)
                if (Function[list[index]].config != undefined) {
                    if (!fs.existsSync(path.resolve(`./Database/config/${list[index].replace(".js", "")}.json`))) {
                        fs.writeFileSync(path.resolve(`./Database/config/${list[index].replace(".js", "")}.json`), JSON.stringify(Function[list[index]].config))
                    } else {
                        Config[index] = JSON.parse(fs.readFileSync(path.resolve(`./Database/config/${list[index].replace(".js", "")}.json`)).toString())
                    }
                }
                await Console.main(`${list[index]} 已加載 Single 插件 | 版本: ${Info.version}`, 1, "Core", "Loader")
            }
        } catch (error) {
            await Console.main(`${list[index]} 加載 錯誤 >> ${error}`, 4, "Core", "Loader")
            list.splice(index, 1)
        }
    }
    return
}

async function RelyCheck() {
    for (let index = 0; index < list.length; index++) {
        try {
            if (!await Rely.main(Function[list[index]].Info.dependencies, Function, list)) throw "依賴問題"
        } catch (error) {
            await Console.main(`${list[index]} 插件 已卸載 >> ${error}`, 4, "Core", "Loader")
            list.splice(index, 1)
        }
    }
}

async function ready(client) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("ready")) {
                WatchdogL["ready"][list[index]] = new Date().getTime()
                await Function[list[index]].ready(client)
                await Console.main(`${list[index]} ready`, 1, "Core", "Loader")
                delete WatchdogL["ready"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} ready 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function messageCreate(message) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("messageCreate")) {
                WatchdogL["messageCreate"][list[index]] = new Date().getTime()
                await Function[list[index]].messageCreate(message)
                await Console.main(`${list[index]} messageCreate`, 0, "Core", "Loader")
                delete WatchdogL["messageCreate"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} messageCreate 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function messageReactionAdd(reaction, user) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("messageReactionAdd")) {
                WatchdogL["messageReactionAdd"][list[index]] = new Date().getTime()
                await Function[list[index]].messageReactionAdd(reaction, user)
                await Console.main(`${list[index]} messageReactionAdd`, 0, "Core", "Loader")
                delete WatchdogL["messageReactionAdd"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} messageReactionAdd 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function messageReactionRemove(reaction, user) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("messageReactionRemove")) {
                WatchdogL["messageReactionRemove"][list[index]] = new Date().getTime()
                await Function[list[index]].messageReactionRemove(reaction, user)
                await Console.main(`${list[index]} messageReactionRemove`, 0, "Core", "Loader")
                delete WatchdogL["messageReactionRemove"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} messageReactionRemove 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function channelCreate(channel) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("channelCreate")) {
                WatchdogL["channelCreate"][list[index]] = new Date().getTime()
                await Function[list[index]].channelCreate(channel)
                await Console.main(`${list[index]} channelCreate`, 0, "Core", "Loader")
                delete WatchdogL["channelCreate"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} channelCreate 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function channelDelete(channel) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("channelDelete")) {
                WatchdogL["channelDelete"][list[index]] = new Date().getTime()
                await Function[list[index]].channelDelete(channel)
                await Console.main(`${list[index]} channelDelete`, 0, "Core", "Loader")
                delete WatchdogL["channelDelete"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} channelDelete 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function messageDelete(message) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("messageDelete")) {
                WatchdogL["messageDelete"][list[index]] = new Date().getTime()
                await Function[list[index]].messageDelete(message)
                await Console.main(`${list[index]} messageDelete`, 0, "Core", "Loader")
                delete WatchdogL["messageDelete"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} messageDelete 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

async function messageUpdate(message) {
    for (let index = 0; index < list.length; index++) {
        try {
            let Info = Function[list[index]].Info
            if (Info.events.includes("messageUpdate")) {
                WatchdogL["messageUpdate"][list[index]] = new Date().getTime()
                await Function[list[index]].messageUpdate(message)
                await Console.main(`${list[index]} messageUpdate`, 0, "Core", "Loader")
                delete WatchdogL["messageUpdate"][list[index]]
            }
        } catch (error) {
            await Console.main(`${list[index]} messageUpdate 錯誤 >> ${error}`, 4, "Core", "Loader")
        }
    }
}

module.exports = {
    Function,
    Config,
    WatchdogL,
    list,
    PluginUnload,
    PluginLoad,
    Load,
    init,
    ready,
    messageCreate,
    messageReactionAdd,
    messageReactionRemove,
    channelCreate,
    channelDelete,
    messageDelete,
    messageUpdate
}