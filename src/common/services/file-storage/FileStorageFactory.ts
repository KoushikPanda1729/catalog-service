import { Config } from "../../../config";
import type { IFileStorage } from "../../types/IFileStorage";
import { S3FileStorage } from "./S3FileStorage";

export class FileStorageFactory {
    static create(): IFileStorage {
        const provider = Config.STORAGE_PROVIDER.toLowerCase();

        switch (provider) {
            case "s3":
                return new S3FileStorage();
            default:
                throw new Error(
                    `Unsupported storage provider: ${provider}. Currently only 's3' is supported.`
                );
        }
    }
}
