import { WasteCategory } from './waste-category.entity';
import { User } from '../../users/user.entity';
import { WasteHistory } from './waste-history.entity';
import { WasteSorting } from './waste-sorting.entity';
import { MaterialGuide } from './material-guide.entity';
export declare class Waste {
    id: number;
    name: string;
    waste_image: string;
    barcode: number;
    create_at: Date;
    waste_categoriesid: number;
    userid: number;
    wasteCategory: WasteCategory;
    user: User;
    wasteHistories: WasteHistory[];
    wasteSortings: WasteSorting[];
    materialGuides: MaterialGuide[];
}
