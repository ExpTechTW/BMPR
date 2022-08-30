/* eslint-disable no-shadow */
const reload = require("require-reload")(require);
let Console = null;
let Rely = null;
const fs = require("fs-extra");
const path = require("path");
const zl = require("zip-lib");

const Function = {};
let list = [];
const WatchdogL = {
	init                  : {},
	ready                 : {},
	messageCreate         : {},
	messageReactionAdd    : {},
	messageReactionRemove : {},
	channelCreate         : {},
	channelDelete         : {},
	messageDelete         : {},
	messageUpdate         : {},
};
const Config = {};
let BMPR = null;
let Client = null;

async function PluginUnload(Plugin) {
	for (let index = 0; index < list.length; index++)
		if (Plugin.includes(list[index])) {
			await fs.remove(path.resolve("./Plugin/lock/" + list[index]));
			await Console.main(`${list[index]} 插件 已卸載`, 3, "Core", "Loader");
			list.splice(index, 1);
			return;
		}
	await Console.main(`未發現 ${Plugin} 插件`, 3, "Core", "Loader");
	return;
}

async function PluginLoad(Plugin) {
	const LIST = fs.readdirSync(path.resolve("./Plugin"));
	for (let index = 0; index < LIST.length; index++)
		if (Plugin.includes(LIST[index])) {
			await Cache(LIST[index]);
			await PluginLoading(LIST[index]);
			if (!await Rely.main(Function[LIST[index]].Info.dependencies, Function, list)) {
				await Console.main(`${LIST[index]} 插件 已卸載 >> 依賴問題`, 4, "Core", "Loader");
				return;
			} else {
				if (Function[LIST[index]].init != undefined) await Function[LIST[index]].init(BMPR);
				if (Function[LIST[index]].ready != undefined) Function[LIST[index]].ready(Client);
				await Console.main(`${LIST[index]} 插件 已加載`, 3, "Core", "Loader");
				if (!list.includes(LIST[index])) list.push(LIST[index]);
				return;
			}
		}
	await Console.main(`未發現 ${Plugin} 插件`, 3, "Core", "Loader");
	return;
}

setInterval(async () => {
	for (let index = 0; index < Object.keys(WatchdogL).length; index++) {
		const Event = Object.keys(WatchdogL)[index];
		for (let Index = 0; Index < Object.keys(WatchdogL[Event]).length; Index++) {
			const Plugin = Object.keys(WatchdogL[Event])[Index];
			try {
				if (new Date().getTime() - WatchdogL[Event][Plugin] > 5000) {
					delete WatchdogL[Event][Plugin];
					if (!Plugin.includes(".js")) {
						Function[Plugin] = await reload(`../../Plugin/lock/${Plugin}/index.js`);
						const Info = JSON.parse(fs.readFileSync(path.resolve("./Plugin/lock/" + Plugin + "/info.json")).toString());
						Function[Plugin].Info = Info;
						await Console.main(`${Plugin} Watchdog 已重載 Package | 版本: ${Info.version}`, 3, "Core", "Loader");
					} else {
						Function[Plugin] = reload(`../../Plugin/lock/${Plugin}`);
						await Console.main(`${Plugin} Watchdog 已重載 Single | 版本: ${Function[Plugin].Info.version}`, 3, "Core", "Loader");
					}
				}
			} catch (error) {
				list.splice(list.indexOf(Plugin), 1);
				await Console.main(`${Plugin} Watchdog Reload Error 已暫時卸載\n使用 bmpr plugin load ${Plugin} 重新加載`, 4, "Core", "Loader");
			}
		}
	}
}, 1000);

async function init(bmpr) {
	BMPR = bmpr;
	Console = BMPR.Console;
	Rely = BMPR.Rely;
	const List = fs.readdirSync(path.resolve("./Plugin"));
	await fs.remove("./Plugin/lock");
	fs.mkdirSync("./Plugin/lock");
	for (let index = 0; index < List.length; index++)
		await Cache(List[index]);
	await Load();
	await RelyCheck();
	await BMPR.Help.init(Function, list, BMPR);
	await Init();
	await Console.main(`所有插件加載完成 共 ${list.length} 個`, 2, "Core", "Loader");
	for (let index = 0; index < list.length; index++)
		await Console.main(`- ${list[index]}`, 2, "Core", "Loader");
}

async function Cache(plugin) {
	try {
		if (plugin != "lock")
			if (plugin.includes(".zip") || plugin.includes(".bmpr")) {
				fs.copyFileSync(path.resolve("./Plugin/" + plugin), path.resolve("./Plugin/lock/" + plugin));
				const unzip = new zl.Unzip();
				await unzip.extract(path.resolve("./Plugin/lock/" + plugin), path.resolve("./Plugin/lock/"));
				fs.unlinkSync(path.resolve("./Plugin/lock/" + plugin));
				await Console.main(`${plugin} 緩存 Compression Package 插件`, 1, "Core", "Loader");
			} else if (plugin.includes(".js")) {
				await fs.copy(path.resolve("./Plugin/" + plugin), path.resolve("./Plugin/lock/" + plugin));
				await Console.main(`${plugin} 緩存 Single 插件`, 1, "Core", "Loader");
			} else {
				await fs.copy(path.resolve("./Plugin/" + plugin), path.resolve("./Plugin/lock/" + plugin));
				await Console.main(`${plugin} 緩存 Package 插件`, 1, "Core", "Loader");
			}
	} catch (error) {
		await Console.main(`${plugin} 緩存 >> ${error}`, 4, "Core", "Loader");
	}
}

async function Init() {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].init != undefined) {
				WatchdogL["init"][list[index]] = new Date().getTime();
				await Function[list[index]].init(BMPR);
				await Console.main(`${list[index]} init`, 0, "Core", "Loader");
				delete WatchdogL["init"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} init 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function Load(args) {
	list = fs.readdirSync(path.resolve("./Plugin/lock"));
	const pluginLog = fs.readFileSync(path.resolve("./Database/cache/Crash.log"));
	for (let index = 0; index < list.length; index++)
		if (pluginLog.includes(list[index])) {
			await Console.main(`${list[index]} 插件 崩潰 已暫時卸載\n使用 bmpr plugin load ${list[index]} 重新加載`, 4, "Core", "Loader");
			list.splice(index, 1);
		}
	fs.writeFileSync(path.resolve("./Database/cache/Crash.log"), "");
	for (let index = 0; index < list.length; index++) {
		if (list[index].includes(".zip") || list[index].includes(".bmpr")) {
			fs.unlinkSync(path.resolve("./Plugin/lock/" + list[index]));
			continue;
		}
		await PluginLoading(list[index]);
	}
	if (args != undefined) {
		await Init();
		await ready(Client);
	}
	return;
}

async function PluginLoading(plugin) {
	try {
		if (!plugin.includes(".js")) {
			Function[plugin] = await reload(path.resolve(`./Plugin/lock/${plugin}/index.js`));
			const Info = JSON.parse(fs.readFileSync(path.resolve("./Plugin/lock/" + plugin + "/BMPR.json")).toString());
			Function[plugin].Info = Info;
			if (fs.existsSync(path.resolve(`./Plugin/lock/${plugin}/config.json`)))
				if (!fs.existsSync(path.resolve(`./Database/config/${plugin}.json`)))
					fs.copyFileSync(path.resolve(`./Plugin/lock/${plugin}/config.json`), path.resolve(`./Database/config/${plugin}.json`));
				else
					Config[plugin] = JSON.parse(fs.readFileSync(path.resolve(`./Database/config/${plugin}.json`)).toString());
			await Console.main(`${plugin} 加載 Package 插件 | 版本: ${Info.version}`, 1, "Core", "Loader");
		} else {
			Function[plugin] = reload(`../../Plugin/lock/${plugin}`);
			if (Function[plugin].config != undefined)
				if (!fs.existsSync(path.resolve(`./Database/config/${plugin.replace(".js", "")}.json`)))
					fs.writeFileSync(path.resolve(`./Database/config/${plugin.replace(".js", "")}.json`), JSON.stringify(Function[plugin].config));
				else
					Config[plugin] = JSON.parse(fs.readFileSync(path.resolve(`./Database/config/${plugin.replace(".js", "")}.json`)).toString());
			await Console.main(`${plugin} 加載 Single 插件 | 版本: ${Function[plugin].Info.version}`, 1, "Core", "Loader");
		}
	} catch (error) {
		await Console.main(`${plugin} 加載 錯誤 >> ${error}`, 4, "Core", "Loader");
		list.splice(list.indexOf(plugin), 1);
	}
	return;
}

async function RelyCheck() {
	for (let index = 0; index < list.length; index++)
		try {
			if (!await Rely.main(Function[list[index]].Info.dependencies, Function, list)) throw "依賴問題";
		} catch (error) {
			await Console.main(`${list[index]} 插件 已卸載 >> ${error}`, 4, "Core", "Loader");
			list.splice(index, 1);
		}
}

async function ready(client) {
	Client = client;
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].ready != undefined) {
				WatchdogL["ready"][list[index]] = new Date().getTime();
				await Function[list[index]].ready(client);
				await Console.main(`${list[index]} ready`, 1, "Core", "Loader");
				delete WatchdogL["ready"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} ready 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function messageCreate(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].messageCreate != undefined) {
				WatchdogL["messageCreate"][list[index]] = new Date().getTime();
				await Function[list[index]].messageCreate(BMPR, ...args);
				await Console.main(`${list[index]} messageCreate`, 0, "Core", "Loader");
				delete WatchdogL["messageCreate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageCreate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function messageReactionAdd(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].messageReactionAdd != undefined) {
				WatchdogL["messageReactionAdd"][list[index]] = new Date().getTime();
				await Function[list[index]].messageReactionAdd(BMPR, ...args);
				await Console.main(`${list[index]} messageReactionAdd`, 0, "Core", "Loader");
				delete WatchdogL["messageReactionAdd"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageReactionAdd 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function messageReactionRemove(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].messageReactionRemove != undefined) {
				WatchdogL["messageReactionRemove"][list[index]] = new Date().getTime();
				await Function[list[index]].messageReactionRemove(BMPR, ...args);
				await Console.main(`${list[index]} messageReactionRemove`, 0, "Core", "Loader");
				delete WatchdogL["messageReactionRemove"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageReactionRemove 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function channelCreate(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].channelCreate != undefined) {
				WatchdogL["channelCreate"][list[index]] = new Date().getTime();
				await Function[list[index]].channelCreate(BMPR, ...args);
				await Console.main(`${list[index]} channelCreate`, 0, "Core", "Loader");
				delete WatchdogL["channelCreate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} channelCreate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function channelDelete(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].channelDelete != undefined) {
				WatchdogL["channelDelete"][list[index]] = new Date().getTime();
				await Function[list[index]].channelDelete(BMPR, ...args);
				await Console.main(`${list[index]} channelDelete`, 0, "Core", "Loader");
				delete WatchdogL["channelDelete"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} channelDelete 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function messageDelete(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].messageDelete != undefined) {
				WatchdogL["messageDelete"][list[index]] = new Date().getTime();
				await Function[list[index]].messageDelete(BMPR, ...args);
				await Console.main(`${list[index]} messageDelete`, 0, "Core", "Loader");
				delete WatchdogL["messageDelete"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageDelete 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function messageUpdate(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].messageUpdate != undefined) {
				WatchdogL["messageUpdate"][list[index]] = new Date().getTime();
				await Function[list[index]].messageUpdate(BMPR, ...args);
				await Console.main(`${list[index]} messageUpdate`, 0, "Core", "Loader");
				delete WatchdogL["messageUpdate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageUpdate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function guildCreate(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].guildCreate != undefined) {
				WatchdogL["guildCreate"][list[index]] = new Date().getTime();
				await Function[list[index]].guildCreate(BMPR, ...args);
				await Console.main(`${list[index]} guildCreate`, 0, "Core", "Loader");
				delete WatchdogL["guildCreate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} guildCreate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function guildDelete(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].guildDelete != undefined) {
				WatchdogL["guildDelete"][list[index]] = new Date().getTime();
				await Function[list[index]].guildDelete(BMPR, ...args);
				await Console.main(`${list[index]} guildDelete`, 0, "Core", "Loader");
				delete WatchdogL["guildDelete"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} guildDelete 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function guildMemberAdd(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].guildMemberAdd != undefined) {
				WatchdogL["guildMemberAdd"][list[index]] = new Date().getTime();
				await Function[list[index]].guildMemberAdd(BMPR, ...args);
				await Console.main(`${list[index]} guildMemberAdd`, 0, "Core", "Loader");
				delete WatchdogL["guildMemberAdd"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} guildMemberAdd 錯誤 >> ${error}`, 4, "Core", "Loader");
		}
}

async function guildMemberRemove(BMPR, ...args) {
	for (let index = 0; index < list.length; index++)
		try {
			if (Function[list[index]].guildMemberRemove != undefined) {
				WatchdogL["guildMemberRemove"][list[index]] = new Date().getTime();
				await Function[list[index]].guildMemberRemove(BMPR, ...args);
				await Console.main(`${list[index]} guildMemberRemove`, 0, "Core", "Loader");
				delete WatchdogL["guildMemberRemove"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} guildMemberRemove 錯誤 >> ${error}`, 4, "Core", "Loader");
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
	messageUpdate,
	guildCreate,
	guildDelete,
	guildMemberAdd,
	guildMemberRemove,
};