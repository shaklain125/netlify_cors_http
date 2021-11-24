const express = require("express");
const serverless = require("serverless-http");
const { httpRequest } = require("../lib/utils");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
	const { url, ...rest } = req.query;
	if (url) {
		httpRequest(url, rest).then(({ data, req_options, headers }) => {
			let cors_headers = {
				"Access-Control-Allow-Headers":
					"Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin",
				"Access-Control-Allow-Origin": "*",
				Vary: "Origin",
			};
			Object.entries(headers).forEach(([key, value]) => {
				if (key.match(/encoding/gi)) return;
				res.setHeader(key, value);
			});
			Object.entries(cors_headers).forEach(([key, value]) => {
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
