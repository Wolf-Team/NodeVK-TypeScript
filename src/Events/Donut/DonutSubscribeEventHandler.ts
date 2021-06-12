import { DonutUnsubscribeEvent } from "./DonutUnsubscribeEventHandler.js";
import { DonutWithdrawEvent } from "./DonutWithdrawEventHandler.js";
import EventHandler from "../EventHandler.js";

export interface DonutSubscribeEvent extends DonutWithdrawEvent, DonutUnsubscribeEvent { }

export default interface DonutSubscribeEventHandler extends EventHandler {
    (message: DonutSubscribeEvent): boolean | Promise<boolean>;
}