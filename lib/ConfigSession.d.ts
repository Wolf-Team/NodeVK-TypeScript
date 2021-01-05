export default interface ConfigSession {
    version: string;
    debug?: boolean;
    url?: string;
}
export declare function getDefaultConfig(): ConfigSession;
