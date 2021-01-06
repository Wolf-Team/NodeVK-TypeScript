import http from "http";
import https from "https";
import { URL, URLSearchParams } from "url";
export default function request(_url, data) {
    return new Promise((resolve, reject) => {
        let url = new URL(_url);
        let protocol = /https/.test(url.protocol) ? https : http;
        url.search = new URLSearchParams(data).toString();
        let request = protocol.request(url, {}, (response) => {
            let buffers = [];
            response.on("data", (c) => {
                buffers.push(c);
            });
            response.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
            response.on('error', reject);
        });
        request.end();
    });
}
