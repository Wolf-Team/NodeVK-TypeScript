import { request as requestHttp } from "http";
import { request as requestHttps } from "https";
import { URL } from "url";

function getRequestMethod(protocol: string) {
	switch (protocol) {
		case "http:": return requestHttp;
		case "https:": return requestHttps;
		default: throw new RangeError(`Unknown protocol ${protocol}`);
	}
}

type RequestURL = string | URL;
type tRequestData = number | string | boolean;
interface RequestData {
	[key: string]: tRequestData | Array<tRequestData>;
}
interface RequestParams {
	url: RequestURL;
	data?: RequestData
}

function request(url: RequestURL, params?: Partial<RequestParams>): Promise<string | Buffer>;
function request(params: RequestParams): Promise<string | Buffer>;
function request(params: RequestURL | RequestParams, additiveParams: Partial<RequestParams> = {}): Promise<string | Buffer> {
	//if first argument is URL
	if (typeof params == "string" || params instanceof URL)
		return request({ url: params, ...additiveParams });

	if (typeof params.url == "string")
		params.url = new URL(params.url);

	const createRequest = getRequestMethod(params.url.protocol);
	if (params.data) {
		for (const key in params.data) {
			const value = params.data[key];

			params.url.searchParams.append(key, Array.isArray(value) ?
				value.map(e => encodeURIComponent(e)).join(",") :
				encodeURIComponent(value)
			)
		}
	}

	return new Promise((r, c) => {
		const req = createRequest(params.url);
		req.on("response", res => {
			const [type, ...rawParams] = res.headers["content-type"].split(/\;\s*/);
			const params: { [key: string]: any } = rawParams.reduce((r, e) => {
				const [key, value] = e.split("=");
				r[key] = value;
				return r;
			}, {});

			if (params.charset && Buffer.isEncoding(params.charset))
				res.setEncoding(params.charset);

			let body: Buffer | string;
			res.on("data", chunk => {
				if (!body)
					return body = chunk;

				if (Buffer.isBuffer(chunk) && Buffer.isBuffer(body)) {
					body = Buffer.concat([body, chunk]);
				} else {
					body += chunk;
				}
			});
			res.on("end", () => {
				if (res.statusCode > 299) { //@ts-ignore
					res.body = body;
					return c(res);
				}

				r(body);
			})
		});
		req.end();
	});
}

export default request;
export { RequestURL, tRequestData, RequestData, RequestParams }
