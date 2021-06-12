import { DonutUnsubscribeEvent } from "./DonutUnsubscribeEventHandler.js";
import EventHandler, { EventReturn } from "../EventHandler.js";

export interface DonutPriceChangeEvent extends DonutUnsubscribeEvent {
    amount_old: number,
    amount_new: number,
    amount_diff: number,
    amount_diff_without_fee: number
}

export default interface DonutPriceChangeEventHandler extends EventHandler {
    (message: DonutPriceChangeEvent):  EventReturn<boolean | void>;
}