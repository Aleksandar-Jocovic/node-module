const http = require('http');
const https = require('https');

const fs = require('fs');
let servers = JSON.parse(fs.readFileSync('webservers.json'));

const checkConnection = item => {
	return new Promise((resolve, reject) => {
		let timer = setTimeout(() => {
			reject('timeout');
		}, 15000);

		const type = () => {
			if (item.url.includes('https')) return https;
			return http;
		};

		type()
			.get(item.url, res => {
				if (res.statusCode >= 200 && res.statusCode <= 299) {
					resolve({ ...item, status: res.statusCode });
					clearTimeout(timer);
				}
				reject('offline');
				clearTimeout(timer);
			})
			.on('error', error => {
				clearTimeout(timer);
				reject(error.message);
			});
	});
};

const filterAndSortResults = results => {
	let filtered = results.filter(res => {
		if (res.value) return res;
	});

	return filtered.sort((a, b) => {
		return a.value.priority - b.value.priority;
	})[0];
};

let promises = servers.map(server => checkConnection(server));

Promise.allSettled(promises).then(results => {
	new Promise((resolve, reject) => {
		const finalValue = filterAndSortResults(results);
		if (finalValue) resolve(finalValue);
		reject(new Error('All servers are offline'));
	});
});
