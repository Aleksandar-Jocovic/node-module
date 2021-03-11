const filterAndSortResults = require("./index");

const mockResults = [
	{
		status: "fulifilled",
		value: { url: "https://website.com", priority: 2, status: 200 },
	},
	{
		status: "fulifilled",
		value: { url: "https://website1.com", priority: 1, status: 200 },
	},
	{
		status: "rejected",
		reason: "error",
	},
];

it("basic test", () => {
	expect("hello").toBe("hello");
});

it("returns online server vith lowest priority", () => {
	expect(filterAndSortResults(mockResults)).toBe(mockResults[1]);
});
