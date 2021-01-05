import fetch from "node-fetch";
import { Response } from "node-fetch";

import ConfigSession, { getDefaultConfig } from './ConfigSession.js';

export interface IMethodParams {
    access_token?: string,
    version?: string,
    [key: string]: any
}

export default abstract class Session {
    private config: ConfigSession = getDefaultConfig();
    public constructor(config?: ConfigSession) {
        if (config)
            for (let key in config)
                this.config[key] = config[key];
    }

    protected request = fetch;

    protected async invoke_method(method: string, params: IMethodParams): Promise<Response> {
        let query = `${this.config.url}${method}v=${this.config.version}`;

        for (let key in params)
            query += `&${key}=${params[key]}`;

        if (this.config.debug)
            console.log("Send request:", query);

        let result = await fetch(this.config.url + method + "?" + query).then(res => res.json());

        if (this.config.debug)
            console.log("Get answer:", result);

        return result;
    }
}