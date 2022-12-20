const Downloader = require("nodejs-file-downloader");
const child_process = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const zl = require("zip-lib");

let Main = null;
const config = {
	"language"     : "zh_tw",
	"check_update" : true,
	"log"          : {
		"save"  : true,
		"level" : {
			"track" : false,
			"debug" : false,
			"info"  : true,
			"warn"  : true,
			"error" : true,
		},
	},
	"discord": {
		"token"   : "",
		"intents" : [
			"Guilds",
			"GuildBans",
			"GuildEmojisAndStickers",
			"GuildIntegrations",
			"GuildWebhooks",
			"GuildInvites",
			"GuildVoiceStates",
			"GuildMessages",
			"GuildMessageReactions",
			"GuildMessageTyping",
			"DirectMessages",
			"DirectMessageReactions",
			"DirectMessageTyping",
			"GuildScheduledEvents",
		],
	},
	"version": 1,
};

if (!fs.existsSync(path.resolve("./plugins"))) fs.mkdirSync(path.resolve("./plugins"));
if (!fs.existsSync(path.resolve("./config"))) fs.mkdirSync(path.resolve("./config"));
if (!fs.existsSync(path.resolve("./logs"))) fs.mkdirSync(path.resolve("./logs"));
if (!fs.existsSync(path.resolve("./config.json"))) fs.writeFileSync(path.resolve("./config.json"), JSON.stringify(config, null, "\t"));
if (!fs.existsSync(path.resolve("./permission.json"))) fs.writeFileSync(path.resolve("./permission.json"), "[]");

if (!fs.existsSync(path.resolve("./src"))) {
	fs.mkdirSync(path.resolve("./src"));
	download_src();
}

main();

function main() {
	let WDT = Date.now();
	const clock = setInterval(() => {
		if (Date.now() - WDT > 2500)
			console.log("WDT error");
	}, 1000);
	Main = child_process.exec(`cd ${path.resolve("./src")} & node --no-warnings main.js`);
	Main.stdout.on("data", (data) => {
		if (data.startsWith("WDT"))
			WDT = Date.now();
		else
			console.log(data);
	});
	Main.stderr.on("data", (data) => {
		fs.writeFileSync(path.resolve("./Crash.log"), data.toString());
		process.exit(0);
	});
	Main.on("close", (err) => {
		clearInterval(clock);
		Main = null;
		main();
	});
}

process.stdin.on("readable", () => {
	if (Main == null) return;
	let chunk;
	while ((chunk = process.stdin.read()) !== null)
		Main.stdin.write(chunk);
});

async function download_src() {
	const downloader = new Downloader({
		url       : "https://github.com/ExpTechTW/BMPR/archive/refs/heads/master.zip",
		directory : "./",
	});
	await downloader.download();
	const unzip = new zl.Unzip();
	if (!fs.existsSync(path.resolve("./cache"))) fs.mkdirSync(path.resolve("./cache"));
	await unzip.extract(path.resolve("./BMPR-master.zip"), path.resolve("./cache"));
	fs.copySync(path.resolve("./cache/BMPR-master/src"), path.resolve("./src"));
	fs.removeSync(path.resolve("./cache"));
	fs.removeSync(path.resolve("./BMPR-master.zip"));
}