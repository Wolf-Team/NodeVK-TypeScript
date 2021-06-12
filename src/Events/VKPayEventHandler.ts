import EventHandler, { EventReturn } from "./EventHandler.js";

export interface VKPayEvent {
    from_id: number;
    amount: number;
    description: string;
    date: number;
}

export default interface VKPayEventHandler extends EventHandler {
    (message: VKPayEvent): EventReturn<boolean | void>;
}