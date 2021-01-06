import ConfigSession from './ConfigSession.js';
import { VKAPIError } from "./VKAPIException.js";
export interface IMethodParams {
    access_token?: string;
    version?: string;
    [key: string]: any;
}
export interface VKAPIResponse<T = any> {
    error?: VKAPIError;
    response: T;
}
export default abstract class Session {
    private config;
    constructor(config?: ConfigSession);
    protected request(url: string, params: IMethodParams): Promise<any>;
    invokeMethod<T = any>(method: string, params: IMethodParams): Promise<VKAPIResponse<T>>;
}
