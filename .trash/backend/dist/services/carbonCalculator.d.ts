import { Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WasteHistory } from '../waste/entities/waste-history.entity';
interface TrashItem {
    id?: number | string;
    weight: number;
    waste_sorting?: Record<string, number> | Array<{
        name: string;
        ratio: number;
    }> | WasteSortingArrayItem[];
    type?: string;
    emission_factor?: number;
}
interface WasteSortingArrayItem {
    name?: string;
    material?: string;
    ratio?: number;
    percentage?: number;
    amount?: number;
}
interface MaterialBreakdown {
    ratio: number;
    weightGrams: number;
    weightKg: number;
    emissionFactor: number;
    carbon: number;
}
interface CalculationResult {
    carbon_footprint: number;
    breakdown: Record<string, MaterialBreakdown>;
    method: 'waste_sorting' | 'single_type';
    weightGrams?: number;
    totalRatio?: number;
}
interface WasteHistoryRecord {
    trash_id: number | string;
    carbon_footprint: number;
    calculation_method: string;
    breakdown: string;
    weight_grams: number;
    calculated_at: string;
}
interface ErrorRecord {
    trash_id: number | string;
    error: string;
}
interface DailyCalculationSummary {
    results: WasteHistoryRecord[];
    errors: ErrorRecord[];
    logs: string[];
    summary: {
        total: number;
        success: number;
        failed: number;
        duration: number;
    };
}
export declare class CarbonFootprintCalculator {
    private entityManager;
    private emissionFactors;
    private materialIdMap;
    private wasteSortingMap;
    private materialGuideMap;
    private debugLogs;
    private maxLogs;
    private logger;
    constructor(entityManager: EntityManager, maxLogs?: number, logger?: Logger);
    loadEmissionFactors(): Promise<void>;
    log(message: string): void;
    getLogs(): string[];
    clearLogs(): void;
    calculate(trash: TrashItem): CalculationResult;
    private calculateFromWasteSorting;
    private calculateFromWasteSortingArray;
    private calculateFromSingleType;
    calculateByWasteId(wasteId: number, wasteHistory?: WasteHistory): Promise<number>;
    private getEmissionFactor;
}
export declare function calculateDailyCarbonFootprint(trashItems: TrashItem[], entityManager: EntityManager, logger?: Logger): Promise<DailyCalculationSummary>;
export type { TrashItem, MaterialBreakdown, CalculationResult, WasteHistoryRecord, ErrorRecord, DailyCalculationSummary, };
