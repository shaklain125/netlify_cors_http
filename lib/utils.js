// const { http } = require("./http_axios");

const parseJSON = data => {
	try {
		return JSON.parse(data);
	} catch (error) {
		return undefined;
	}
};

const httpRequest = async (url, rest) => {
	// const options = {
	// 	url: decodeURIComponent(url),
	// 	method: rest.method || undefined,
	// 	data: parseJSON(decodeURIComponent(rest.data || "")) || rest.data || undefined,
	// 	headers: parseJSON(decodeURIComponent(rest.headers || "")),
	// };
	// const data = await http.raw(options);
	// return { data: data?.data || "", req_options: options, headers: data?.headers || {} };
};

module.exports = { httpRequest, parseJSON };
