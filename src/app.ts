import Session, { IMethodParams } from "./Session.js";
import GroupSession, { EventPriority } from "./GroupSession.js";
import ConfigSession, { getDefaultConfig } from "./ConfigSession.js";
import NewMessageEvent, { ClientInfo, NewMessageEventCallback, MessageObject, AttachmentPhoto } from "./NewMessageEvent.js";
import VKPayEvent from "./VKPayEvent.js";
import MessagesAPI from "./API/messages.js";
import PhotosAPI, { File, FileObject, PhotoObject } from "./API/photos.js";
import NodeVK from "./NodeVK.js";
import UsersAPI, { UserObject, NameCase } from "./API/users.js";

export { File, UserObject, NameCase, PhotoObject, UsersAPI, FileObject, PhotosAPI, MessagesAPI, ConfigSession, ClientInfo, MessageObject, AttachmentPhoto, Session, NewMessageEvent, NewMessageEventCallback, GroupSession, EventPriority, getDefaultConfig, IMethodParams, VKPayEvent };

export default NodeVK;