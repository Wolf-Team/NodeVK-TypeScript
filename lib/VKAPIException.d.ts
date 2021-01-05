interface IRequestParam {
    key: string;
    value: string;
}
export interface VKAPIError {
    error_code: number;
    error_msg: string;
    request_params: IRequestParam[];
}
export default class VKAPIException extends Error {
    readonly code: number;
    readonly params: IRequestParam[];
    readonly source: VKAPIError;
    constructor(json: VKAPIError);
}
export {};
