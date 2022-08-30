let Function = null;
let List = null;
let BMPR = null;

function init(Fun, list, bmpr) {
	List = list;
	Function = Fun;
	BMPR = bmpr;
	return;
}

/**
 *
 * @param {string} plugin
 * @returns
 */
function main(plugin) {
	if (plugin == undefined) {
		let msg = `**${BMPR.Prefix}help BMPR** | 機器人\n`;
		for (let index = 0; index < List.length; index++) {
			if (Function[List[index]].Info.commands.length == 0) continue;
			msg += `**${BMPR.Prefix}help ${Function[List[index]].Info.name}** | **${Function[List[index]].Info.description.zh_tw}**\n`;
		}
		return msg;
	} else {
		if (plugin == "BMPR")
			return "**BMPR**\nbmpr upgrade | BMPR 升級\nbmpr reload | BMPR 重載\nbmpr plugin load <插件> | 加載 插件\nbmpr plugin unload <插件> | 卸載 插件\nbmpr plugin reloadall | 重載 全部 插件\nbmpr permission set <名稱/ID> | 設定權限";
		for (let index = 0; index < List.length; index++) {
			let msg = "";
			if (!List[index].includes(plugin)) continue;
			msg += `**${Function[List[index]].Info.name}**\n`;
			for (let Index = 0; Index < Function[List[index]].Info.commands.length; Index++) {
				const name = Function[List[index]].Info.commands[Index]["name"];
				const note = Function[List[index]].Info.commands[Index]["note"];
				msg += `${name.replace("${prefix}", BMPR.Prefix)} | ${note}\n`;
			}
			return msg;
		}
		return "未發現此 插件 說明";
	}
}

module.exports = {
	init,
	main,
};