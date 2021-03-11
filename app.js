const find = require('./index');

const http = require('http');
const https = require('https');

const fs = require('fs');
let servers = JSON.parse(fs.readFileSync('webservers.json'));

find
	.findServer(servers)
	.then(data => console.log('data', data))
	.catch(err => console.log('err', err));
