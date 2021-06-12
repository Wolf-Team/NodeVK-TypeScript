import EventHandler, { EventReturn } from "../EventHandler.js";

export interface DonutUnsubscribeEvent {
    user_id:number
}

export default interface DonutUnsubscribeEventHandler extends EventHandler {
    (message: DonutUnsubscribeEvent): EventReturn<boolean | void>;
}