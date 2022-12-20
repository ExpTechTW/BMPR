const fs = require("fs-extra");
const path = require("path");

const reload = require("require-reload")(require);

let Info = {};
let Global = {};

async function init(_Global, _Info) {
	// 傳址
	Global = _Global;
	Info = _Info;


	const plugins_list = fs.readdirSync(path.resolve("../plugins"));

	// 加載插件基本訊息
	for (let index = 0; index < plugins_list.length; index++)
		plugin_info(plugins_list[index]);

	// 檢查依賴關係
	for (let index = 0; index < Object.keys(Info).length; index++) {
		const name = Object.keys(Info)[index];
		for (let i = 0; i < Object.keys(Info[name].info.dependencies).length; i++) {
			const dependencies_name = Object.keys(Info[name].info.dependencies)[i];
			let version = "0.0.0";
			if (dependencies_name == "BMPR") version = Global.BMPR.info.version;
			else if (Info[dependencies_name] != undefined) version = Info[dependencies_name].info.version;
			if (!version_check(Info[name].info.dependencies[dependencies_name], version)) {
				delete Info[name];
				break;
			}
		}
	}

	// 加載插件
	for (let index = 0; index < Object.keys(Info).length; index++) {
		const name = Object.keys(Info)[index];
		await plugin_load(name);
	}
}

async function plugin_load(plugin) {
	Info[plugin].plugin = reload(path.resolve(`../plugins/${Info[plugin].plugin_path}/index.js`));
	if (Info[plugin].plugin.OnStart != undefined) await Info[plugin].plugin.onStart(Global, Info);
}

async function plugin_unload(plugin) {
	if (Info[plugin].plugin?.OnClose != undefined) await Info[plugin].plugin.onClose();
	delete Info[plugin].plugin;
}

function version_check(Old, New) {
	Old = Number(Old.replaceAll(".", "").replace(">=", ""));
	New = Number(New.replaceAll(".", ""));
	if (New >= Old) return true;
	return false;
}

function plugin_info(plugin) {
	try {
		const info = JSON.parse(fs.readFileSync(path.resolve(`../plugins/${plugin}/info.json`)).toString());
		const plugin_path = plugin;
		let config = {};
		if (!fs.existsSync(path.resolve(`../config/${info.name}.json`))) {
			config = JSON.parse(fs.readFileSync(path.resolve(`../plugins/${plugin}/config.json`)).toString());
			fs.writeFileSync(path.resolve(`../config/${info.name}.json`), JSON.stringify(config, null, "\t"));
		} else
			config = JSON.parse(fs.readFileSync(path.resolve(`../config/${info.name}.json`)).toString());
		Info[info.name] = {
			config,
			info,
			plugin_path,
		};
	} catch (err) {
		return err;
	}
}

module.exports = {
	init,
};