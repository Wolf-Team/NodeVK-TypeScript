var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDefaultConfig } from './ConfigSession.js';
import VKAPIException from "./VKAPIException.js";
import request from "./request.js";
export default class Session {
    constructor(config) {
        this.config = getDefaultConfig();
        if (config)
            for (let key in config)
                this.config[key] = config[key];
    }
    request(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((yield request(url, params)).toString());
        });
    }
    invokeMethod(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this.config.url}${method}`;
            params.v = this.config.version;
            let result = yield this.request(url, params);
            if (result.error)
                throw new VKAPIException(result.error);
            if (this.config.debug)
                console.log("Get answer:", result);
            return result;
        });
    }
}
