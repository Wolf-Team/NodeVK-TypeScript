export interface PhotoSize {
    height: number;
    url: string;
    type: 's' | 'm' | 'x' | 'o' | 'p' | 'q' | 'r';
    width: number;
}
export interface AttachmentPhoto {
    type: 'photo';
    photo: {
        album_id: number;
        date: number;
        id: number;
        owner_id: number;
        has_tags: boolean;
        access_key?: string;
        sizes: PhotoSize[];
        text?: string;
    };
}
export declare type Attachment = AttachmentPhoto;
