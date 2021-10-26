import { APIInfo } from "./API/API.js";
import GroupsAPI from "./API/groups.js";
import MessagesAPI from "./API/messages.js";
import UsersAPI from "./API/users.js";

class Session {
	public readonly groups: GroupsAPI;
	public readonly users: UsersAPI;
	public readonly messages: MessagesAPI;

	constructor(info: APIInfo) {
		this.groups = new GroupsAPI(info);
		this.users = new UsersAPI(info);
		this.messages = new MessagesAPI(info);
	}
}

export default Session;
