import { WasteSortingService } from '../services/waste-sorting.service';
export declare class WasteSortingController {
    private readonly wasteService;
    constructor(wasteService: WasteSortingService);
    getMaterialDetail(id: number): Promise<{
        material_id: number;
        material_name: string;
        material_image: string;
        waste_category: {
            id: number;
            name: string;
        }[];
        create_at: Date;
    }>;
    createRecord(materialId: number, weight: number, userId: number): Promise<{
        meterial_image: string;
        meterial_name: string;
        category: {
            id: number;
            name: string;
        }[];
        weight: number;
        create_at: Date;
    }>;
    getMaterials(page?: number, categoryName?: string, materialName?: string): Promise<{
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
    getAllCategories(): Promise<{
        data: import("../entities").WasteCategory[];
    }>;
}
