import EventHandler, { EventReturn } from "../EventHandler.js";

export interface DonutWithdrawErrorEvent {
    reason: string
}

export default interface DonutWithdrawErrorEventHandler extends EventHandler {
    (message: DonutWithdrawErrorEvent): EventReturn<boolean | void>;

}