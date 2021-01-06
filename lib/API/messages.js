var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import API, { InvokeMethodException } from "./api.js";
export default class MessagesAPI extends API {
    constructor() {
        super(...arguments);
        this.api_name = "messages";
    }
    send(peers_id, message, attachments, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let method = this.api_name + ".send";
            if (!this.checkValid("group", "user"))
                throw new InvokeMethodException(method, this.type);
            if (message)
                params.message = message;
            if (attachments)
                params.attachment = attachments;
            if (params.random_id == null)
                params.random_id = 0;
            if (params.intent == null)
                params.intent = "default";
            if (Array.isArray(peers_id)) {
                if (!this.checkValid("group"))
                    throw new InvokeMethodException(method, this.type, 'with param "peer_ids"');
                params.peer_ids = peers_id;
            }
            else if (typeof peers_id == "string") {
                params.domain = peers_id;
            }
            else {
                params.peer_id = peers_id;
            }
            if (typeof params.forward_messages == "number")
                params.forward_messages = [params.forward_messages];
            return yield this.Session.invokeMethod(method, params);
        });
    }
}
