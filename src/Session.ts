import ConfigSession, { getDefaultConfig } from './ConfigSession.js';
import VKAPIException, { VKAPIError } from "./VKAPIException.js";
import request, { RequestData } from "./request.js";
import { type } from 'os';

export interface IMethodParams {
    access_token?: string,
    version?: string,
    [key: string]: string | number | boolean | Array<string | number> | object
}

export interface VKAPIResponse<T = any> {
    error?: VKAPIError,
    response: T
}

export default abstract class Session {
    private config: ConfigSession = getDefaultConfig();
    public constructor(config?: ConfigSession) {
        if (config)
            for (let key in config)
                this.config[key] = config[key];
    }

    protected async request(url: string, params: IMethodParams): Promise<any> {
        const data: RequestData = {};

        for (const field in params) {
            const value = params[field];

            if (Array.isArray(value)) {
                data[field] = value.join(",");
            } else if (typeof value == "object") {
                data[field] = JSON.stringify(value);
            } else if (typeof value !== "string") {
                data[field] = value.toString();
            } else {
                data[field] = value;
            }
        }

        return JSON.parse((await request({
            url: url,
            data: data,
            encoding:"utf-8"
        })));
    }

    public async invokeMethod<T = any>(method: string, params: IMethodParams): Promise<VKAPIResponse<T>> {
        let url = `${this.config.url}${method}`;
        params.v = this.config.version;

        let result: VKAPIResponse<T> = await this.request(url, params);

        if (result.error)
            throw new VKAPIException(result.error);

        if (this.config.debug)
            console.log("Get answer:", result);

        return result;
    }
}