/* eslint-disable no-empty */
let Structure = null;
let Handler = null;
let Time = null;
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

let BMPR = null;
let c = null;
let cache = -1;
let msgID = 0;
let body = "";
let Config = null;
let update = null;

/**
 *
 * @param {string} client
 * @param {object} config
 * @param {object} bmpr
 * @returns
 */
async function init(client, config, bmpr) {
	BMPR = bmpr;
	Structure = BMPR.Structure;
	Handler = BMPR.Handler;
	Time = BMPR.Time;
	Config = config;
	c = await client.channels.fetch(Config["Bot.Console"]).catch(err => {
		main(`日誌輸出到 Discord 時發生異常 >> ${err}`, 4, "Core", "Console");
	});
	return;
}

/**
 *
 * @param {string} msg
 * @param {number} level
 * @param {string} sender
 * @param {string} fun
 * @param {string} client
 * @returns
 */
async function main(msg, level, sender, fun, client) {
	try {
		if (client != undefined)
			c = await client.channels.fetch(Config["Bot.Console"]).catch(err => {
				main(`日誌輸出到 Discord 時發生異常 >> ${err}`, 4, "Core", "Console");
			});
		if (sender == undefined) sender = "N/A";
		if (fun == undefined) fun = "Main";
		if (level == undefined) level = 2;
		// Track 0
		// Debug 1
		// Info 2
		// Warn 3
		// Error 4
		let Type = "";
		if (level == 0) Type = "Track";
		if (level == 1) Type = "Debug";
		if (level == 2) Type = "Info";
		if (level == 3) Type = "Warn";
		if (level == 4) Type = "Error";
		if (level == 5) Type = "Console";
		const now = new Date();
		if (!fs.existsSync(path.resolve("./Database/log/")))
			fs.mkdirSync("./Database/log/");
		if (!fs.existsSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}`)))
			fs.mkdirSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}`));
		if (!fs.existsSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}`)))
			fs.mkdirSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}`));
		if (!fs.existsSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}`)))
			fs.mkdirSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}`));
		if (!fs.existsSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}/${now.getHours()}.log`)))
			fs.writeFileSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}/${now.getHours()}.log`), "", "utf8");
		let Log = fs.readFileSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}/${now.getHours()}.log`));
		Log = `[${sender}][${await Time.Simple()}][${fun}/${Type}]: ${msg}\n` + Log;
		fs.writeFileSync(path.resolve(`./Database/log/${(now.getMonth() + 1)}/${now.getDate()}/${now.getHours()}.log`), Log, "utf8");
		if (Config["Bot.Console.outLevel"] <= level && level != 5) {
			if (level == 1)
				console.log(`[${sender}][${await Time.Simple()}][${fun}]: ${msg}`);
			else if (level == 0)
				console.log("\x1b[90m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m");
			else if (level == 4)
				console.log("\x1b[31m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m");
			else if (level == 3)
				console.log("\x1b[33m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m");
			else
				console.log("\x1b[32m" + `[${sender}][${await Time.Simple()}][${fun}]: ${msg}` + "\x1b[0m");
			if (c == null) return;
			if (cache == level) {
				const MSG = await c.messages.fetch(msgID.id);
				body += `\n[${sender}][${await Time.Simple()}][${fun}]: ${msg}`;
				if (level == 1)
					await MSG.edit(await Structure.embed("**日誌**\n\n```" + body + "```", "#FFFFFF"));
				else if (level == 0)
					await MSG.edit(await Structure.embed("**追蹤**\n\n```" + body + "```", "#6C6C6C"));
				else if (level == 4)
					await MSG.edit(await Structure.embed("**錯誤**\n\n```" + body + "```", "#FF0000"));
				else if (level == 3)
					await MSG.edit(await Structure.embed("**警告**\n\n```" + body + "```", "#FF9224"));
				else
					await MSG.edit(await Structure.embed("**訊息**\n\n```" + body + "```", "#00EC00"));
				check();
			} else {
				cache = level;
				body = `[${sender}][${await Time.Simple()}][${fun}]: ${msg}`;
				if (level == 1)
					msgID = await c.send(await Structure.embed("**日誌**\n\n```" + body + "```", "#FFFFFF"));
				else if (level == 0)
					msgID = await c.send(await Structure.embed("**追蹤**\n\n```" + body + "```", "#6C6C6C"));
				else if (level == 4)
					msgID = await c.send(await Structure.embed("**錯誤**\n\n```" + body + "```", "#FF0000"));
				else if (level == 3)
					msgID = await c.send(await Structure.embed("**警告**\n\n```" + body + "```", "#FF9224"));
				else
					msgID = await c.send(await Structure.embed("**訊息**\n\n```" + body + "```", "#00EC00"));
			}
		}
	} catch (err) {
		main(`日誌輸出到 Discord 時發生異常 >> ${err}`, 4, "Core", "Console");
	}
}

process.stdin.on("data", async data => {
	data = `\n${data}`;
	data = data.replaceAll("\n", "");
	if (c == null) return;
	if (cache == 5) {
		const MSG = await c.messages.fetch(msgID.id);
		body += `\n[Console][${await Time.Simple()}][Main]: ${data}`;
		await MSG.edit(await Structure.embed("**控制臺**\n\n```" + body + "```", "#0080FF"));
		check();
	} else {
		body = `[Console][${await Time.Simple()}][Main]: ${data}`;
		msgID = await c.send(await Structure.embed("**控制臺**\n\n```" + body + "```", "#0080FF"));
		cache = 5;
	}
	main(data, 5, "Console", "Main");
	if (data.startsWith("bmpr")) Handler.main(data);
});

function check() {
	if (body.length > 400)
		cache = -1;
}

function clear() {
	cache = -1;
}

setInterval(async () => {
	try {
		const res = await fetch("https://api.github.com/repos/ExpTechTW/BMPR/releases");
		const data = await res.json();
		if (update == null)
			update = data[0]["tag_name"];
		else if (update != data[0]["tag_name"])
			main(`BMPR 新版本!\n\n${data[0]["tag_name"]}\n更新日誌\n${data[0]["body"]}`, 2, "Core", "Console");
	} catch (error) {
	}
}, 600000);

module.exports = {
	init,
	main,
	clear,
};