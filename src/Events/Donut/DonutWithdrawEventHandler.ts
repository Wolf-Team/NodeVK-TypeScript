import EventHandler from "../EventHandler.js";

export interface DonutWithdrawEvent {
    amount: number,
    amount_without_fee: number
}


export default interface DonutWithdrawEventHandler extends EventHandler {
    (message: DonutWithdrawEvent): boolean | Promise<boolean>;
}