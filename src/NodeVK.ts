namespace NodeVK {
	export function isChat(id: number): boolean {
		return id > 2000000000;
	}
	export function getPeerIDForChat(chat_id: number): number {
		if (isChat(chat_id))
			return chat_id;

		return 2000000000 + chat_id;
	}
	export function getChatID(peer_id: number): number {
		if (isChat(peer_id))
			return peer_id - 2000000000;

		return peer_id;
	}
	export function getGroupIDForChat(id: number): number {
		return id > 0 ? -id : id;
	}
}

export default NodeVK;
