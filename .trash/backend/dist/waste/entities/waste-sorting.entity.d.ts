import { Waste } from './waste.entity';
export declare class WasteSorting {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    wastesid: number;
    waste: Waste;
}
