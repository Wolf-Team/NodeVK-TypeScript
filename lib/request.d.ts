/// <reference types="node" />
export default function request(_url: string, data: NodeJS.Dict<string | readonly string[]>): Promise<Buffer>;
