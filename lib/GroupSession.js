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
import Session from "./Session.js";
var GroupSession = /** @class */ (function (_super) {
    __extends(GroupSession, _super);
    function GroupSession(token, config) {
        var _this = _super.call(this, config) || this;
        _this.token = token;
        return _this;
    }
    GroupSession.prototype.invoke_method = function (method, params) {
        params.access_token = this.token;
        return _super.prototype.invoke_method.call(this, method, params);
    };
    return GroupSession;
}(Session));
export default GroupSession;
