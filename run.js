/* eslint-disable require-sort/require-sort */
/* eslint-disable no-shadow */
const reload = require("require-reload")(require);
const fs = require("fs");
const path = require("path");
const Downloader = require("nodejs-file-downloader");
const zl = require("zip-lib");
const fetch = require("node-fetch");

const bmpr = reload("./BMPR");

const list = fs.readdirSync(path.resolve("./Database/cache/"));
if (list.includes("Reload.tmp")) {
	fs.unlinkSync(path.resolve("./Database/cache/Reload.tmp"));
	Main("Reload from Clock");
} else
	Main();


Update();

function Main(args) {
	bmpr.main(bmpr, args);
}

function Update() {
	setInterval(async () => {
		const list = fs.readdirSync(path.resolve("./Database/cache"));
		if (list.includes("update.tmp")) {
			if (fs.existsSync(path.resolve("./BMPR-Release.zip"))) fs.unlinkSync(path.resolve("./BMPR-Release.zip"));
			const res = await fetch("https://raw.githubusercontent.com/ExpTechTW/BMPR/Release/BMPR.js");
			const text = await res.text();
			fs.writeFileSync(path.resolve("./BMPR.js"), text);
			try {
				const downloader = new Downloader({
					url       : "https://github.com/ExpTechTW/BMPR/archive/refs/heads/Release.zip",
					directory : "./",
				});
				await downloader.download();
				const unzip = new zl.Unzip();
				await unzip.extract(path.resolve("./BMPR-Release.zip"), path.resolve(""));
			} catch (error) {
				fs.unlinkSync(path.resolve("./BMPR-Release.zip"));
				console.log("Download failed", error);
			}
			fs.unlinkSync(path.resolve("./BMPR-Release.zip"));
			fs.writeFileSync(path.resolve("./Database/cache/reload.tmp"), "");
			process.exit(0);
		}
	}, 1000);
}