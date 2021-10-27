import { APIInfo } from "./API/API.js";
import GroupsAPI from "./API/groups.js";
import MessagesAPI from "./API/messages.js";
import PhotosAPI from "./API/photos.js";
import UsersAPI from "./API/users.js";
import NodeVK from "./NodeVK.js";
interface SessionInfo {
	token: string;
	version?: string;
}
class Session {
	constructor(info: SessionInfo) {
		this._info = {
			version: NodeVK.VERSION,
			...info
		};

		this.groups = new GroupsAPI(this._info);
		this.users = new UsersAPI(this._info);
		this.messages = new MessagesAPI(this._info);
		this.photos = new PhotosAPI(this._info);
	}

	private _info: APIInfo;

	public readonly groups: GroupsAPI;
	public readonly users: UsersAPI;
	public readonly messages: MessagesAPI;
	public readonly photos: PhotosAPI;

	public get token() {
		return this._info.token;
	}

	public get version() {
		return this._info.version;
	}

}

export default Session;
