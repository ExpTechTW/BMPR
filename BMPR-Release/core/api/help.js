let Function = null
let List = null
let Prefix = null

async function init(Fun, list, prefix) {
    List = list
    Function = Fun
    Prefix = prefix.Prefix
}

async function main(plugin) {
    if (plugin == undefined) {
        let msg = `**${Prefix}help BMPR**\n`
        for (let index = 0; index < List.length; index++) {
            msg += `**${Prefix}help ${Function[List[index]].Info.name}**\n`
        }
        return msg
    } else {
        if (plugin == "BMPR") {
            return "**BMPR**\nbmpr upgrade | BMPR 升級\nbmpr reload | BMPR 重載\nbmpr plugin load <插件> | 加載 插件\nbmpr plugin unload <插件> | 卸載 插件\nbmpr plugin reloadall | 重載 全部 插件\nbmpr permission set <名稱/ID> | 設定權限"
        }
        for (let index = 0; index < List.length; index++) {
            let msg = ""
            if (!List[index].includes(plugin)) continue
            msg += `**${Function[List[index]].Info.name}**\n`
            for (let Index = 0; Index < Function[List[index]].Info.commands.length; Index++) {
                let name = Function[List[index]].Info.commands[Index]["name"]
                let note = Function[List[index]].Info.commands[Index]["note"]
                msg += `${name} | ${note}\n`
            }
            return msg
        }
        return "未發現此 插件 說明"
    }
}

module.exports = {
    init,
    main
}