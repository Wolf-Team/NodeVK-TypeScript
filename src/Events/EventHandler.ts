export type EventReturn<T> = T | Promise<T>;
export default interface EventHandler {
    (...args: any): EventReturn<boolean | void>;
}