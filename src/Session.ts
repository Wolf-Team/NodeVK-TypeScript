import http from "http";
import https from "https";
import {URL, URLSearchParams} from "url";
import Stream, { PassThrough, pipeline as pump } from 'stream';

import ConfigSession, { getDefaultConfig } from './ConfigSession.js';
import VKAPIException, { VKAPIError } from "./VKAPIException.js";

export interface IMethodParams {
    access_token?: string,
    version?: string,
    [key: string]: any
}

export interface VKAPIResponse {
    error?: VKAPIError,
    response: any
}

export default abstract class Session {
    private config: ConfigSession = getDefaultConfig();
    public constructor(config?: ConfigSession) {
        if (config)
            for (let key in config)
                this.config[key] = config[key];
    }

    protected async request(_url: string, data:NodeJS.Dict<string|readonly string[]>): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            
            let url:URL = new URL(_url);
            let protocol = /https/.test(url.protocol) ? https : http;
            url.search = new URLSearchParams(data).toString();
            console.log("send: " + url.href);

            
            if (this.config.debug)
                console.log("Send request:", url.href);
            
            let request = protocol.request(url, {}, (response) => {
                let buffers = [];
                response.on("data", (c) => {
                    buffers.push(c);
                });
                response.on('end', () => {
                    resolve(Buffer.concat(buffers));
                });
                response.on('error', reject);
            });
            request.end();
        });
    }

    public async invoke_method(method: string, params: IMethodParams): Promise<VKAPIResponse> {
        let url = `${this.config.url}${method}`;
        params.v=this.config.version;

        let result:VKAPIResponse = JSON.parse((await this.request(url, params)).toString());

        if (result.error)
            throw new VKAPIException(result.error);

        if (this.config.debug)
            console.log("Get answer:", result);

        return result;
    }
}