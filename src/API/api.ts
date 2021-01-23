import { GroupSession, IMethodParams } from "../app.js";
import VKAPIException from "../VKAPIException.js";
import Session from "./../Session.js";

export type TypeSession = "user" | "group" | "app";

export class InvokeMethodException extends Error {
    public constructor(method_name: string, TypeSession: TypeSession, additional_message: string = "") {
        super(`Don't call method ${method_name} with ${TypeSession} access token${additional_message ? " " + additional_message : ""}.`);
    }
}

export default abstract class API {
    protected Session: Session;
    protected type: TypeSession = "app";

    public constructor(Session: Session) {
        this.Session = Session;
        if (Session instanceof GroupSession)
            this.type = "group";
    }

    public checkValid(...types: TypeSession[]) {
        return types.indexOf(this.type) != -1;
    }

    protected async call<T>(method: string, params: IMethodParams): Promise<T> {
        const response = await this.Session.invokeMethod<T>(method, params);
        if (response.error)
            throw new VKAPIException(response.error);

        return response.response;
    }
}