interface IRequestParam {
    key:string,
    value:string
}

export interface VKAPIError {
    error_code: number,
    error_msg: string,
    request_params: IRequestParam[]
}

export default class VKAPIException extends Error {
    public readonly code: number;
    public readonly params: IRequestParam[];
    public readonly source: VKAPIError;

    public constructor(json: VKAPIError) {
        super(json.error_msg);
        this.source = json;
        this.code = json.error_code;
        this.params = json.request_params;
    }
}