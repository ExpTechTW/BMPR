const { Client, Partials } = require("discord.js");

const reload = require("require-reload")(require);
const loader = reload("../core/loader");

const Info = {};

function init(Global) {
	const discord_client = new Client({
		partials : [Partials.Message, Partials.Channel, Partials.Reaction],
		intents  : Global.BMPR.config.discord.intents,
	});
	discord_client.login(Global.BMPR.config.discord.token);
	event(Global, discord_client);
}

function event(Global, discord_client) {
	discord_client.on("ready", async (...args) => {
		await loader.init(Global, Info);
		for (let index = 0; index < Object.keys(Info).length; index++) {
			const name = Object.keys(Info)[index];
			if (Info[name].plugin?.ready != undefined) await Info[name].plugin.ready(...args);
		}
	});
	discord_client.on("messageCreate", async (...args) => {
		for (let index = 0; index < Object.keys(Info).length; index++) {
			const name = Object.keys(Info)[index];
			if (Info[name].plugin?.messageCreate != undefined) await Info[name].plugin.messageCreate(...args);
		}
	});
}

module.exports = {
	init,
};