import { WasteHistory } from '../entities';
import { Repository } from 'typeorm';
export declare class WasteHistoryService {
    private wasteHistoryRepository;
    constructor(wasteHistoryRepository: Repository<WasteHistory>);
    getAllHistory(page?: number, limit?: number): Promise<{
        data: {
            id: number;
            waste_category: string;
            wastesid: number | null;
            waste_meterialid: number;
            material_name: string;
            name_waste: string;
            create_at: Date;
            amount: number;
            record_type: string;
            user_id: number;
        }[];
        pagination: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    getUserHistory(userId: string): Promise<{
        id: number;
        waste_category: string;
        wastesid: number | null;
        waste_meterialid: number;
        material_name: string;
        name_waste: string;
        create_at: Date;
        amount: number;
        record_type: string;
        user_id: number;
    }[]>;
    private mapHistoryData;
    findHistoryDetailById(historyId: number): Promise<{
        id: number;
        name: string;
        waste_image: string;
        amount: number;
        record_type: string;
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
}
