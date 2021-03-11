const findServer = require("./index");

const fs = require("fs");
let servers = JSON.parse(fs.readFileSync("webservers.json"));

findServer(servers)
	.then((data) => console.log("data", data))
	.catch((err) => console.log("err", err));
