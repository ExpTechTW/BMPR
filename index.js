/* eslint-disable require-sort/require-sort */
const child_process = require("child_process");
const path = require("path");
const fs = require("fs");

let Main = null;

if (!fs.existsSync(path.resolve("./Database/cache")))
	fs.mkdirSync("./Database/cache");

if (!fs.existsSync(path.resolve("./Database/data")))
	fs.mkdirSync("./Database/data");

if (!fs.existsSync(path.resolve("./Plugin")))
	fs.mkdirSync("./Plugin");

if (!fs.existsSync(path.resolve("./Plugin/lock")))
	fs.mkdirSync("./Plugin/lock");

if (fs.existsSync(path.resolve("./Database/cache/crash.tmp"))) fs.unlinkSync(path.resolve("./Database/cache/crash.tmp"));
main();

function main() {
	Main = child_process.exec(`cd ${path.resolve("")} & node --no-warnings run.js`);
	Main.stdout.on("data", (data) => {
		console.log(data.replaceAll("\n", ""));
	});
	Main.stdout.on("error", (data) => {
		console.log("\x1b[31m" + `[Thread][${Simple()}][Main]: ${data.replaceAll("\n", "")}` + "\x1b[0m");
	});
	Main.stderr.on("data", (data) => {
		if (!data.includes("^C") && !data.includes("Error")) fs.writeFileSync(path.resolve("./Database/cache/crash.tmp"), "");
		fs.writeFileSync(path.resolve("./Database/cache/Crash.log"), data);
		if (data.includes("node:") && !data.includes("Error"))
			console.log("\x1b[33m" + `[Thread][${Simple()}][Main]: ${data}` + "\x1b[0m");
		else
			console.log("\x1b[31m" + `[Thread][${Simple()}][Main]: ${data}` + "\x1b[0m");
	});
	Main.on("close", (err) => {
		const list = fs.readdirSync(path.resolve("./Database/cache"));
		if (list.includes("reload.tmp")) {
			fs.unlinkSync(path.resolve("./Database/cache/reload.tmp"));
			fs.writeFileSync(path.resolve("./Database/cache/Reload.tmp"), "");
			main();
		} else
			process.exit(0);

	});
	process.stdin.on("readable", () => {
		let chunk;
		while ((chunk = process.stdin.read()) !== null)
			Main.stdin.write(chunk);

	});
	const info = {
		PID      : process.pid,
		pid      : Main.pid,
		platform : process.platform,
	};
	fs.writeFileSync(path.resolve("./Database/cache/info.tmp"), JSON.stringify(info));
}

function Simple() {
	const utc = new Date();
	const now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000);
	return now.getHours() +
        ":" + now.getMinutes() +
        ":" + now.getSeconds();
}