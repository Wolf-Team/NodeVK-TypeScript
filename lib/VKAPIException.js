var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var VKAPIException = /** @class */ (function (_super) {
    __extends(VKAPIException, _super);
    function VKAPIException(json) {
        var _this = _super.call(this, json.error_msg) || this;
        _this.source = json;
        _this.code = json.error_code;
        _this.params = json.request_params;
        return _this;
    }
    return VKAPIException;
}(Error));
export default VKAPIException;
