import Session, { IMethodParams } from "./Session/Session.js";
import GroupSession, { EventPriority } from "./Session/GroupSession.js";
import ConfigSession, { getDefaultConfig } from "./Session/ConfigSession.js";
import NewMessageEventHandler, { ClientInfo, MessageObject, NewMessageEvent, AttachmentPhoto } from "./Events/NewMessageEventHandler.js";
import VKPayEvent from "./Events/VKPayEventHandler.js";
import MessagesAPI from "./API/messages.js";
import PhotosAPI, { File, FileObject, PhotoObject } from "./API/photos.js";
import NodeVK from "./NodeVK.js";
import UsersAPI, { UserObject, NameCase } from "./API/users.js";

export {
    File,
    UserObject,
    NameCase,
    PhotoObject,
    UsersAPI,
    FileObject,
    PhotosAPI,
    MessagesAPI,
    ConfigSession,
    ClientInfo,
    MessageObject,
    AttachmentPhoto,
    Session,
    NewMessageEvent,
    NewMessageEventHandler,
    GroupSession,
    EventPriority,
    getDefaultConfig,
    IMethodParams,
    VKPayEvent
};

export default NodeVK;