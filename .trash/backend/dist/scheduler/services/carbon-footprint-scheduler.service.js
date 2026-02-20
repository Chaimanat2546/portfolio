"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CarbonFootprintSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarbonFootprintSchedulerService = exports.CalculationStatus = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const waste_history_entity_1 = require("../../waste/entities/waste-history.entity");
const scheduler_lock_entity_1 = require("../entities/scheduler-lock.entity");
const scheduler_settings_service_1 = require("./scheduler-settings.service");
const carbonCalculator_1 = require("../../services/carbonCalculator");
var CalculationStatus;
(function (CalculationStatus) {
    CalculationStatus["PENDING"] = "pending";
    CalculationStatus["PROCESSING"] = "processing";
    CalculationStatus["CALCULATED"] = "calculated";
    CalculationStatus["FAILED"] = "failed";
    CalculationStatus["ERROR"] = "error";
})(CalculationStatus || (exports.CalculationStatus = CalculationStatus = {}));
const LOCK_NAME = 'carbon_footprint_calculation';
const BATCH_SIZE = 100;
const MAX_RETRY_COUNT = 3;
const LOCK_TIMEOUT_MINUTES = 30;
let CarbonFootprintSchedulerService = CarbonFootprintSchedulerService_1 = class CarbonFootprintSchedulerService {
    wasteHistoryRepository;
    schedulerLockRepository;
    schedulerSettingsService;
    entityManager;
    logger = new common_1.Logger(CarbonFootprintSchedulerService_1.name);
    instanceId;
    constructor(wasteHistoryRepository, schedulerLockRepository, schedulerSettingsService, entityManager) {
        this.wasteHistoryRepository = wasteHistoryRepository;
        this.schedulerLockRepository = schedulerLockRepository;
        this.schedulerSettingsService = schedulerSettingsService;
        this.entityManager = entityManager;
        this.instanceId = `instance_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    async handleDailyCarbonFootprintCalculation() {
        this.logger.log('Starting daily carbon footprint calculation...');
        const lockAcquired = await this.acquireLock();
        if (!lockAcquired) {
            this.logger.warn('Could not acquire lock. Another instance might be processing.');
            return;
        }
        try {
            await this.processAllPendingRecords();
            this.logger.log('Daily carbon footprint calculation completed successfully.');
        }
        catch (error) {
            this.logger.error('Error during carbon footprint calculation:', error);
        }
        finally {
            await this.releaseLock();
        }
    }
    async triggerManualCalculation() {
        this.logger.log('Manual carbon footprint calculation triggered...');
        const lockAcquired = await this.acquireLock();
        if (!lockAcquired) {
            throw new Error('Could not acquire lock. Another process is running.');
        }
        try {
            const result = await this.processAllPendingRecords();
            return result;
        }
        finally {
            await this.releaseLock();
        }
    }
    async processAllPendingRecords() {
        let totalProcessed = 0;
        let totalSuccess = 0;
        let totalFailed = 0;
        let hasMore = true;
        while (hasMore) {
            const result = await this.processBatch();
            totalProcessed += result.processed;
            totalSuccess += result.success;
            totalFailed += result.failed;
            hasMore = result.processed === BATCH_SIZE;
        }
        this.logger.log(`Calculation complete. Processed: ${totalProcessed}, Success: ${totalSuccess}, Failed: ${totalFailed}`);
        return {
            processed: totalProcessed,
            success: totalSuccess,
            failed: totalFailed,
        };
    }
    async processBatch() {
        const pendingRecords = await this.wasteHistoryRepository.find({
            where: [
                { calculation_status: CalculationStatus.PENDING },
                { calculation_status: CalculationStatus.FAILED },
            ],
            relations: ['wasteMaterial'],
            take: BATCH_SIZE,
        });
        const recordsToProcess = pendingRecords.filter((record) => record.calculation_status ===
            CalculationStatus.PENDING ||
            (record.calculation_status ===
                CalculationStatus.FAILED &&
                (record.retry_count || 0) < MAX_RETRY_COUNT));
        let success = 0;
        let failed = 0;
        for (const record of recordsToProcess) {
            record.calculation_status = CalculationStatus.PROCESSING;
            record.last_calculation_attempt = new Date();
            await this.wasteHistoryRepository.save(record);
            try {
                const carbonFootprint = await this.calculateCarbonFootprint(record);
                record.carbon_footprint = carbonFootprint;
                record.calculation_status = CalculationStatus.CALCULATED;
                record.error_message = undefined;
                await this.wasteHistoryRepository.save(record);
                success++;
                this.logger.debug(`Calculated carbon footprint for record ${record.id}: ${carbonFootprint}`);
            }
            catch (error) {
                const retryCount = (record.retry_count || 0) + 1;
                record.retry_count = retryCount;
                record.error_message =
                    error instanceof Error ? error.message : 'Unknown error';
                if (retryCount >= MAX_RETRY_COUNT) {
                    record.calculation_status = CalculationStatus.ERROR;
                    this.logger.error(`Record ${record.id} exceeded max retry count. Marking as error.`);
                }
                else {
                    record.calculation_status = CalculationStatus.FAILED;
                    this.logger.warn(`Record ${record.id} failed. Retry count: ${retryCount}/${MAX_RETRY_COUNT}`);
                }
                await this.wasteHistoryRepository.save(record);
                failed++;
            }
        }
        return {
            processed: recordsToProcess.length,
            success,
            failed,
        };
    }
    async calculateCarbonFootprint(wasteHistory) {
        const calculator = new carbonCalculator_1.CarbonFootprintCalculator(this.entityManager, 1000, this.logger);
        const totalCarbon = await calculator.calculateByWasteId(wasteHistory.wastesid ?? 0, wasteHistory);
        return totalCarbon;
    }
    async acquireLock() {
        try {
            let lock = await this.schedulerLockRepository.findOne({
                where: { name: LOCK_NAME },
            });
            if (!lock) {
                lock = this.schedulerLockRepository.create({
                    name: LOCK_NAME,
                    is_locked: false,
                });
                await this.schedulerLockRepository.save(lock);
            }
            if (lock.is_locked && lock.locked_at) {
                const lockAge = Date.now() - lock.locked_at.getTime();
                const maxLockAge = LOCK_TIMEOUT_MINUTES * 60 * 1000;
                if (lockAge > maxLockAge) {
                    this.logger.warn('Lock is stale. Releasing and reacquiring...');
                }
                else {
                    return false;
                }
            }
            lock.is_locked = true;
            lock.locked_at = new Date();
            lock.locked_by = this.instanceId;
            await this.schedulerLockRepository.save(lock);
            const updatedLock = await this.schedulerLockRepository.findOne({
                where: { name: LOCK_NAME },
            });
            return updatedLock?.locked_by === this.instanceId;
        }
        catch (error) {
            this.logger.error('Error acquiring lock:', error);
            return false;
        }
    }
    async releaseLock() {
        try {
            const lock = await this.schedulerLockRepository.findOne({
                where: { name: LOCK_NAME },
            });
            if (lock && lock.locked_by === this.instanceId) {
                lock.is_locked = false;
                lock.locked_at = undefined;
                lock.locked_by = undefined;
                await this.schedulerLockRepository.save(lock);
                this.logger.debug('Lock released successfully.');
            }
        }
        catch (error) {
            this.logger.error('Error releasing lock:', error);
        }
    }
    async getCalculationStats() {
        const [pending, calculated, failed, error] = await Promise.all([
            this.wasteHistoryRepository.count({
                where: { calculation_status: CalculationStatus.PENDING },
            }),
            this.wasteHistoryRepository.count({
                where: { calculation_status: CalculationStatus.CALCULATED },
            }),
            this.wasteHistoryRepository.count({
                where: { calculation_status: CalculationStatus.FAILED },
            }),
            this.wasteHistoryRepository.count({
                where: { calculation_status: CalculationStatus.ERROR },
            }),
        ]);
        return { pending, calculated, failed, error };
    }
    async getPendingWasteRecords(limit = 50) {
        const records = await this.wasteHistoryRepository.find({
            where: [
                { calculation_status: CalculationStatus.PENDING },
                { calculation_status: CalculationStatus.FAILED },
            ],
            relations: ['wasteMaterial'],
            order: { create_at: 'DESC' },
            take: limit,
        });
        return records.map((record) => ({
            id: record.id,
            amount: record.amount || 0,
            materialName: record.wasteMaterial?.name || 'Unknown',
            status: record.calculation_status || 'pending',
            created_at: record.create_at?.toISOString() || '',
            retryCount: record.retry_count || 0,
        }));
    }
};
exports.CarbonFootprintSchedulerService = CarbonFootprintSchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarbonFootprintSchedulerService.prototype, "handleDailyCarbonFootprintCalculation", null);
exports.CarbonFootprintSchedulerService = CarbonFootprintSchedulerService = CarbonFootprintSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(waste_history_entity_1.WasteHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(scheduler_lock_entity_1.SchedulerLock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        scheduler_settings_service_1.SchedulerSettingsService,
        typeorm_2.EntityManager])
], CarbonFootprintSchedulerService);
//# sourceMappingURL=carbon-footprint-scheduler.service.js.map