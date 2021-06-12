import Session, { IMethodParams } from "../Session/Session.js";
import EventHandler from "./EventHandler.js";
import { PhotoObject } from "../API/photos.js";

export interface AttachmentPhoto {
    type: 'photo',
    photo: PhotoObject
}
export type Attachment = AttachmentPhoto;


export type ButtonType = "text" | 'vkpay' | 'open_app' | 'location' | 'open_link' | 'intent_subscribe' | 'intent_unsubscribe';
export interface ClientInfo {
    button_actions: ButtonType[],
    keyboard: boolean,
    inline_keyboard: boolean,
    carousel: boolean,
    lang_id: number
}
export interface ForwardMessage {
    date: number,
    from_id: number,
    text: string,
    attachments: [],
    conversation_message_id: number,
    peer_id: number,
    id: number
}
export interface MessageObject {
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
    attachments: Attachment[],
    is_hidden: boolean
}

export class NewMessageEvent {
    public readonly ClientInfo: ClientInfo;
    public readonly MessageSource: MessageObject;
    protected readonly Session: Session;

    public constructor(o: { message: MessageObject, client_info: ClientInfo }, session: Session) {
        this.MessageSource = o.message;
        this.ClientInfo = o.client_info;
        this.Session = session;
    }

    get message(): string {
        return this.MessageSource.text;
    }

    get from_id(): number {
        return this.MessageSource.from_id;
    }
    get peer_id(): number {
        return this.MessageSource.peer_id;
    }

    public async reply(text: string, attachments?: string | readonly string[], params: IMethodParams = {}) {
        if (params.random_id == null)
            params.random_id = 0;

        params.message = text;
        if (attachments != null)
            params.attachment = attachments;
        params.peer_id = this.MessageSource.peer_id;

        await this.Session.invokeMethod("messages.send", params);
    }
}

export default interface NewMessageEventHandler extends EventHandler {
    (message: NewMessageEvent): boolean | Promise<boolean>;
}
