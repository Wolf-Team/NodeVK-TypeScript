import { tRequestData, IRequestData } from "./request.js";


const NEW_LINE = "\r\n";
interface DataFile {
	filename: string;
	mime?: string;
	content: Buffer | string
}
type Data = tRequestData | DataFile;

class FormData implements IRequestData {
	private static random(min: number = 0, max: number = 100): number {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	private static genStr(length: number = 12): string {
		const charset = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
		let str = "";
		for (; length > 0; length--)
			str += charset[this.random(0, 62)];
		return str;
	}

	private boundary: string;
	private data: NodeJS.Dict<Data> = {};

	constructor() {
		this.boundary = `-------------${FormData.genStr()}`;
	}

	public append(name: string, data: Data) {
		this.data[name] = data;
		return this;
	}

	get length(): number {
		const bound_l = this.boundary.length;

		let length = 4 + bound_l;
		for (const field in this.data) {
			length += 49 + bound_l + field.length;

			const data = this.data[field];
			if (typeof data !== "object") {
				length += data.toString().length;
			} else {
				length += 29 + data.filename.length + data.content.length + (data.mime ? data.mime.length : 10);
			}
		}

		return length;
	}
	public getBoundary(): string {
		return this.boundary;
	}

	public toString(): string {
		let str = "";

		for (const field in this.data) {
			const data = this.data[field];

			str += `--${this.boundary}` + NEW_LINE + `Content-Disposition: form-data; name="${field}"`;

			if (typeof data === "object")
				str += `; filename="${data.filename}"` + NEW_LINE + `Content-Type: ${data.mime || "text/plain"}`;

			str += NEW_LINE + NEW_LINE;
			if (typeof data === "object") {
				if (data.content instanceof Buffer)
					str += data.content.toString("binary");
				else
					str += data.content;
			} else {
				str += data;
			}
			str += NEW_LINE;
		}
		str += `--${this.boundary}--`;

		return str;
	}

	public toBody() { return this.toString(); }
}

export default FormData;
export { DataFile };
