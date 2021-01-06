import { GroupSession } from "../app.js";
export class InvokeMethodException extends Error {
    constructor(method_name, TypeSession, additional_message = "") {
        super(`Don't call method ${method_name} with ${TypeSession} access token${additional_message ? " " + additional_message : ""}.`);
    }
}
export default class API {
    constructor(Session) {
        this.type = "app";
        this.Session = Session;
        if (Session instanceof GroupSession)
            this.type = "group";
    }
    checkValid(...types) {
        return types.indexOf(this.type) != -1;
    }
}
