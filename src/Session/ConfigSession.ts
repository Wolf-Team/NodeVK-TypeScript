export default interface ConfigSession {
    version: string,
    debug?:boolean,
    url?: string
}

const DefaultConfigSession: ConfigSession = {
    version: "5.126",
    debug:false,
    url: "https://api.vk.com/method/"
};

export function getDefaultConfig(){
    return Object.assign({}, DefaultConfigSession);
}