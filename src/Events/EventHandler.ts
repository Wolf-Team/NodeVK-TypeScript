export default interface EventHandler {
    (...args: any): boolean | Promise<boolean>;
}