import Session from "./../Session.js";
export declare type TypeSession = "user" | "group" | "app";
export declare class InvokeMethodException extends Error {
    constructor(method_name: string, TypeSession: TypeSession, additional_message?: string);
}
export default abstract class API {
    protected Session: Session;
    protected type: TypeSession;
    constructor(Session: Session);
    checkValid(...types: TypeSession[]): boolean;
}
