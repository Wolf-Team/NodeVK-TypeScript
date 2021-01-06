import API, { InvokeMethodException } from "./api.js";
import { IMethodParams } from "./../Session.js";
import NodeVK from "./../NodeVK.js";

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

interface EditAdditionalParams extends IMethodParams{
    lat?: number,
    long?: number,
    keep_forward_messages?:boolean,
    keep_snippets?:boolean,
    group_id?: number,
    dont_parse_links?: boolean,
    keyboard?: Keyboard,
    template?: Template
}

export default class MessagesAPI extends API {
    public api_name: string = "messages";

    public async send(peer_id: number, message?: string, attachments?: string | string[], params?: SendAdditionalParams);
    public async send(peer_id: string, message?: string, attachments?: string | string[], params?: SendAdditionalParams);
    public async send(peers_id: number[], message?: string, attachments?: string | string[], params?: SendAdditionalParams);
    public async send(peers_id: string | number | number[], message?: string, attachments?: string | string[], params: SendAdditionalParams = {}) {
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

        return await this.Session.invokeMethod(method, params);
    }

    public async edit(peer_id:number, message_id:number, message?: string, attachments?: string | string[], params: EditAdditionalParams = {}){
        let method = this.api_name + ".edit";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);
            
        if(NodeVK.isChat(peer_id)){
            params.conversation_message_id = message_id;
        }else{
            params.message_id = message_id;
        }

        if (message) params.message = message;
        if (attachments) params.attachment = attachments;

        return await this.Session.invokeMethod(method, params);
    }

}