import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    private readonly uploadPath;
    constructor(configService: ConfigService);
    private ensureUploadDirectory;
    saveProfilePicture(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    deleteProfilePicture(filename: string): Promise<void>;
}
