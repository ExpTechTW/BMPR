const reload = require("require-reload")(require);
let Console = null;
let Rely = null;
const fs = require("fs");
const path = require("path");
const zl = require("zip-lib");
const User = reload("./api/user");

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
			await Console.main(`${list[index]} 插件 已卸載`, 3, "Core", "Loader");
			list = list.splice(index, 1);
			return;
		}

	await Console.main(`未發現 ${Plugin} 插件`, 3, "Core", "Loader");
	return;
}

async function PluginLoad(Plugin) {
	const LIST = fs.readdirSync(path.resolve("./Plugin/lock"));
	for (let index = 0; index < LIST.length; index++)
		if (Plugin.includes(LIST[index])) {
			await PluginLoading(LIST[index]);
			if (Function[LIST[index]].Info.events.includes("init")) Function[LIST[index]].init(BMPR);
			if (Function[LIST[index]].Info.events.includes("ready")) Function[LIST[index]].ready(Client);
			await Console.main(`${LIST[index]} 插件 已加載`, 3, "Core", "Loader");
			if (!list.includes(LIST[index])) list.push(LIST[index]);
			return;
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
					now(Plugin);
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
	for (let index = 0; index < List.length; index++)
		try {
			if (List[index] != "lock" && (List[index].includes(".js") || List[index].includes(".zip") || List[index].includes(".bmpr")))
				if (List[index].includes(".zip") || List[index].includes(".bmpr")) {
					fs.copyFileSync(path.resolve("./Plugin/" + List[index]), path.resolve("./Plugin/lock/" + List[index]));
					const unzip = new zl.Unzip();
					await unzip.extract(path.resolve("./Plugin/lock/" + List[index]), path.resolve("./Plugin/lock/"));
					fs.unlinkSync(path.resolve("./Plugin/lock/" + List[index]));
					await Console.main(`${List[index]} 緩存 Package 插件`, 1, "Core", "Loader");
				} else {
					fs.copyFileSync(path.resolve("./Plugin/" + List[index]), path.resolve("./Plugin/lock/" + List[index]));
					await Console.main(`${List[index]} 緩存 Single 插件`, 1, "Core", "Loader");
				}

		} catch (error) {
			await Console.main(`${List[index]} 緩存 >> ${error}`, 4, "Core", "Loader");
		}

	await Load();
	await RelyCheck();
	await BMPR.Help.init(Function, list, BMPR.Config);
	await Init();
}

async function Init() {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("init")) {
				now(list[index]);
				WatchdogL["init"][list[index]] = new Date().getTime();
				await Function[list[index]].init(BMPR);
				await Console.main(`${list[index]} init`, 1, "Core", "Loader");
				delete WatchdogL["init"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} init 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function Load(args) {
	list = fs.readdirSync(path.resolve("./Plugin/lock"));
	if (fs.existsSync(path.resolve("./Database/cache/crash.tmp"))) {
		fs.unlinkSync(path.resolve("./Database/cache/crash.tmp"));
		if (fs.existsSync(path.resolve("./Database/cache/plugin.tmp"))) {
			const plugin = fs.readFileSync(path.resolve("./Database/cache/plugin.tmp"));
			for (let index = 0; index < list.length; index++)
				if (plugin.includes(list[index])) list.splice(index, 1);
			await Console.main(`${plugin} 插件 崩潰 已暫時卸載\n使用 bmpr plugin load ${plugin} 重新加載`, 4, "Core", "Loader");
		}
	}
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
		now(plugin);
		if (!plugin.includes(".js")) {
			Function[plugin] = await reload(path.resolve(`./Plugin/lock/${plugin}/index.js`));
			const Info = JSON.parse(fs.readFileSync(path.resolve("./Plugin/lock/" + plugin + "/BMPR.json")).toString());
			Function[plugin].Info = Info;
			if (fs.existsSync(path.resolve(`./Plugin/lock/${plugin}/config.json`)))
				if (!fs.existsSync(path.resolve(`./Database/config/${plugin}.json`)))
					fs.copyFileSync(path.resolve(`./Plugin/lock/${plugin}/config.json`), path.resolve(`./Database/config/${plugin}.json`));
				else
					Config[plugin] = JSON.parse(fs.readFileSync(path.resolve(`./Database/config/${plugin}.json`)).toString());


			await Console.main(`${plugin} 已加載 Package 插件 | 版本: ${Info.version}`, 1, "Core", "Loader");
		} else {
			Function[plugin] = reload(`../../Plugin/lock/${plugin}`);
			if (Function[plugin].config != undefined)
				if (!fs.existsSync(path.resolve(`./Database/config/${plugin.replace(".js", "")}.json`)))
					fs.writeFileSync(path.resolve(`./Database/config/${plugin.replace(".js", "")}.json`), JSON.stringify(Function[plugin].config));
				else
					Config[plugin] = JSON.parse(fs.readFileSync(path.resolve(`./Database/config/${plugin.replace(".js", "")}.json`)).toString());

			await Console.main(`${plugin} 已加載 Single 插件 | 版本: ${Function[plugin].Info.version}`, 1, "Core", "Loader");
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
			const Info = Function[list[index]].Info;
			if (Info.events.includes("ready")) {
				now(list[index]);
				WatchdogL["ready"][list[index]] = new Date().getTime();
				await Function[list[index]].ready(client);
				await Console.main(`${list[index]} ready`, 1, "Core", "Loader");
				delete WatchdogL["ready"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} ready 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function messageCreate(message) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("messageCreate")) {
				now(list[index]);
				WatchdogL["messageCreate"][list[index]] = new Date().getTime();
				await Function[list[index]].messageCreate(message);
				await Console.main(`${list[index]} messageCreate`, 0, "Core", "Loader");
				delete WatchdogL["messageCreate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageCreate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function messageReactionAdd(reaction, user) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("messageReactionAdd")) {
				now(list[index]);
				WatchdogL["messageReactionAdd"][list[index]] = new Date().getTime();
				await Function[list[index]].messageReactionAdd(reaction, user);
				await Console.main(`${list[index]} messageReactionAdd`, 0, "Core", "Loader");
				delete WatchdogL["messageReactionAdd"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageReactionAdd 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function messageReactionRemove(reaction, user) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("messageReactionRemove")) {
				now(list[index]);
				WatchdogL["messageReactionRemove"][list[index]] = new Date().getTime();
				await Function[list[index]].messageReactionRemove(reaction, user);
				await Console.main(`${list[index]} messageReactionRemove`, 0, "Core", "Loader");
				delete WatchdogL["messageReactionRemove"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageReactionRemove 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function channelCreate(channel) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("channelCreate")) {
				now(list[index]);
				WatchdogL["channelCreate"][list[index]] = new Date().getTime();
				await Function[list[index]].channelCreate(channel);
				await Console.main(`${list[index]} channelCreate`, 0, "Core", "Loader");
				delete WatchdogL["channelCreate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} channelCreate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function channelDelete(channel) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("channelDelete")) {
				now(list[index]);
				WatchdogL["channelDelete"][list[index]] = new Date().getTime();
				await Function[list[index]].channelDelete(channel);
				await Console.main(`${list[index]} channelDelete`, 0, "Core", "Loader");
				delete WatchdogL["channelDelete"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} channelDelete 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function messageDelete(message) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("messageDelete")) {
				now(list[index]);
				WatchdogL["messageDelete"][list[index]] = new Date().getTime();
				await Function[list[index]].messageDelete(message);
				await Console.main(`${list[index]} messageDelete`, 0, "Core", "Loader");
				delete WatchdogL["messageDelete"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageDelete 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function messageUpdate(message) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("messageUpdate")) {
				now(list[index]);
				WatchdogL["messageUpdate"][list[index]] = new Date().getTime();
				await Function[list[index]].messageUpdate(message);
				await Console.main(`${list[index]} messageUpdate`, 0, "Core", "Loader");
				delete WatchdogL["messageUpdate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} messageUpdate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function guildCreate(message) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("guildCreate")) {
				now(list[index]);
				WatchdogL["guildCreate"][list[index]] = new Date().getTime();
				await Function[list[index]].guildCreate(message);
				await Console.main(`${list[index]} guildCreate`, 0, "Core", "Loader");
				delete WatchdogL["guildCreate"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} guildCreate 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

async function guildDelete(message) {
	for (let index = 0; index < list.length; index++)
		try {
			const Info = Function[list[index]].Info;
			if (Info.events.includes("guildDelete")) {
				now(list[index]);
				WatchdogL["guildDelete"][list[index]] = new Date().getTime();
				await Function[list[index]].guildDelete(message);
				await Console.main(`${list[index]} guildDelete`, 0, "Core", "Loader");
				delete WatchdogL["guildDelete"][list[index]];
			}
		} catch (error) {
			await Console.main(`${list[index]} guildDelete 錯誤 >> ${error}`, 4, "Core", "Loader");
		}

}

function now(plugin) {
	fs.writeFileSync(path.resolve("./Database/cache/plugin.tmp"), plugin);
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
};