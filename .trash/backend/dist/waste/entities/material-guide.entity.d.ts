import { WasteMaterial } from './waste-material.entity';
import { Waste } from './waste.entity';
export declare class MaterialGuide {
    id: number;
    guide_image: string;
    recommendation: string;
    weight: number;
    created_at: Date;
    updated_at: Date;
    waste_meterialid: number;
    wastesid: number;
    wasteMaterial: WasteMaterial;
    waste: Waste;
}
