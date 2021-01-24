export default class NodeVK {
    public static isChat(id: number): boolean {
        return id > 2000000000;
    }
    public static getPeerIDForChat(chat_id: number): number {
        if (this.isChat(chat_id))
            return chat_id;

        return 2000000000 + chat_id;
    }
    public static getChatID(peer_id: number): number {
        if (this.isChat(peer_id))
            return peer_id - 2000000000;

        return peer_id;
    }
    public static getGroupIDForChat(id: number): number {
        return id > 0 ? -id : id;
    }
};