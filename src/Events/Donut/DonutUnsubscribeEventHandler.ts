import EventHandler from "../EventHandler.js";

export interface DonutUnsubscribeEvent {
    user_id:number
}

export default interface DonutUnsubscribeEventHandler extends EventHandler {
    (message: DonutUnsubscribeEvent): boolean | Promise<boolean>;
}