import { APIInfo } from "./API/API.js";
import GroupsAPI from "./API/groups.js";

class Session {
	public readonly groups: GroupsAPI;

	constructor(info: APIInfo) {
		this.groups = new GroupsAPI(info);
	}
}

export default Session;
