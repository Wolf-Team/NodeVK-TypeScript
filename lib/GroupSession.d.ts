import ConfigSession from './ConfigSession.js';
import Session, { IMethodParams, VKAPIResponse } from "./Session.js";
export default class GroupSession extends Session {
    protected token: string;
    constructor(token: string, config?: ConfigSession);
    invoke_method(method: string, params: IMethodParams): Promise<VKAPIResponse>;
}
