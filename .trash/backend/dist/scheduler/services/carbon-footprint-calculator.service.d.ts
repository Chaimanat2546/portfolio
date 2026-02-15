import { Repository } from 'typeorm';
import { WasteMaterial } from '../../waste/entities/waste-material.entity';
export interface CarbonFootprintInput {
    amount: number;
    wasteMaterialId?: number;
    emissionFactor?: number;
}
export interface CarbonFootprintResult {
    carbonFootprint: number;
    amount: number;
    emissionFactor: number;
    unit: string;
}
export declare class CarbonFootprintCalculatorService {
    private readonly wasteMaterialRepository;
    constructor(wasteMaterialRepository: Repository<WasteMaterial>);
    calculate(amount: number, emissionFactor: number): number;
    calculateByMaterialId(amount: number, wasteMaterialId: number): Promise<CarbonFootprintResult>;
    calculateMultiple(items: Array<{
        amount: number;
        wasteMaterialId: number;
    }>): Promise<{
        total: number;
        breakdown: CarbonFootprintResult[];
    }>;
    getAllMaterialsWithEmissionFactor(): Promise<Array<{
        id: number;
        name: string;
        emissionFactor: number | null;
        unit: string | null;
    }>>;
}
