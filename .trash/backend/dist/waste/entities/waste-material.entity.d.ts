import { WasteCategory } from './waste-category.entity';
import { MaterialGuide } from './material-guide.entity';
import { WasteHistory } from './waste-history.entity';
export declare class WasteMaterial {
    id: number;
    name: string;
    emission_factor: number;
    unit: string;
    created_at: Date;
    updated_at: Date;
    meterial_image: string;
    waste_categoriesid: number;
    wasteCategory: WasteCategory;
    materialGuides: MaterialGuide[];
    wasteHistories: WasteHistory[];
}
