const express = require("express");
const serverless = require("serverless-http");
const { httpRequest } = require("./utils");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
	const { url, ...rest } = req.query;
	return res.send({ url, rest });
	if (url) {
		httpRequest(url, rest).then(({ data, req_options, headers }) => {
			Object.entries(headers).forEach(([key, value]) => {
				if (key.match(/encoding/gi)) return;
				res.setHeader(key, value);
			});
			res.setHeader("req_params", JSON.stringify(req_options));
			res.send(data);
		});
		return;
	}
	res.set("Content-Type", "text/html");
	res.send("");
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
