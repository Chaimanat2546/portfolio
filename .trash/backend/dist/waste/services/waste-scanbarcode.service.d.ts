import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Waste, WasteCategory, WasteHistory } from '../entities';
import { CreateWasteRecordDto } from '../dto/create-waste-record.dto';
export declare class WasteScannerService {
    private wasteRepository;
    private userRepository;
    private wasteCategoryRepository;
    private wasteHistoryRepository;
    constructor(wasteRepository: Repository<Waste>, userRepository: Repository<User>, wasteCategoryRepository: Repository<WasteCategory>, wasteHistoryRepository: Repository<WasteHistory>);
    findByBarcode(barcode: number): Promise<{
        id: number;
        barcode: number;
        name: string;
        waste_image: string;
        amount: number;
        create_at: Date;
        waste_categoriesid: {
            id: number;
            name: string;
        }[];
        user_id: number;
        waste_sorting: {
            id: number;
            name: string;
            description: string;
        }[];
        material_guides: {
            id: number;
            guide_image: string;
            recommendation: string;
            waste_meterial_name: string;
        }[];
    }>;
    recordWaste(dto: CreateWasteRecordDto): Promise<{
        message: string;
        data: {
            type: string;
            amount: number;
        };
    }>;
    findAllCategories(): Promise<{
        data: WasteCategory[];
    }>;
}
