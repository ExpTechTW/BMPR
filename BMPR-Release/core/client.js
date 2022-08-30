/* eslint-disable require-sort/require-sort */
/* eslint-disable no-shadow */
/* eslint-disable no-empty-function */
let Console = null;
let Loader = null;
let Handler = null;
let User = null;
let Permission = null;
let Rely = null;
const { Client } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const client = new Client({
	intents: [
		"Guilds",
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
		"GuildScheduledEvents",
	],
});

let Info = null;
let Config = null;
let BMPR = null;
let Check = false;

setInterval(() => console.log("WTD"), 1000);

async function main(bmpr, info) {
	BMPR = bmpr;
	Config = await bmpr.Config.main();
	BMPR.Config = Config;
	BMPR.Prefix = Config.Prefix;
	Console = bmpr.Console;
	Loader = bmpr.Loader;
	Handler = bmpr.Handler;
	Rely = bmpr.Rely;
	User = bmpr.User;
	Permission = bmpr.Permission;
	Info = info;
	client.login(Config["Bot.Token"]);
}

client.on("ready", async (client) => {
	BMPR.Client = client;
	await Console.init(client, Config, BMPR);
	const list = fs.readdirSync(path.resolve("./Database/cache/"));
	if (list.includes("update.tmp")) {
		fs.unlinkSync(path.resolve("./Database/cache/update.tmp"));
		await Console.main("更新完成", 2, "Core", "Update");
	}
	if (Info.reload != undefined)
		await Console.main(Info.reload, 3, "Main", "Main");
	delete Info.reload;
	await Rely.init(BMPR);
	await Loader.init(BMPR);
	await Permission.init(BMPR);
	await Handler.init(BMPR);
	await Loader.ready(client);
	client.user.setActivity(`${Config["Prefix"]}help | Powered by ExpTech`);
	const res = await fetch("https://api.github.com/repos/ExpTechTW/BMPR/releases");
	const data = await res.json();
	let num = -1;
	let last = "";
	for (let index = 0; index < data.length; index++)
		if (data[index]["tag_name"] == Info.version) {
			num = index;
			break;
		} else
		if (Config["Pre-Release"]) {
			if (data[index]["tag_name"] != Info.version && last == "")
				last = data[index]["tag_name"];
		} else
		if (data[index]["prerelease"] == false && data[index]["tag_name"] != Info.version && last == "")
			last = data[index]["tag_name"];
	await Console.main(`BMPR 版本: ${Info.version} | 目前登入身份: ${client.user.tag} | 群組數量: ${client.guilds.cache.size}`, 2, "Core", "Client");
	const info = JSON.parse(fs.readFileSync(path.resolve("./Database/cache/info.tmp")).toString());
	await Console.main(`主線程 PID: ${info.PID} | 副線程 PID: ${info.pid}`, 2, "Core", "Client");
	if (num == 0)
		await Console.main("已是最新版本", 2, "Core", "Client");
	else if (num > 0)
		await Console.main(`最新版本: ${last} 落後 最新版本 ${num} 個版本 使用 bmpr upgrade 更新`, 3, "Core", "Client");
	Check = true;
});

client.on("messageCreate", async (...args) => {
	if (!Check) return;
	if (args[0].channel.id == Config["Bot.Console"]) {
		if (args[0].author.id != client.user.id) await Console.clear();
		if (args[0].content.startsWith("bmpr")) Handler.main(args[0].content);
	}
	await Loader.messageCreate(BMPR, ...args);
	await User.main(args[0].author);
	await Permission.main(args[0].author);
	if (args[0].content == `${Config["Prefix"]}help`) args[0].reply(">>> " + await BMPR.Help.main());
	if (args[0].content.startsWith(`${Config["Prefix"]}help `)) args[0].reply(">>> " + await BMPR.Help.main(args[0].content.replace(`${Config["Prefix"]}help `, "")));
});

client.on("messageReactionAdd", async (...args) => {
	if (!Check) return;
	await Loader.messageReactionAdd(BMPR, ...args);
});

client.on("messageReactionRemove", async (...args) => {
	if (!Check) return;
	await Loader.messageReactionRemove(BMPR, ...args);
});

client.on("channelCreate", async (...args) => {
	if (!Check) return;
	await Loader.channelCreate(BMPR, ...args);
});

client.on("channelDelete", async (...args) => {
	if (!Check) return;
	await Loader.channelDelete(BMPR, ...args);
});

client.on("messageDelete", async (...args) => {
	if (!Check) return;
	await Loader.messageDelete(BMPR, ...args);
});

client.on("messageUpdate", async (...args) => {
	if (!Check) return;
	await Loader.messageUpdate(BMPR, ...args);
});

client.on("guildCreate", async (...args) => {
	if (!Check) return;
	await Loader.guildCreate(BMPR, ...args);
});

client.on("guildDelete", async (...args) => {
	if (!Check) return;
	await Loader.guildDelete(BMPR, ...args);
});

client.on("guildMemberAdd", async (...args) => {
	if (!Check) return;
	await Loader.guildMemberAdd(BMPR, ...args);
});

client.on("guildMemberRemove", async (...args) => {
	if (!Check) return;
	await Loader.guildMemberRemove(BMPR, ...args);
});

module.exports = {
	main,
};