const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

const config = {
	language     : "zh_tw",
	check_update : true,
	log          : {
		save  : true,
		level : {
			track : false,
			debug : false,
			info  : true,
			warn  : true,
			error : true,
		},
	},
	version: 1,
};

if (!fs.existsSync(path.resolve("./plugins")))
	fs.mkdirSync(path.resolve("./plugins"));
if (!fs.existsSync(path.resolve("./config")))
	fs.mkdirSync(path.resolve("./config"));
if (!fs.existsSync(path.resolve("./logs")))
	fs.mkdirSync(path.resolve("./logs"));
if (!fs.existsSync(path.resolve("./config.json")))
	fs.writeFileSync(path.resolve("./config.json"), JSON.stringify(config, null, "\t"));
if (!fs.existsSync(path.resolve("./permission.json")))
	fs.writeFileSync(path.resolve("./permission.json"), "[]");

if (!fs.existsSync(path.resolve("./src")))
	fs.mkdirSync(path.resolve("./src"));
