let BMPR = null
let Info = null

async function init(bmpr) {
    BMPR = bmpr
    Info = BMPR.Info
}

async function main(dependencies, Function, list) {
    for (let index = 0; index < Object.keys(dependencies).length; index++) {
        let plugin = Object.keys(dependencies)[index]
        if (plugin == "BMPR") {
            if (!await ver(dependencies[Object.keys(dependencies)[index]], Info.version)) {
                await BMPR.Console.main(`${plugin} 依賴 過舊`, 4, "API", "Rely")
                return false
            }
        } else {
            for (let index = 0; index < list.length; index++) {
                if (list[index].includes(plugin)) {
                    if (!await ver(dependencies[Object.keys(dependencies)[index]], Function[list[index]].Info.version)) {
                        await BMPR.Console.main(`${plugin} 依賴 過舊`, 4, "API", "Rely")
                        return false
                    }
                }
            }
            await BMPR.Console.main(`${plugin} 依賴 未安裝`, 4, "API", "Rely")
            return false
        }
    }
    return true
}

async function ver(Old, New) {
    Old = Number(Old.replaceAll(".", "").replace(">=", ""))
    New = Number(New.replaceAll(".", ""))
    if (New >= Old) {
        return true
    }
    return false
}

module.exports = {
    main,
    init
}