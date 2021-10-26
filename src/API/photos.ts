interface PhotoSize {
	height: number,
	url: string,
	type: 's' | 'm' | 'x' | 'o' | 'p' | 'q' | 'r',
	width: number
};
interface PhotoObject {
	album_id: number,
	date: number,
	id: number,
	owner_id: number,
	has_tags: boolean,
	access_key?: string,
	sizes: PhotoSize[],
	text?: string
}

interface CropInfo {
	x: number;
	y: number;
	x2: number;
	y2: number;
}

interface CropPhotoInfo {
	photo: { type: "photo", photo: PhotoObject };
	crop: CropInfo;
	rect: CropInfo;
}

export { CropPhotoInfo, PhotoObject };
