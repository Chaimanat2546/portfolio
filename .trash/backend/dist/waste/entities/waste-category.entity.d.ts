import { Waste } from './waste.entity';
import { WasteMaterial } from './waste-material.entity';
export declare class WasteCategory {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    wastes: Waste[];
    materials: WasteMaterial[];
}
