import API, { IMethodParams } from "./API.js";
import { UserObject } from "./users";
import { ListResponse } from "../utils/types.js";
import NodeVK from "../NodeVK.js";
import { GroupInfo } from "./groups.js";

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

//Intent
type Intent = "promo_newsletter" | "bot_ad_invite" | "bot_ad_promo" | "non_promo_newsletter" | "confirmed_notification" | "purchase_update" | "account_update" | "game_notification" | "customer_support" | "default";


interface SendAdditionalParams {
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

interface ConversationMember {
	member_id: number;
	invited_by: number;
	join_date: number;
	is_admin?: boolean;
	is_owner?: boolean;
	can_kick?: boolean;
}

interface ConversationMembersResponse extends ListResponse<ConversationMember> {
	profiles: UserObject[];
	groups: GroupInfo[];
}
interface GetConversationMembersAdditionalParams {
	fields?: string[];
	group_id?: number;

	peer_id?: number;
}

interface EditAdditionalParams {
	lat?: number,
	long?: number,
	keep_forward_messages?: boolean,
	keep_snippets?: boolean,
	group_id?: number,
	dont_parse_links?: boolean,
	keyboard?: Keyboard,
	template?: Template
}


interface DeleteMessageResponse {
	[key: string]: 0 | 1
}

class MessagesAPI extends API {
	protected name: string = "messages";

	public async send(peer_id: number, message?: string, attachments?: string | string[], params?: SendAdditionalParams): Promise<number>;
	public async send(domain: string, message?: string, attachments?: string | string[], params?: SendAdditionalParams): Promise<number>;
	public async send(peers_ids: number[], message?: string, attachments?: string | string[], params?: SendAdditionalParams): Promise<SendMessageResponse[]>;
	public async send(peers_id: string | number | number[], message?: string, attachments?: string | string[], params: SendAdditionalParams = {}): Promise<number | SendMessageResponse[]> {
		const _params: IMethodParams = {
			message,
			random_id: 0,
			attachment: attachments,
			intent: "default",
			...params,
			forward: params.forward ? JSON.stringify(params.forward) : null,
			keyboard: params.keyboard ? JSON.stringify(params.keyboard) : null,
			template: params.template ? JSON.stringify(params.template) : null,
			content_source: params.content_source ? JSON.stringify(params.content_source) : null
		};

		if (typeof _params.forward_messages == "number")
			_params.forward_messages = [_params.forward_messages];

		if (Array.isArray(peers_id)) {
			_params.peer_ids = peers_id;
		} else if (typeof peers_id == "string") {
			_params.domain = peers_id;
		} else {
			_params.peer_id = peers_id;
		}

		return await this.invokeMethod<number | SendMessageResponse[]>("send", _params);
	}

	public async edit(peer_id: number, message_id: number, message?: string, attachments?: string | string[], params: EditAdditionalParams = {}): Promise<1> {
		return await this.invokeMethod<1>("edit", (data => {
			if (NodeVK.isChat(peer_id)) {
				data.conversation_message_id = message_id;
			} else {
				data.message_id = message_id;
			}
			return data
		})({
			conversation_message_id: message_id,
			message_id,
			message,
			attachment: attachments,
			...params,
			keyboard: params.keyboard ? JSON.stringify(params.keyboard) : null,
			template: params.template ? JSON.stringify(params.template) : null
		}))
	}

	public async delete(message_ids: number[], spam?: boolean, delete_for_all?: boolean, group_id?: number): Promise<DeleteMessageResponse>;
	public async delete(message_id: number, spam?: boolean, delete_for_all?: boolean, group_id?: number): Promise<DeleteMessageResponse>;
	public async delete(message_id: number | number[], spam: boolean = false, delete_for_all: boolean = false, group_id?: number): Promise<DeleteMessageResponse> {
		if (typeof message_id == "number")
			message_id = [message_id];

		return await this.invokeMethod<DeleteMessageResponse>("delete", {
			message_ids: message_id,
			spam,
			delete_for_all,
			group_id
		});
	}

	public async getConversationMembers(peer_id: number, params: GetConversationMembersAdditionalParams = {}): Promise<ConversationMembersResponse> {
		params.peer_id = peer_id;

		return await this.invokeMethod<ConversationMembersResponse>("getConversationMembers", { ...params, peer_id });
	}

	public async removeChatUser(chat_id: number, member_id: number): Promise<1> {

		return await this.invokeMethod<1>("removeChatUser", { chat_id, member_id });
	}
	public async removeChatUserFromPeer(peer_id: number, member_id: number): Promise<1> {
		if (!NodeVK.isChat(peer_id))
			throw new RangeError("Isn't chat ID.");

		return await this.invokeMethod<1>("removeChatUser", {
			chat_id: NodeVK.getChatID(peer_id),
			member_id
		})

	}

	public async editChat(chat_id: number, title: string): Promise<1> {
		return await this.invokeMethod<1>("editChat", { chat_id, title });
	}
	public async editChatFromPeer(peer_id: number, title: string): Promise<1> {
		if (!NodeVK.isChat(peer_id))
			throw new RangeError("Isn't chat ID.");

		return await this.invokeMethod<1>("editChat", { chat_id: NodeVK.getChatID(peer_id), title });
	}

}

export default MessagesAPI;
