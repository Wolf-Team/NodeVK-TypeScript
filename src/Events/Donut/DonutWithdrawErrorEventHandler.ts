import EventHandler from "../EventHandler.js";

export interface DonutWithdrawErrorEvent {
    reason: string
}

export default interface DonutWithdrawErrorEventHandler extends EventHandler {
    (message: DonutWithdrawErrorEvent): boolean | Promise<boolean>;

}