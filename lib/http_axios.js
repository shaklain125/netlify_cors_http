"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
class HTTP_METHODS {
	constructor() {
		this.raw = this.raw.bind(this);
		this.html = this.html.bind(this);
		this.json = this.json.bind(this);
	}
	get get() {
		return this.getReqFunctions();
	}
	get post() {
		return this.getReqFunctions("POST");
	}
	get head() {
		return this.getReqFunctions("HEAD");
	}
	getReqFunctions(method = "GET") {
		return {
			raw: options => this.raw(this.setReqMethod(options, method)),
			html: options => this.html(this.setReqMethod(options, method)),
			json: options => this.json(this.setReqMethod(options, method)),
		};
	}
	setReqMethod(options, method = "GET") {
		const params = this.parse_params(options);
		params.method = method;
		return params;
	}
	parse_params(options) {
		const params = typeof options == "string" ? { url: options } : options;
		if (!params.method) params.method = "GET";
		return params;
	}
	parseHtml(html) {
		return cheerio_1.default.load(html);
	}
	async html(options) {
		const params = this.parse_params(options);
		return new Promise(async resolve => {
			const _data = await (0, axios_1.default)(params).catch(err => {
				return null;
			});
			if (_data?.data) {
				const html = _data.data.toString();
				resolve({ res: this.parseHtml(html), html });
			} else {
				resolve(null);
			}
		});
	}
	async json(options) {
		const params = this.parse_params(options);
		return new Promise(async resolve => {
			const _data = await (0, axios_1.default)(params).catch(err => {
				return null;
			});
			if (_data?.data) {
				const data = _data.data;
				try {
					resolve({ res: JSON.parse(data) });
				} catch (error) {
					resolve({ res: data });
				}
			} else {
				resolve(null);
			}
		});
	}
	async raw(options) {
		const params = this.parse_params(options);
		return new Promise(async resolve => {
			const _data = await (0, axios_1.default)(params).catch(err => {
				return null;
			});
			resolve(_data);
		});
	}
}
const http = new HTTP_METHODS();
exports.http = http;
Object.freeze(http);
