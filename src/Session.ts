import { APIInfo } from "./API/API.js";
import GroupsAPI from "./API/groups.js";
import UsersAPI from "./API/users.js";

class Session {
	public readonly groups: GroupsAPI;
	public readonly users: UsersAPI;

	constructor(info: APIInfo) {
		this.groups = new GroupsAPI(info);
		this.users = new UsersAPI(info);
	}
}

export default Session;
