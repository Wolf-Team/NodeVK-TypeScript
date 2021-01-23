import Session, { IMethodParams } from "./Session.js";
import GroupSession, {EventPriority} from "./GroupSession.js";
import ConfigSession, { getDefaultConfig } from "./ConfigSession.js";
import NewMessageEvent, {ClientInfo, NewMessageEventCallback, MessageObject, AttachmentPhoto} from "./NewMessageEvent.js";
import NodeVK from "./NodeVK.js"

export { ConfigSession, ClientInfo, MessageObject, AttachmentPhoto, Session, NewMessageEvent, NewMessageEventCallback, GroupSession, EventPriority, getDefaultConfig, IMethodParams };

export default NodeVK;