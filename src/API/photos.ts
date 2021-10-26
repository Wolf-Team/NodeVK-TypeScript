import API from "./API.js";
import { basename } from "path";
import { readFile } from "fs/promises";
// import request from "../utils/old_req.js";
import request from "../utils/request.js";
import FormData, { DataFile } from "../utils/FormData.js";


interface PhotoSize {
	height: number,
	url: string,
	type: 's' | 'm' | 'x' | 'o' | 'p' | 'q' | 'r',
	width: number
};
interface PhotoObject {
	album_id: number,
	date: number,
	id: number,
	owner_id: number,
	has_tags: boolean,
	access_key?: string,
	sizes: PhotoSize[],
	text?: string
}

interface CropInfo {
	x: number;
	y: number;
	x2: number;
	y2: number;
}

interface CropPhotoInfo {
	photo: { type: "photo", photo: PhotoObject };
	crop: CropInfo;
	rect: CropInfo;
}

interface MessageUplodaServer {
	upload_url: string;
	album_id: number;
	user_id: number;
}

interface SaveMessagesPhotoInfo {
	photo: string;
	server: string;
	hash: string;
}

export type File = DataFile | string;
export type FileObject = File | Promise<File>;

class PhotosAPI extends API {
	protected name: string = "photos";

	public async getMessagesUploadServer(peer_id: number): Promise<MessageUplodaServer> {
		return await this.invokeMethod<MessageUplodaServer>("getMessagesUploadServer", { peer_id: peer_id });
	}
	public async saveMessagesPhoto(info: SaveMessagesPhotoInfo): Promise<PhotoObject[]> {
		if (info.photo == "[]")
			throw new ReferenceError("Don't load photo");

		return await this.invokeMethod<PhotoObject[]>("saveMessagesPhoto", { ...info });
	}

	public async uploadPhoto(server: MessageUplodaServer, photo: DataFile): Promise<SaveMessagesPhotoInfo> {
		const data = new FormData().append("photo", photo);
		return JSON.parse((<string>await request({
			url: server.upload_url,
			method: "post",
			headers: {
				"content-type": `multipart/form-data; boundary=${data.getBoundary()};`,
				"content-length": data.length
			},
			data
		})));
	}

	public async uploadMessagePhoto(peer_id: number, photo: FileObject): Promise<PhotoObject> {
		if (photo instanceof Promise)
			photo = await photo;

		if (typeof photo === "string")
			photo = { filename: basename(photo), content: await readFile(photo) };

		return (
			await this.saveMessagesPhoto(
				await this.uploadPhoto(
					await this.getMessagesUploadServer(peer_id),
					photo
				)
			)
		)[0];
	}

	public async uploadMessagePhotos(peer_id: number, photo: FileObject[]): Promise<PhotoObject[]> {
		const promises = photo.map<Promise<PhotoObject>>(e => this.uploadMessagePhoto(peer_id, e));
		return await Promise.all<PhotoObject>(promises);
	}
}

export default PhotosAPI;

export { CropPhotoInfo, PhotoObject };
