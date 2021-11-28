const express = require("express");
const serverless = require("serverless-http");
const { httpRequest, getContentType, isImageContentType } = require("../lib/utils");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
	const { url, ...rest } = req.query;
	if (url) {
		httpRequest(url, {
			...rest,
			responseType: "arraybuffer",
		}).then(({ data, req_options, headers }) => {
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
			const ctype = getContentType(headers);
			const is_img_ctype = isImageContentType(ctype);
			const is_html_ctype = isHtmlContentType(ctype);
			if (is_img_ctype) {
				res.send(data.toString("base64"));
			} else if (is_html_ctype) {
				res.send(data.toString());
			} else {
				res.send(data);
			}
		});
		return;
	}
	res.set("Content-Type", "text/html");
	res.send("");
});

app.use(`/.netlify/functions/api`, router);

const handler = serverless(app);

module.exports.handler = async (event, context) => {
	const result = await handler(event, context);
	const is_img_ctype = isImageContentType(getContentType(result.headers));
	result.isBase64Encoded = is_img_ctype;
	return result;
};
