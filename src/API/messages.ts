import API, { InvokeMethodException } from "./api.js";
import { IMethodParams, VKAPIResponse } from "./../Session.js";
import NodeVK from "./../NodeVK.js";
import { AttachmentPhoto } from "../NewMessageEvent.js";
import { timeStamp } from "console";
import VKAPIException from "../VKAPIException.js";

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
    profiles: ProfileInfo[];
    groups: GroupInfo[];
}

interface CareerInfo {
    group_id?: number;
    company?: string;
    country_id: number;
    city_id?: number;
    city_name?: string;
    from?: number;
    until?: number;
    position?: string;
}
interface CityInfo {
    id: number;
    title: string;
}
interface CountryInfo {
    id: number;
    title: string;
}

interface Counters {
    albums?: number;
    videos?: number;
    audios?: number;
    photos?: number;
    notes?: number;
    friends?: number;
    groups?: number;
    online_friends?: number;
    mutual_friends?: number;
    user_videos?: number;
    followers?: number;
    pages?: number;
    gifts?: number;
    subscriptions?: number;
    user_photos?: number;
    new_photo_tags?: number;
    new_recognition_tags?: number;
    articles?: number;
    clips_followers?: number;
}

interface CropInfo {
    x: number;
    y: number;
    x2: number;
    y2: number;
}
interface CropPhotoInfo {
    photo: AttachmentPhoto;
    crop: CropInfo;
    rect: CropInfo;
}
interface LastOnline {
    time: number;
    platform: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
interface MilitaryInfo {
    unit: string;
    unit_id: number;
    country_id: number;
    from?: number;
    until?: number;
}
interface OccupationInfo {
    type: "work" | "school" | "university";
    id: number;
    name: string;
}
enum Political {
    Communist = 1,
    Socialist = 2,
    Moderate = 3,
    Liberal = 4,
    Conservative = 5,
    Monarchical = 6,
    UltraConservative = 7,
    Indifferent = 8,
    Libertarian = 9
}
enum PeopleMain {
    None = 0,
    IntelligenceCreativity = 1,
    KindnessHonesty = 2,
    BeautyHealth = 3,
    PowerWealth = 4,
    CouragePerseverance = 5,
    HumorLoveOfLife = 6
}
enum LifeMain {
    None = 0,
    FamilyChildren = 1,
    CareerMoney = 2,
    EntertainmentRecreation = 3,
    ScienceResearch = 4,
    ImprovingWorld = 5,
    SelfDevelopment = 6,
    BeautyArt = 7,
    FameInfluence = 8
}
enum Relationship {
    None = 0,
    SharplyNegative = 1,
    Negative = 2,
    Compromise = 3,
    Neutral = 4,
    Positive = 5
}

interface PersonalInfo {
    political?: Political;
    langs?: string[];
    religion?: string;
    inspired_by: string;
    people_main: PeopleMain;
    life_main: LifeMain;

    smoking: Relationship;
    alcohol: Relationship;
}

interface Relative {
    id?: number;
    name: string;
    type: "child" | 'sibling' | "parent" | "grandparent" | "grandchild";
}
enum Relation {
    None = 0,
    Single = 1,
    HaveFriend = 2,
    Engaged = 3,
    Married = 4,
    EverythingIsComplicated = 5,
    ActiveSearch = 6,
    Love = 7,
    CivilMarriage = 8,
}

enum SchoolType {
    School = 0,
    Gymnasium = 1,
    Lyceum = 2,
    BoardingSchool = 3,
    EveningSchool = 4,
    MusicSchool = 5,
    SportsSchool = 6,
    ArtSchool = 7,
    College = 8,
    ProfessionalLyceum = 9,
    TechnicalSchool = 10,
    PTU = 11,
    College2 = 12,
    ArtSchool2 = 13
}
enum SchoolStrType {
    School = "школа",
    Gymnasium = "гимназия",
    Lyceum = "лицей",
    BoardingSchool = "школа-интернат",
    EveningSchool = "школа вечерняя",
    MusicSchool = "школа музыкальная",
    SportsSchool = "школа спортивная",
    ArtSchool = "школа художественная",
    College = "колледж",
    ProfessionalLyceum = "профессиональный лицей",
    TechnicalSchool = "техникум",
    PTU = "ПТУ",
    College2 = "училище",
    ArtSchool2 = "школа искусств"
}
interface SchoolInfo {
    id: number;
    country: number;
    city: number;
    name: string;
    year_from?: number;
    year_to?: number;
    year_graduated?: number;
    class?: string;
    speciality?: string;
    type: SchoolType;
    type_str: SchoolStrType;
}
enum Sex {
    None = 0,
    Female = 1,
    Male = 2
}

interface Audio {
    artist: string;
    id: number;
    owner_id: number;
    title: string;
    duration: number;
    is_explicit: boolean;
    is_focus_track: boolean;
    track_code: string;
    url: string;
    date: number;
    lyrics_id: number;
    genre_id: number;
    short_videos_allowed: boolean;
    stories_allowed: boolean;
    stories_cover_allowed: boolean;
}

interface University {
    id: number;
    country: number;
    city: number;
    name: string;
    faculty?: number;
    faculty_name?: string;
    chair?: number;
    chair_name?: string;
    graduation?: number;
    education_form?: string;
    education_status?: string;
}
interface ProfileInfo {
    first_name: string;
    id: number;
    last_name: string;
    deactivated: "deleted" | "banned";
    can_access_closed: boolean;
    is_closed: boolean;

    about?: string;
    activities?: string;
    bdate?: string;
    blacklisted?: 0 | 1;
    blacklisted_by_me?: 0 | 1;
    books?: string;
    can_post?: 0 | 1;
    can_see_all_posts?: 0 | 1;
    can_see_audio?: 0 | 1;
    can_send_friend_request?: 0 | 1;
    can_write_private_message?: 0 | 1;
    career?: CareerInfo[];
    city?: CityInfo;
    common_count?: number;
    skype?: string;
    facebook?: string;
    twitter?: string;
    livejournal?: string;
    instagram?: string;
    mobile_phone?: string;
    home_phone?: string;
    counters?: Counters;
    country?: CountryInfo
    crop_photo?: CropPhotoInfo;
    domain?: string;
    university?: number;
    university_name?: string;
    faculty?: number;
    faculty_name?: string;
    graduation?: number;
    education_form?: string;
    exports?: any; // Что это бл*ть?
    first_name_nom?: string;
    last_name_nom?: string;
    first_name_gen?: string;
    last_name_gen?: string;
    first_name_dat?: string;
    last_name_dat?: string;
    first_name_acc?: string;
    last_name_acc?: string;
    first_name_ins?: string;
    last_name_ins?: string;
    first_name_abl?: string;
    last_name_abl?: string;
    followers_count?: number;
    friend_status?: 0 | 1 | 2 | 3;
    games?: string;
    has_mobile?: 0 | 1;
    has_photo?: 0 | 1;
    home_town?: string;
    interests?: string;
    is_favorite?: 0 | 1;
    is_friend?: 0 | 1;
    is_hidden_from_feed?: 0 | 1;
    last_seen?: LastOnline;
    lists?: string;


    maiden_name?: string;
    military?: MilitaryInfo[];
    movies?: string;
    music?: string;
    nickname?: string;
    occupation?: OccupationInfo;
    online?: 0 | 1;
    personal: PersonalInfo;
    photo_50?: string;
    photo_100?: string;
    photo_200_orig?: string;
    photo_200?: string;
    photo_400_orig?: string;
    photo_id?: string;
    photo_max?: string;
    photo_max_orig?: string;
    quotes?: string;
    relatives?: Relative[];
    relation?: Relation;
    relation_partner?: {
        first_name: string;
        id: number;
        last_name: string;
    };
    schools?: SchoolInfo[];
    screen_name?: string;
    sex?: Sex;
    site?: string;
    status?: string;
    status_audio?: Audio;
    timezone?: number;
    trending?: 0 | 1;
    tv?: string;
    universities: University[];
    verified: 0 | 1;
    wall_default: "owner" | "all";
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
    public api_name: string = "messages";

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

}