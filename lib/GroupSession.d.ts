import ConfigSession from './ConfigSession.js';
import Session, { IMethodParams } from "./Session.js";
export default class GroupSession extends Session {
    protected token: string;
    constructor(token: string, config?: ConfigSession);
    invoke_method(method: string, params: IMethodParams): Promise<import("node-fetch").Response>;
}
