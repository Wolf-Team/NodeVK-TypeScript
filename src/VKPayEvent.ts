import { EventHandler } from "./GroupSession.js";

export default interface VKPayEvent{
    from_id:number;
    amount:number;
    description:string;
    date:number;
}

export interface VKPayEventHandler extends EventHandler {
    (message: VKPayEvent): boolean | Promise<boolean>;
}