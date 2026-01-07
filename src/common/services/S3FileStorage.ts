import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Config } from "../../config";
import type { IFileStorage, UploadResult } from "./IFileStorage";
import { randomUUID } from "crypto";

export class S3FileStorage implements IFileStorage {
    private s3Client: S3Client;
    private bucket: string;
    private region: string;

    constructor() {
        this.bucket = Config.AWS_S3_BUCKET;
        this.region = Config.AWS_S3_REGION;

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: Config.AWS_S3_ACCESS_KEY_ID,
                secretAccessKey: Config.AWS_S3_SECRET_ACCESS_KEY,
            },
        });
    }

    async upload(
        file: Buffer,
        fileName: string,
        mimeType: string,
        folder = "uploads"
    ): Promise<UploadResult> {
        const fileExtension = fileName.split(".").pop();
        const uniqueFileName = `${randomUUID()}.${fileExtension}`;
        const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file,
            ContentType: mimeType,
        });

        await this.s3Client.send(command);

        const url = this.getUrl(key);

        return {
            url,
            key,
        };
    }

    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        await this.s3Client.send(command);
    }

    getUrl(key: string): string {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
}
