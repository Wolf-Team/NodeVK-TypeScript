/// <reference types="node" />
import ConfigSession from './ConfigSession.js';
import Session, { IMethodParams, VKAPIResponse } from "./Session.js";
import { NewMessageEventCallback } from "./NewMessageEvent.js";
import MessagesAPI from "./API/messages.js";
export default class GroupSession extends Session {
    protected token: string;
    constructor(token: string, config?: ConfigSession);
    invokeMethod<t = any>(method: string, params: IMethodParams): Promise<VKAPIResponse<t>>;
    protected events: NodeJS.Dict<Function[]>;
    on(event: "message_new", callback: NewMessageEventCallback): any;
    on(event: string, callback: Function): any;
    protected invoke(event: string, ...args: any): void;
    private server;
    private key;
    protected group_id: number;
    setSettingsLongPoll(group_id: number): void;
    startLongPoll(): Promise<void>;
    private getLongPollServer;
    private getEvents;
    messages: MessagesAPI;
}
