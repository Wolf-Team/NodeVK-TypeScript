import API, { InvokeMethodException } from "./api.js";
import { IMethodParams } from "./../Session/Session.js";
import NodeVK from "./../NodeVK.js";
import { UserObject } from "./users.js";

interface ForwardMessageFormat {
    owner_id?: number,
    peer_id: number,
    conversation_message_ids?: number[],
    message_ids?: number[],
    is_reply?: boolean
}

//Keyboard
interface ButtonBase {
    type: string,
    payload?: string
}

interface ButtonText extends ButtonBase {
    type: "text",
    label: string
}
interface ButtonOpenLink extends ButtonBase {
    type: "open_link",
    label: string,
    link: string
}
interface ButtonLocation extends ButtonBase {
    type: "location"
}
interface ButtonVKPay extends ButtonBase {
    type: "vkpay",
    hash: string
}
interface ButtonVKApp extends ButtonBase {
    type: "open_app",
    app_id: number,
    owner_id: number,
    label: string,
    hash: string
}
interface ButtonCallback extends ButtonBase {
    type: "callback",
    label: string
}

type ButtonAction = ButtonText | ButtonOpenLink | ButtonLocation | ButtonVKPay | ButtonVKApp | ButtonCallback;
interface Button {
    action: ButtonAction,
    color?: "primary" | "secondary" | "negative" | "positive"
}

interface Keyboard {
    one_time?: boolean,
    inline?: boolean,
    buttons: Button[][]
}

//Template
interface TemplateCarouselOpenLink {
    type: "open_link",
    link: string
}
interface TemplateCarouselOpenPhoto {
    type: "open_photo"
}
type TemplateCarouselAction = TemplateCarouselOpenLink | TemplateCarouselOpenPhoto;
interface TemplateCarouselElement {
    title?: string,
    photo_id?: number,
    description?: string,
    buttons?: Button[],
    action?: TemplateCarouselAction
}
interface TemplateCarousel {
    type: "carousel",
    elements: TemplateCarouselElement[]
}

type Template = TemplateCarousel;

//ContentSource
interface ContentSourceFromMessage {
    type: 'message',
    owner_id: number,
    peer_id: number,
    conversation_message_id: number
}
interface ContentSourceFromURL {
    type: "url",
    url: string
}
type ContentSource = ContentSourceFromMessage | ContentSourceFromURL;

type Intent = "promo_newsletter" | "bot_ad_invite" | "bot_ad_promo" | "non_promo_newsletter" | "confirmed_notification" | "purchase_update" | "account_update" | "game_notification" | "customer_support" | "default";

interface SendAdditionalParams extends IMethodParams {
    random_id?: number,
    lat?: number,
    long?: number,
    reply_to?: number,
    forward_messages?: number | number[],
    forward?: ForwardMessageFormat,
    sticker_id?: number,
    group_id?: number,
    keyboard?: Keyboard,
    template?: Template,
    payload?: string,
    content_source?: ContentSource,
    dont_parse_links?: boolean,
    disable_mentions?: boolean,
    intent?: Intent,
    subscribe_id?: number
}

interface SendMessageResponse {
    peer_id: number,
    message_id?: number,
    conversation_message_id?: number,
    error?: string
}

interface DeleteMessageResponse {
    [key: string]: 0 | 1
}

interface EditAdditionalParams extends IMethodParams {
    lat?: number,
    long?: number,
    keep_forward_messages?: boolean,
    keep_snippets?: boolean,
    group_id?: number,
    dont_parse_links?: boolean,
    keyboard?: Keyboard,
    template?: Template
}
interface ConversationMember {
    member_id: number;
    invited_by: number;
    join_date: number;
    is_admin?: boolean;
    is_owner?: boolean;
    can_kick?: boolean;
}

interface ConversationMembersResponse {
    count: number;
    items: ConversationMember[];
    profiles: UserObject[];
    groups: GroupInfo[];
}

enum GroupClosed {
    Open = 0,
    Closed = 1,
    Private = 2
}
interface GroupInfo {
    id: number;
    name: string;
    screen_name: string;
    is_closed: GroupClosed;
    deactivated?: "deleted" | "banned";
    is_admin?: 0 | 1;
    admin_level?: 1 | 2 | 3;
    is_member?: 0 | 1;
    is_advertiser?: 0 | 1;
    invited_by?: number;
    type: "group" | "page" | "event";
    photo_50: string;
    photo_100: string;
    photo_200: string;

    //Additive fileds -> https://vk.com/dev/objects/group
}

interface GetConversationMembersAdditionalParams extends IMethodParams {
    fields?: string[];
    group_id?: number;

    peer_id?: number;
}
export default class MessagesAPI extends API {
    private api_name: string = "messages";

    public async send(peer_id: number, message?: string, attachments?: string | string[], params?: SendAdditionalParams): Promise<number>;
    public async send(peer_id: string, message?: string, attachments?: string | string[], params?: SendAdditionalParams): Promise<number>;
    public async send(peers_id: number[], message?: string, attachments?: string | string[], params?: SendAdditionalParams): Promise<SendMessageResponse[]>;
    public async send(peers_id: string | number | number[], message?: string, attachments?: string | string[], params: SendAdditionalParams = {}): Promise<number | SendMessageResponse[]> {
        let method = this.api_name + ".send";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        if (message) params.message = message;
        if (attachments) params.attachment = attachments;

        if (params.random_id == null) params.random_id = 0;
        if (params.intent == null) params.intent = "default";

        if (Array.isArray(peers_id)) {
            if (!this.checkValid("group"))
                throw new InvokeMethodException(method, this.type, 'with param "peer_ids"');

            params.peer_ids = peers_id;
        } else if (typeof peers_id == "string") {
            params.domain = peers_id;
        } else {
            params.peer_id = peers_id;
        }

        if (typeof params.forward_messages == "number")
            params.forward_messages = [params.forward_messages];

        return await this.call<number | SendMessageResponse[]>(method, params);
    }

    public async edit(peer_id: number, message_id: number, message?: string, attachments?: string | string[], params: EditAdditionalParams = {}): Promise<1> {
        let method = this.api_name + ".edit";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        if (NodeVK.isChat(peer_id)) {
            params.conversation_message_id = message_id;
        } else {
            params.message_id = message_id;
        }

        if (message) params.message = message;
        if (attachments) params.attachment = attachments;

        return await this.call<1>(method, params);
    }

    public async delete(message_ids: number[], spam?: boolean, delete_for_all?: boolean, group_id?: number): Promise<DeleteMessageResponse>;
    public async delete(message_id: number, spam?: boolean, delete_for_all?: boolean, group_id?: number): Promise<DeleteMessageResponse>;
    public async delete(message_id: number | number[], spam: boolean = false, delete_for_all: boolean = false, group_id?: number): Promise<DeleteMessageResponse> {
        let method = this.api_name + ".delete";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        if (typeof message_id == "number")
            message_id = [message_id];

        let params: IMethodParams = {
            message_ids: message_id,
            spam: spam,
            delete_for_all: delete_for_all
        };
        if (group_id)
            params.group_id = group_id;

        return await this.call<DeleteMessageResponse>(method, params);
    }

    public async getConversationMembers(peer_id: number, params: GetConversationMembersAdditionalParams = {}): Promise<ConversationMembersResponse> {
        let method = this.api_name + ".getConversationMembers";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        params.peer_id = peer_id;

        return await this.call<ConversationMembersResponse>(method, params);
    }

    public async removeChatUser(chat_id: number, member_id: number): Promise<1> {
        let method = this.api_name + ".removeChatUser";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        const params: IMethodParams = {};
        params.chat_id = NodeVK.getChatID(chat_id);
        params.member_id = member_id;
        return await this.call<1>(method, params);
    }
    public async removeChatUserFromPeer(peer_id: number, member_id: number): Promise<1> {
        let method = this.api_name + ".removeChatUser";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        if (!NodeVK.isChat(peer_id))
            throw new RangeError("Isn't chat ID.");

        const params: IMethodParams = {};
        params.chat_id = NodeVK.getChatID(peer_id);
        params.member_id = member_id;
        return await this.call<1>(method, params);
    }

    public async editChat(chat_id: number, title: string): Promise<1> {
        let method = this.api_name + ".editChat";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        const params: IMethodParams = {};
        params.chat_id = NodeVK.getChatID(chat_id);
        params.title = title;
        return await this.call<1>(method, params);
    }
    public async editChatFromPeer(peer_id: number, title: string): Promise<1> {
        let method = this.api_name + ".editChat";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        if (!NodeVK.isChat(peer_id))
            throw new RangeError("Isn't chat ID.");

        const params: IMethodParams = {};
        params.chat_id = NodeVK.getChatID(peer_id);
        params.title = title;
        return await this.call<1>(method, params);
    }

}