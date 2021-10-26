import request, { RequestData, tRequestData } from "../utils/request.js";

interface APIInfo {
	token: string;
	version?: string;
}
interface IMethodParams extends RequestData {
	access_token?: string;
	v?: string;
}
interface VKResponseError {
	error_code: number;
	error_msg: string;
	request_params: { key: string, value: string }[];
}

class VKError extends Error {
	constructor(private readonly error: VKResponseError) {
		super(error.error_msg);
	}

	public get request_params() {
		return [...this.error.request_params];
	}
	public get code() {
		return this.error.error_code;
	}

}

abstract class API {
	private static url: string = "https://api.vk.com/method/";

	constructor(info: APIInfo) {
		this._info = {
			version: "5.126",
			...info
		};
	}

	protected abstract name: string;
	private _info: APIInfo;

	public async invokeMethod<T = 1>(method: string, params: IMethodParams = {}): Promise<T> {
		params = {
			access_token: this._info.token,
			v: this._info.version,
			...params
		};

		const rawResponse = <string>await request({
			url: `${API.url}${this.name}.${method}`,
			data: params
		});
		try {
			const response: {
				response: T,
				error?: VKResponseError
			} = JSON.parse(rawResponse);
			if (response.error)
				throw new VKError(response.error);

			return response.response;
		} catch (e) {
			console.log(rawResponse)
			throw e;
		}


	}
}

export default API;
export { APIInfo, IMethodParams, VKResponseError, VKError };
