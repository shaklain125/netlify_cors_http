const express = require("express");
const serverless = require("serverless-http");
const {
	httpRequest,
	getContentType,
	isImageContentType,
	is_unknown_file,
} = require("../lib/utils");

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
			const is_unknown = is_unknown_file(data);
			if (is_img_ctype) {
				res.send(data.toString("base64"));
			} else if (is_unknown) {
				res.send(data);
			} else {
				res.send(data.toString());
			}
		});
		return;
	}
	res.set("Content-Type", "text/html");
	res.send("");
});

router.get("/text", (req, res) => {
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
			Object.entries(cors_headers).forEach(([key, value]) => {
				res.setHeader(key, value);
			});
			res.setHeader("req_params", JSON.stringify(req_options));
			const ctype = getContentType(headers);
			const is_img_ctype = isImageContentType(ctype);
			const is_unknown = is_unknown_file(data);
			res.send({ url, ...rest, is_unknown });
			return;
			// Object.entries(headers).forEach(([key, value]) => {
			// 	if (key.match(/encoding/gi)) return;
			// 	res.setHeader(key, value);
			// });
			// if (is_img_ctype) {
			// 	res.send(data.toString("base64"));
			// } else if (is_unknown) {
			// 	res.send(data);
			// } else {
			// 	res.send(data.toString());
			// }
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
