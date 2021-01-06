var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Session from "./Session.js";
import NewMessageEvent from "./NewMessageEvent.js";
import MessagesAPI from "./API/messages.js";
export default class GroupSession extends Session {
    constructor(token, config) {
        super(config);
        this.events = {};
        this.group_id = null;
        this.messages = new MessagesAPI(this);
        this.token = token;
    }
    invokeMethod(method, params) {
        const _super = Object.create(null, {
            invokeMethod: { get: () => super.invokeMethod }
        });
        return __awaiter(this, void 0, void 0, function* () {
            params.access_token = this.token;
            return _super.invokeMethod.call(this, method, params);
        });
    }
    on(event, callback) {
        if (this.events[event] == null)
            this.events[event] = [];
        this.events[event].push(callback);
    }
    invoke(event, ...args) {
        if (this.events[event] == null)
            return;
        for (let call of this.events[event])
            call.apply(this, args);
    }
    setSettingsLongPoll(group_id) {
        if (group_id)
            this.group_id = group_id;
    }
    startLongPoll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.group_id == null)
                throw new Error("Не был указан ID группы.");
            let server_info = yield this.getLongPollServer(this.group_id);
            this.server = server_info.server;
            this.key = server_info.key;
            this.getEvents(server_info.ts);
            console.log("LongPoll запущен.");
        });
    }
    getLongPollServer(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.invokeMethod("groups.getLongPollServer", { group_id: group_id })).response;
        });
    }
    getEvents(ts) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.request(this.server, {
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
            }
            else {
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
        });
    }
}
