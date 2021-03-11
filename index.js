const http = require("http");
const https = require("https");

const checkConnection = (item) => {
	return new Promise((resolve, reject) => {
		let timer = setTimeout(() => {
			reject("timeout");
		}, 5000);

		const type = () => {
			if (item.url.includes("https")) return https;
			return http;
		};

		type()
			.get(item.url, (res) => {
				if (res.statusCode >= 200 && res.statusCode <= 299) {
					resolve({ ...item, status: res.statusCode });
					clearTimeout(timer);
				}
				reject("offline");
				clearTimeout(timer);
			})
			.on("error", (error) => {
				clearTimeout(timer);
				reject(error.message);
			});
	});
};

const filterAndSortResults = (results) => {
	let filtered = results.filter((res) => {
		if (res.value) return res;
	});

	return filtered.sort((a, b) => {
		return a.value.priority - b.value.priority;
	})[0];
};

const findServer = (servers) => {
	let promises = servers.map((server) => checkConnection(server));

	return Promise.allSettled(promises).then((results) => {
		return new Promise((resolve, reject) => {
			const finalValue = filterAndSortResults(results);
			// console.log("final", finalValue);
			if (finalValue) resolve(finalValue);
			reject(new Error("All servers are offline"));
		});
	});
};

module.exports = filterAndSortResults;
module.exports = findServer;
