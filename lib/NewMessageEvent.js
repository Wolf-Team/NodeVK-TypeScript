;
export default class NewMessageEvent {
    constructor(o, session) {
        this.MessageSource = o.message;
        this.ClientInfo = o.client_info;
        this.Session = session;
    }
    get message() {
        return this.MessageSource.text;
    }
    reply(text, attachments, params = {}) {
        if (params.random_id == null)
            params.random_id = 0;
        params.message = text;
        if (attachments != null)
            params.attachments = attachments;
        params.peer_id = this.MessageSource.peer_id;
        this.Session.invokeMethod("messages.send", params);
    }
}
