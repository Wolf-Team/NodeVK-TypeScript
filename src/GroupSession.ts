import ConfigSession from './ConfigSession.js';
import Session, {IMethodParams} from "./Session.js"

export default class GroupSession extends Session {
    protected token: string;
    public constructor(token: string, config?: ConfigSession) {
        super(config);
        this.token = token;
    }

    public invoke_method(method: string, params: IMethodParams) {
        
        params.access_token = this.token;

        return super.invoke_method(method, params);
    }
}