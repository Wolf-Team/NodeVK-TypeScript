export default class VKAPIException extends Error {
    constructor(json) {
        super(json.error_msg);
        this.source = json;
        this.code = json.error_code;
        this.params = json.request_params;
    }
}
