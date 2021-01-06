import ConfigSession from './ConfigSession.js';
import Session, { IMethodParams, VKAPIResponse } from "./Session.js"
import NewMessageEvent, {NewMessageEventCallback} from "./NewMessageEvent.js"
import request from "./request.js";
import MessagesAPI from "./API/messages.js";

interface LongPollServerInfo {
    key: string,
    server: string,
    ts: string
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

    protected events: NodeJS.Dict<Function[]> = {};

    public on(event: "message_new", callback: NewMessageEventCallback);
    public on(event: string, callback: Function);
    public on(event: string, callback: Function) {
        if (this.events[event] == null)
            this.events[event] = [];

        this.events[event].push(callback);
    }

    protected invoke(event: string, ...args: any): void {
        if (this.events[event] == null) return;

        for (let call of this.events[event])
            call.apply(this, args);
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
        console.log("LongPoll запущен.")
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
                switch(event.type){
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

    public messages:MessagesAPI = new MessagesAPI(this);
}