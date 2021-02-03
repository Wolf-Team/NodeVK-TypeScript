import {promises as fs} from "fs";
import path from "path";

import { AttachmentPhoto, IMethodParams } from "../app.js";
import request, { RequestDataFile } from "../request.js";
import { VKAPIResponse } from "../Session.js";
import VKAPIException from "../VKAPIException.js";
import API, { InvokeMethodException } from "./api.js";

export interface MessageUplodaServer {
    upload_url: string;
    album_id: number;
    user_id: number;
}

interface SaveMessagesPhotoInfo extends IMethodParams {
    photo: string;
    server: string;
    hash: string;
}


export interface CropInfo {
    x: number;
    y: number;
    x2: number;
    y2: number;
}
export interface CropPhotoInfo {
    photo: AttachmentPhoto;
    crop: CropInfo;
    rect: CropInfo;
}

export interface PhotoSize {
    height: number,
    url: string,
    type: 's' | 'm' | 'x' | 'o' | 'p' | 'q' | 'r',
    width: number
};
export interface PhotoObject {
    album_id: number,
    date: number,
    id: number,
    owner_id: number,
    has_tags: boolean,
    access_key?: string,
    sizes: PhotoSize[],
    text?: string
}
export type File = RequestDataFile | string;
export type FileObject = File | Promise<File>;

export default class PhotosAPI extends API {
    private api_name: string = "photos";

    public async getMessagesUploadServer(peer_id: number): Promise<MessageUplodaServer> {
        let method = this.api_name + ".getMessagesUploadServer";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);

        return await this.call<MessageUplodaServer>(method, { peer_id: peer_id });
    }
    public async saveMessagesPhoto(info: SaveMessagesPhotoInfo): Promise<PhotoObject[]> {
        let method = this.api_name + ".saveMessagesPhoto";
        if (!this.checkValid("group", "user"))
            throw new InvokeMethodException(method, this.type);
        if (info.photo == "[]")
            throw new ReferenceError("Don't load photo");

        return await this.call<PhotoObject[]>(method, info);
    }

    public async uploadPhoto(server: MessageUplodaServer, photo: RequestDataFile): Promise<SaveMessagesPhotoInfo> {
        return JSON.parse((await request({
            url: server.upload_url,
            data: { "photo": photo }
        })).toString());
    }

    public async uploadMessagePhoto(peer_id: number, photo: FileObject): Promise<PhotoObject> {
        if (photo instanceof Promise)
            photo = await photo;

        if (typeof photo === "string")
            photo = { filename: path.basename(photo), content: await fs.readFile(photo) };

        return (await this.saveMessagesPhoto(await this.uploadPhoto(await this.getMessagesUploadServer(peer_id), photo)))[0];
    }

    public async uploadMessagePhotos(peer_id: number, photo: FileObject[]): Promise<PhotoObject[]> {
        const promises = photo.map<Promise<PhotoObject>>(e => this.uploadMessagePhoto(peer_id, e));
        return await Promise.all<PhotoObject>(promises);
    }
}