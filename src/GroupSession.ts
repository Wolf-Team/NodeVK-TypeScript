import ConfigSession from './ConfigSession.js';
import Session, { IMethodParams, VKAPIResponse } from "./Session.js"

export default class GroupSession extends Session {
    protected token: string;
    public constructor(token: string, config?: ConfigSession) {
        super(config);
        this.token = token;
    }

    public async invoke_method(method: string, params: IMethodParams): Promise<VKAPIResponse> {
        params.access_token = this.token;
        return super.invoke_method(method, params);
    }
}