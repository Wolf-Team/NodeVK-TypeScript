import ConfigSession from './ConfigSession.js';
import Session, { IMethodParams, VKAPIResponse } from "./Session.js"
import NewMessageEvent, { NewMessageEventCallback } from "./NewMessageEvent.js"
import request from "./request.js";
import MessagesAPI from "./API/messages.js";
import PhotosAPI from "./API/photos.js";
import UsersAPI from './API/users.js';

interface LongPollServerInfo {
    key: string,
    server: string,
    ts: string
}
type EventList = NodeJS.Dict<EventHandler[][]>;
export enum EventPriority {
    DEFAULT = 10,
    MODULE = 5
}
export interface EventHandler {
    (...args: any): boolean;
}
export default class GroupSession extends Session {
    protected token: string;
    public constructor(token: string, config?: ConfigSession) {
        super(config);
        this.token = token;
    }

    public async invokeMethod<t = any>(method: string, params: IMethodParams): Promise<VKAPIResponse<t>> {
        params.access_token = this.token;
        return super.invokeMethod<t>(method, params);
    }

    protected static globalEventList: EventList = {};
    protected eventList: EventList = {};

    public on(event: "message_new", callback: NewMessageEventCallback, priority?: number);
    public on(event: string, callback: EventHandler, priority?: number);
    public on(event: string, callback: EventHandler, priority: number = EventPriority.DEFAULT) {
        if (this.eventList[event] == null)
            this.eventList[event] = [];

        if (this.eventList[event][priority] == null)
            this.eventList[event][priority] = [];

        this.eventList[event][priority].push(callback);
    }

    public static on(event: "message_new", callback: NewMessageEventCallback, priority?: number);
    public static on(event: string, callback: EventHandler, priority?: number);
    public static on(event: string, callback: EventHandler, priority: number = EventPriority.DEFAULT) {
        if (this.globalEventList[event] == null)
            this.globalEventList[event] = [];

        if (this.globalEventList[event][priority] == null)
            this.globalEventList[event][priority] = [];

        this.globalEventList[event][priority].push(callback);
    }

    protected invoke(event: string, ...args: any): void {
        if (GroupSession.globalEventList[event] != null)
            for (const callList of GroupSession.globalEventList[event])
                if (Array.isArray(callList))
                    for (const call of callList)
                        if (call.apply(this, args))
                            return;

        if (this.eventList[event] != null)
            for (const callList of this.eventList[event])
                if (Array.isArray(callList))
                    for (const call of callList)
                        if (call.apply(this, args))
                            return;
    }



    /* LongPoll */
    private server: string;
    private key: string;
    protected group_id: number = null;
    public setSettingsLongPoll(group_id: number) {
        if (group_id)
            this.group_id = group_id;

    }
    public async startLongPoll(): Promise<void> {
        if (this.group_id == null)
            throw new Error("Не был указан ID группы.");

        let server_info: LongPollServerInfo = await this.getLongPollServer(this.group_id);
        this.server = server_info.server;
        this.key = server_info.key;
        this.getEvents(server_info.ts);
    }

    private async getLongPollServer(group_id: number): Promise<LongPollServerInfo> {
        return (await this.invokeMethod<LongPollServerInfo>("groups.getLongPollServer", { group_id: group_id })).response;
    }

    private async getEvents(ts: string) {
        let res = await this.request(this.server, {
            act: "a_check",
            key: this.key,
            ts: ts,
            wait: "25"
        });
        if (res.failed) {
            switch (res.failed) {
                case 1:
                    console.error("История событий устарела или была частично утеряна. LongPoll продолжает работать.");
                    this.getEvents(res.ts);
                    break;
                case 2:
                    console.error("Истекло время действия ключа. Получаю повторно ключ.");
                    this.startLongPoll();
                    break;
                case 3:
                    console.log("Информация утрачена. Получаю повторно ключ.");
                    this.startLongPoll();
                    break;
                default:
                    console.log("Неизвестная ошибка. Запускаю сервер повторно.");
                    this.startLongPoll();
                    break;
            }
        } else {
            for (let event of res.updates) {
                switch (event.type) {
                    case "message_new":
                        this.invoke(event.type, new NewMessageEvent(event.object, this));
                        break;
                    default:
                        this.invoke(event.type, event.object);
                        break;
                }
            }
            this.getEvents(res.ts);
        }
    }

    public messages: MessagesAPI = new MessagesAPI(this);
    public photos: PhotosAPI = new PhotosAPI(this);
    public users: UsersAPI = new UsersAPI(this);
}