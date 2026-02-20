import { WasteMaterial } from './../entities/waste-material.entity';
import { Repository } from 'typeorm';
import { WasteCategory, WasteHistory } from '../entities';
export declare class WasteSortingService {
    private wasteCategoryRepository;
    private wasteHistoryRepo;
    private wasteMaterialRepo;
    constructor(wasteCategoryRepository: Repository<WasteCategory>, wasteHistoryRepo: Repository<WasteHistory>, wasteMaterialRepo: Repository<WasteMaterial>);
    findByMaterialId(materialId: number): Promise<{
        material_id: number;
        material_name: string;
        material_image: string;
        waste_category: {
            id: number;
            name: string;
        }[];
        create_at: Date;
    }>;
    recordWasteWeight(materialId: number, weight: number, userId: number): Promise<{
        meterial_image: string;
        meterial_name: string;
        category: {
            id: number;
            name: string;
        }[];
        weight: number;
        create_at: Date;
    }>;
    findAllCategories(): Promise<{
        data: WasteCategory[];
    }>;
    findMeterialsAll(page?: number, categoryName?: string, materialName?: string): Promise<{
        data: {
            id: number;
            name: string;
            meterial_image: string;
            waste_categoriesid: {
                id: number;
                name: string;
            } | null;
        }[];
        pagination: {
            total_items: number;
            per_page: number;
            current_page: number;
            total_pages: number;
            page_info: string;
        };
    }>;
}
