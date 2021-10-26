import EventEmitter from "events";
import { LongPoolServer } from "../API/groups.js";
import { PhotoObject } from "../API/photos.js";
import Session from "../Session.js";
import request from "../utils/request.js";

interface EventPoll {
	type: string;
	object: any;
	group_id: number;
	event_id: string;
}

interface ResponsePoll {
	ts: string;
	updates: EventPoll[];
	failed?: number;
}

interface AttachmentPhoto {
	type: 'photo',
	photo: PhotoObject
}
type Attachments = AttachmentPhoto;

type ButtonType = "text" | 'vkpay' | 'open_app' | 'location' | 'open_link' | 'intent_subscribe' | 'intent_unsubscribe';
interface ClientInfo {
	button_actions: ButtonType[],
	keyboard: boolean,
	inline_keyboard: boolean,
	carousel: boolean,
	lang_id: number
}
interface ForwardMessage {
	date: number,
	from_id: number,
	text: string,
	attachments: [],
	conversation_message_id: number,
	peer_id: number,
	id: number
}
interface MessageObject {
	date: number,
	from_id: number,
	id: number,
	out: number,
	peer_id: number,
	text: string,
	conversation_message_id: number,
	fwd_messages: ForwardMessage[],
	reply_message: ForwardMessage,
	important: boolean,
	random_id: number,
	attachments: Attachments[],
	is_hidden: boolean
}



interface NewMessageEvent {
	message: MessageObject;
	client_info: ClientInfo;
}
interface NewMessageEventHandler {
	(this: Session, event: NewMessageEvent): void
}

class BotsLongPoll extends EventEmitter {
	private readonly _session: Session;
	private _active = false;
	private _group_id: number;

	constructor(session: Session, group_id: number) {
		super();
		this._session = session;
		this._group_id = group_id;
	}

	private async startPoll(server: LongPoolServer) {
		while (this._active) {
			const result: ResponsePoll = JSON.parse(<string>await request({
				url: server.server,
				data: {
					act: "a_check",
					key: server.key,
					ts: server.ts,
					wait: 25
				}
			}));

			if (result.failed) {
				this.emit("failed", result.failed);
				switch (result.failed) {
					case 1: server.ts = result.ts; break;
					case 2: server.key = (await this._session.groups.getLongPollServer(this._group_id)).key; break;
					case 3: server = await this._session.groups.getLongPollServer(this._group_id); break;
					default: throw new Error(`Unknown code failed(${result.failed})`);
				}

				continue;
			}

			result.updates.forEach(e => this.emit(e.type, e.object));
			server.ts = result.ts;
		}
	}


	public on(event: "failed", listener: (this: Session, code: number) => void): this;
	public on(event: "message_new", listener: NewMessageEventHandler): this;
	public on(event: string, listener: (this: Session, ...args: any[]) => void): this {
		return super.on(event, listener.bind(this._session));
	}

	public async start() {
		this._active = true;
		const server = await this._session.groups.getLongPollServer(this._group_id);

		this.startPoll(server);
	}
	public stop() {
		this._active = false;
	}

}

export default BotsLongPoll;
