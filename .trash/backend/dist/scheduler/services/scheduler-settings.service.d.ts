import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SchedulerSettings } from '../entities/scheduler-settings.entity';
import { WasteMaterial } from '../../waste/entities/waste-material.entity';
import { WasteManagementMethod } from '../../waste/entities/waste-management-method.entity';
export interface SettingDto {
    key: string;
    value: string;
    label: string;
    description: string;
    type: string;
}
export declare class SchedulerSettingsService implements OnModuleInit {
    private readonly settingsRepository;
    private readonly wasteMaterialRepository;
    private readonly wasteManagementMethodRepository;
    constructor(settingsRepository: Repository<SchedulerSettings>, wasteMaterialRepository: Repository<WasteMaterial>, wasteManagementMethodRepository: Repository<WasteManagementMethod>);
    onModuleInit(): Promise<void>;
    private readonly allowedSettingKeys;
    getAllSettings(): Promise<SchedulerSettings[]>;
    getSetting(key: string): Promise<string | null>;
    getSettingAsNumber(key: string, defaultValue: number): Promise<number>;
    getSettingAsBoolean(key: string, defaultValue: boolean): Promise<boolean>;
    updateSetting(key: string, value: string): Promise<SchedulerSettings | null>;
    updateSettings(updates: Array<{
        key: string;
        value: string;
    }>): Promise<void>;
    getAllWasteMaterials(): Promise<WasteMaterial[]>;
    updateEmissionFactor(materialId: number, emissionFactor: number, unit?: string): Promise<WasteMaterial | null>;
    getCronExpression(): Promise<string>;
    getAllWasteManagementMethods(): Promise<WasteManagementMethod[]>;
    createWasteManagementMethod(data: {
        name: string;
        process_type?: number;
        transport_km?: number;
        transport_co2e_per_km?: number;
    }): Promise<WasteManagementMethod>;
    updateWasteManagementMethod(id: number, data: {
        name?: string;
        process_type?: number;
        transport_km?: number;
        transport_co2e_per_km?: number;
    }): Promise<WasteManagementMethod | null>;
    deleteWasteManagementMethod(id: number): Promise<boolean>;
}
