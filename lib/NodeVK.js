export default class NodeVK {
    static isChat(id) {
        return id > 2000000000;
    }
    static getPeerIDForChat(chat_id) {
        if (this.isChat(chat_id))
            return chat_id;
        return 2000000000 + chat_id;
    }
}
;
