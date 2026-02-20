import { CreateWasteRecordDto } from '../dto/create-waste-record.dto';
import { WasteScannerService } from '../services/waste-scanbarcode.service';
export declare class WasteScannerController {
    private readonly wasteService;
    constructor(wasteService: WasteScannerService);
    scanBarcode(barcode: number): Promise<{
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
    recordWaste(createWasteRecordDto: CreateWasteRecordDto): Promise<{
        message: string;
        data: {
            type: string;
            amount: number;
        };
    }>;
}
