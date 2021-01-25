import { IMethodParams } from "../app.js";
import request, { RequestDataFile } from "../request.js";
import { VKAPIResponse } from "../Session.js";
import VKAPIException from "../VKAPIException.js";
import API, { InvokeMethodException } from "./api.js";

export interface MessageUplodaServer {
    upload_url: string;
    album_id: number;
    user_id: number;
}

interface SaveMessagesPhotoInfo extends IMethodParams{
    photo: string;
    server: string;
    hash: string;
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
        if(info.photo == "[]")
            throw new ReferenceError("Don't load photo");

        return await this.call<PhotoObject[]>(method, info);
    }

    public async uploadPhoto(server: MessageUplodaServer, photo: RequestDataFile): Promise<SaveMessagesPhotoInfo> {
        return JSON.parse((await request({
            url: server.upload_url,
            data: { "photo": photo }
        })).toString());
    }

    public async uploadMessagePhoto(peer_id: number, photo: RequestDataFile): Promise<PhotoObject> {
        return (await this.saveMessagesPhoto(await this.uploadPhoto(await this.getMessagesUploadServer(peer_id), photo)))[0];
    }
}