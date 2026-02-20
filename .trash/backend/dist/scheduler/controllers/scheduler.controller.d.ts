import { CarbonFootprintSchedulerService } from '../services/carbon-footprint-scheduler.service';
import { CarbonFootprintCalculatorService } from '../services/carbon-footprint-calculator.service';
import { SchedulerSettingsService } from '../services/scheduler-settings.service';
export declare class SchedulerController {
    private readonly carbonFootprintSchedulerService;
    private readonly carbonFootprintCalculatorService;
    private readonly schedulerSettingsService;
    constructor(carbonFootprintSchedulerService: CarbonFootprintSchedulerService, carbonFootprintCalculatorService: CarbonFootprintCalculatorService, schedulerSettingsService: SchedulerSettingsService);
    triggerCarbonFootprintCalculation(): Promise<{
        success: boolean;
        message: string;
        data: {
            processed: number;
            success: number;
            failed: number;
        };
    }>;
    getCarbonFootprintStats(): Promise<{
        success: boolean;
        data: {
            pending: number;
            calculated: number;
            failed: number;
            error: number;
        };
    }>;
    getPendingWasteRecords(limit?: string): Promise<{
        success: boolean;
        data: {
            id: number;
            amount: number;
            materialName: string;
            status: string;
            created_at: string;
            retryCount: number;
        }[];
    }>;
    getAllSettings(): Promise<{
        success: boolean;
        data: import("../entities/scheduler-settings.entity").SchedulerSettings[];
    }>;
    updateSetting(key: string, body: {
        value: string;
    }): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("../entities/scheduler-settings.entity").SchedulerSettings;
        error?: undefined;
    }>;
    updateSettings(body: {
        updates: Array<{
            key: string;
            value: string;
        }>;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/scheduler-settings.entity").SchedulerSettings[];
    }>;
    updateEmissionFactor(id: string, body: {
        emissionFactor: number;
        unit?: string;
    }): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../../waste/entities").WasteMaterial;
        error?: undefined;
    }>;
    calculateSimple(amount: string, emissionFactor: string): {
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            carbonFootprint: number;
            amount: number;
            emissionFactor: number;
            unit: string;
        };
        error?: undefined;
    };
    calculateByMaterial(body: {
        amount: number;
        wasteMaterialId: number;
    }): Promise<{
        success: boolean;
        data: import("../services/carbon-footprint-calculator.service").CarbonFootprintResult;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    calculateMultiple(body: {
        items: Array<{
            amount: number;
            wasteMaterialId: number;
        }>;
    }): Promise<{
        success: boolean;
        data: {
            total: number;
            breakdown: import("../services/carbon-footprint-calculator.service").CarbonFootprintResult[];
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    getAllMaterials(): Promise<{
        success: boolean;
        data: {
            id: number;
            name: string;
            emissionFactor: number | null;
            unit: string | null;
        }[];
    }>;
    getAllManagementMethods(): Promise<{
        success: boolean;
        data: import("../../waste/entities").WasteManagementMethod[];
    }>;
    createManagementMethod(body: {
        name: string;
        process_type?: number;
        transport_km?: number;
        transport_co2e_per_km?: number;
    }): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../../waste/entities").WasteManagementMethod;
        error?: undefined;
    }>;
    updateManagementMethod(id: string, body: {
        name?: string;
        process_type?: number;
        transport_km?: number;
        transport_co2e_per_km?: number;
    }): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../../waste/entities").WasteManagementMethod;
        error?: undefined;
    }>;
    deleteManagementMethod(id: string): Promise<{
        success: boolean;
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
}
