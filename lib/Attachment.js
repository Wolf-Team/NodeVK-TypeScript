;
var NewMessageEvent = /** @class */ (function () {
    function NewMessageEvent(o, session) {
        this.MessageSource = o.messsage;
        this.ClientInfo = o.client_info;
        this.session = session;
    }
    NewMessageEvent.prototype.reply = function (text, attachments, params) {
        if (params.random_id == null)
            params.random_id = 0;
        params.message = text;
        params.attachments = attachments;
        this.session.invoke_method("messages.send", params);
    };
    return NewMessageEvent;
}());
export default NewMessageEvent;
