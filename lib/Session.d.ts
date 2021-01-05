/// <reference types="node" />
import ConfigSession from './ConfigSession.js';
import { VKAPIError } from "./VKAPIException.js";
export interface IMethodParams {
    access_token?: string;
    version?: string;
    [key: string]: any;
}
export interface VKAPIResponse {
    error?: VKAPIError;
    response: any;
}
export default abstract class Session {
    private config;
    constructor(config?: ConfigSession);
    protected request(_url: string, data: NodeJS.Dict<string | readonly string[]>): Promise<Buffer>;
    invoke_method(method: string, params: IMethodParams): Promise<VKAPIResponse>;
}
