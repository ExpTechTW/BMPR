const fs = require("fs-extra");
const path = require("path");

const reload = require("require-reload")(require);
const client = reload("./discord/client");

const Global = {
	clock : {},
	BMPR  : {
		info   : {},
		config : {},
	},
};

fs.readFile(path.resolve("../config.json"), (err, config) => {
	Global.BMPR.config = JSON.parse(config.toString());
	fs.readFile(path.resolve("./info.json"), (err, info) => {
		Global.BMPR.info = JSON.parse(info.toString());
		client.init(Global);
	});
});

setInterval(() => {console.log("WDT");}, 1000);