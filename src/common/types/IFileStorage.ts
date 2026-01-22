export interface UploadResult {
    url: string;
    key: string;
}

export interface IFileStorage {
    upload(
        file: Buffer,
        fileName: string,
        mimeType: string,
        folder?: string
    ): Promise<UploadResult>;
    delete(key: string): Promise<void>;
    getUrl(key: string): string;
}
