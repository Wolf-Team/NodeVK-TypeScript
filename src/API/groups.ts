import API from "./API.js";
import { UserObject } from "./users.js";
import { ListResponse, SingleOrArray } from "../utils/types.js";

enum FilterMembers {
	friends = "friends",
	unsure = "unsure",
	managers = "managers",
	donut = "donut",
	FRIENDS = "friends",
	UNSURE = "unsure",
	MANAGERS = "managers",
	DONUT = "donut",
}
enum Sort {
	ID_ASC = "id_asc",
	ID_DESC = "id_desc",
	TIME_ASC = "time_asc",
	TIME_DESC = "time_desc",
	id_asc = "id_asc",
	id_desc = "id_desc",
	time_asc = "time_asc",
	time_desc = "time_desc"
}

interface GetMemebersParams {
	filter?: FilterMembers;
	sort?: Sort;
	fields?: string[]
}

interface IsMemberInfo {
	member: 0 | 1,
	user_id: number,
	request?: 0 | 1,
	invitation?: 0 | 1,
	can_invite?: 0 | 1,
	can_recall?: 0 | 1,
}


enum GroupClosed {
	Open = 0,
	Closed = 1,
	Private = 2
}
interface GroupInfo {
	id: number;
	name: string;
	screen_name: string;
	is_closed: GroupClosed;
	deactivated?: "deleted" | "banned";
	is_admin?: 0 | 1;
	admin_level?: 1 | 2 | 3;
	is_member?: 0 | 1;
	is_advertiser?: 0 | 1;
	invited_by?: number;
	type: "group" | "page" | "event";
	photo_50: string;
	photo_100: string;
	photo_200: string;

	//Additive fileds -> https://vk.com/dev/objects/group
}

interface LongPoolServer {
	key: string;
	server: string;
	ts: string;
}

class GroupsAPI extends API {
	protected name = "groups";

	public getMembers(group_id: number, offset: number, count: number, params: GetMemebersParams & { fields: string[] }): Promise<ListResponse<UserObject>>;
	public getMembers(group_id: number, offset?: number, count?: number, params?: GetMemebersParams): Promise<ListResponse<number>>;

	public getMembers(group_id: number, offset: number = 0, count: number = 1000, params: GetMemebersParams = {}): Promise<ListResponse<number | UserObject>> {
		return this.invokeMethod("getMembers", {
			offset,
			count,
			group_id,
			...params
		});
	}


	public async isMembers(group_id: number, user_id: number): Promise<number>;
	public async isMembers(group_id: number, user_id: number, extended: true): Promise<IsMemberInfo>;

	public async isMembers(group_id: number, user_ids: number[]): Promise<number[]>;
	public async isMembers(group_id: number, user_ids: number[], extended: true): Promise<IsMemberInfo[]>;

	public async isMembers(group_id: number, users_ids: number | number[], extended: boolean = false): Promise<SingleOrArray<number | IsMemberInfo>> {
		const is_array = Array.isArray(users_ids);

		let params: NodeJS.Dict<any> = { group_id: group_id };

		if (is_array)
			params.user_ids = users_ids;
		else
			params.user_id = users_ids;

		if (extended)
			params.extended = 1;



		return await this.invokeMethod<SingleOrArray<number | IsMemberInfo>>("isMember", params)
	}

	/**
	 * WARNING! This method uses the getMembers method and goes through ALL users of the group.
	 */
	public async isDonut(group_id: number, users_id: number): Promise<boolean> {
		const startUsers = await this.getMembers(group_id, 0, 1000, {
			filter: FilterMembers.DONUT
		});

		const countUsers = startUsers.count;
		let iUsers = 1000;
		let users = startUsers.items;

		do {
			if (users.indexOf(users_id) != -1)
				return true;

			users = (await this.getMembers(group_id, iUsers, 1000, {
				filter: FilterMembers.DONUT
			})).items;
			iUsers += 1000;

		} while (iUsers < countUsers);

		return false;
	}


	public getLongPollServer(group_id: number) {
		return this.invokeMethod<LongPoolServer>("getLongPollServer", { group_id });
	}
}

export default GroupsAPI;
export { FilterMembers, Sort, GroupInfo, LongPoolServer };
