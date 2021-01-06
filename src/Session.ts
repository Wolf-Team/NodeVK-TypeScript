import ConfigSession, { getDefaultConfig } from './ConfigSession.js';
import VKAPIException, { VKAPIError } from "./VKAPIException.js";
import request from "./request.js";

export interface IMethodParams {
    access_token?: string,
    version?: string,
    [key: string]: any
}

export interface VKAPIResponse<T = any>{
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
        return JSON.parse((await request(url, params)).toString())
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