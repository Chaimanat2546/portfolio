import { Repository, EntityManager } from 'typeorm';
import { WasteHistory } from '../../waste/entities/waste-history.entity';
import { SchedulerLock } from '../entities/scheduler-lock.entity';
import { SchedulerSettingsService } from './scheduler-settings.service';
export declare enum CalculationStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    CALCULATED = "calculated",
    FAILED = "failed",
    ERROR = "error"
}
export declare class CarbonFootprintSchedulerService {
    private readonly wasteHistoryRepository;
    private readonly schedulerLockRepository;
    private readonly schedulerSettingsService;
    private readonly entityManager;
    private readonly logger;
    private readonly instanceId;
    constructor(wasteHistoryRepository: Repository<WasteHistory>, schedulerLockRepository: Repository<SchedulerLock>, schedulerSettingsService: SchedulerSettingsService, entityManager: EntityManager);
    handleDailyCarbonFootprintCalculation(): Promise<void>;
    triggerManualCalculation(): Promise<{
        processed: number;
        success: number;
        failed: number;
    }>;
    private processAllPendingRecords;
    private processBatch;
    private calculateCarbonFootprint;
    private acquireLock;
    private releaseLock;
    getCalculationStats(): Promise<{
        pending: number;
        calculated: number;
        failed: number;
        error: number;
    }>;
    getPendingWasteRecords(limit?: number): Promise<Array<{
        id: number;
        amount: number;
        materialName: string;
        status: string;
        created_at: string;
        retryCount: number;
    }>>;
}
