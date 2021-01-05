import fetch from "node-fetch";
import { Response } from "node-fetch";
import ConfigSession from './ConfigSession.js';
export interface IMethodParams {
    access_token?: string;
    version?: string;
    [key: string]: any;
}
export default abstract class Session {
    private config;
    constructor(config?: ConfigSession);
    protected request: typeof fetch;
    protected invoke_method(method: string, params: IMethodParams): Promise<Response>;
}
