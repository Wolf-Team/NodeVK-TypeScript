import API, { CountingResponse, SingleOrArray } from "./api.js";
import { IMethodParams } from "./../Session/Session.js";
import { UserObject } from "./users.js";

type MembersFilter = "friends" | "unsure" | "managers" | "donut";
type MembersSort = "id_asc" | "id_desc" | "time_asc" | "time_desc";


interface GetMembersAdditionalParams extends IMethodParams {
    count?: number,
    offset?: number,
    fields?: string[],
    filter?: MembersFilter,
    sort?: MembersSort
}
interface GetMembersAdditionalParamsWithFields extends GetMembersAdditionalParams {
    fields: string[]
}

interface IsMemberInfo {
    member: 0 | 1,
    user_id: number,
    request?: 0 | 1,
    invitation?: 0 | 1,
    can_invite?: 0 | 1,
    can_recall?: 0 | 1,
}

class GroupsAPI extends API {
    private api_name: string = "groups";

    public getMembers(group_id: number, params: GetMembersAdditionalParamsWithFields): Promise<CountingResponse<UserObject>>;
    public getMembers(group_id: number, params?: GetMembersAdditionalParams): Promise<CountingResponse<number>>;
    public async getMembers(group_id: number, params: GetMembersAdditionalParams = {}): Promise<CountingResponse<number | UserObject>> {
        const method = this.api_name + ".getMembers";
        params.group_id = group_id;
        return await this.call<CountingResponse<number | UserObject>>(method, params);
    }


    public async isMembers(group_id: number, user_ids: number, extended: true): Promise<IsMemberInfo>;
    public async isMembers(group_id: number, user_ids: number, extended?: false): Promise<number>;

    public async isMembers(group_id: number, user_ids: number[], extended: true): Promise<IsMemberInfo[]>;
    public async isMembers(group_id: number, user_ids: number[], extended?: false): Promise<number[]>;

    public async isMembers(group_id: number, users_ids: number | number[], extended: boolean = false): Promise<SingleOrArray<number | IsMemberInfo>> {
        const method = this.api_name + ".isMember";
        const is_array = Array.isArray(users_ids);

        let params: IMethodParams = { group_id: group_id };

        if (is_array)
            params.user_ids = users_ids;
        else
            params.user_id = users_ids;

        if (extended)
            params.extended = 1;

        return await this.call<SingleOrArray<number | IsMemberInfo>>(method, params);
    }

    /**
     * WARNING! This method uses the getMembers method and goes through ALL users of the group.
     */
    public async isDonut(group_id: number, users_id: number): Promise<boolean> {
        const startUsers = await this.getMembers(group_id, {
            filter: "donut"
        });

        const countUsers = startUsers.count;
        let iUsers = 1000;
        let users = startUsers.items;

        do {
            if (users.indexOf(users_id) != -1)
                return true;

            users = (await this.getMembers(group_id, {
                filter: "donut",
                offset: iUsers
            })).items;
            iUsers += 1000;

        } while (iUsers < countUsers);

        return false;
    }
}

export default GroupsAPI;