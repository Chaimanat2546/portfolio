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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerController = void 0;
const common_1 = require("@nestjs/common");
const carbon_footprint_scheduler_service_1 = require("../services/carbon-footprint-scheduler.service");
const carbon_footprint_calculator_service_1 = require("../services/carbon-footprint-calculator.service");
const scheduler_settings_service_1 = require("../services/scheduler-settings.service");
let SchedulerController = class SchedulerController {
    carbonFootprintSchedulerService;
    carbonFootprintCalculatorService;
    schedulerSettingsService;
    constructor(carbonFootprintSchedulerService, carbonFootprintCalculatorService, schedulerSettingsService) {
        this.carbonFootprintSchedulerService = carbonFootprintSchedulerService;
        this.carbonFootprintCalculatorService = carbonFootprintCalculatorService;
        this.schedulerSettingsService = schedulerSettingsService;
    }
    async triggerCarbonFootprintCalculation() {
        const result = await this.carbonFootprintSchedulerService.triggerManualCalculation();
        return {
            success: true,
            message: 'Carbon footprint calculation completed',
            data: result,
        };
    }
    async getCarbonFootprintStats() {
        const stats = await this.carbonFootprintSchedulerService.getCalculationStats();
        return {
            success: true,
            data: stats,
        };
    }
    async getPendingWasteRecords(limit) {
        const records = await this.carbonFootprintSchedulerService.getPendingWasteRecords(limit ? parseInt(limit, 10) : 50);
        return {
            success: true,
            data: records,
        };
    }
    async getAllSettings() {
        const settings = await this.schedulerSettingsService.getAllSettings();
        return {
            success: true,
            data: settings,
        };
    }
    async updateSetting(key, body) {
        const setting = await this.schedulerSettingsService.updateSetting(key, body.value);
        if (!setting) {
            return {
                success: false,
                error: `Setting '${key}' not found`,
            };
        }
        return {
            success: true,
            data: setting,
        };
    }
    async updateSettings(body) {
        await this.schedulerSettingsService.updateSettings(body.updates);
        const settings = await this.schedulerSettingsService.getAllSettings();
        return {
            success: true,
            message: 'Settings updated successfully',
            data: settings,
        };
    }
    async updateEmissionFactor(id, body) {
        const materialId = parseInt(id, 10);
        if (isNaN(materialId)) {
            return {
                success: false,
                error: 'Invalid material ID',
            };
        }
        const material = await this.schedulerSettingsService.updateEmissionFactor(materialId, body.emissionFactor, body.unit);
        if (!material) {
            return {
                success: false,
                error: `Material with ID ${id} not found`,
            };
        }
        return {
            success: true,
            message: 'Emission factor updated successfully',
            data: material,
        };
    }
    calculateSimple(amount, emissionFactor) {
        const amountNum = parseFloat(amount);
        const emissionFactorNum = parseFloat(emissionFactor);
        if (isNaN(amountNum) || isNaN(emissionFactorNum)) {
            return {
                success: false,
                error: 'amount and emissionFactor must be valid numbers',
            };
        }
        const carbonFootprint = this.carbonFootprintCalculatorService.calculate(amountNum, emissionFactorNum);
        return {
            success: true,
            data: {
                carbonFootprint,
                amount: amountNum,
                emissionFactor: emissionFactorNum,
                unit: 'kg CO2e',
            },
        };
    }
    async calculateByMaterial(body) {
        try {
            const result = await this.carbonFootprintCalculatorService.calculateByMaterialId(body.amount, body.wasteMaterialId);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async calculateMultiple(body) {
        try {
            const result = await this.carbonFootprintCalculatorService.calculateMultiple(body.items);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async getAllMaterials() {
        const materials = await this.carbonFootprintCalculatorService.getAllMaterialsWithEmissionFactor();
        return {
            success: true,
            data: materials,
        };
    }
    async getAllManagementMethods() {
        const methods = await this.schedulerSettingsService.getAllWasteManagementMethods();
        return {
            success: true,
            data: methods,
        };
    }
    async createManagementMethod(body) {
        if (!body.name) {
            return {
                success: false,
                error: 'Name is required',
            };
        }
        const method = await this.schedulerSettingsService.createWasteManagementMethod(body);
        return {
            success: true,
            message: 'Management method created successfully',
            data: method,
        };
    }
    async updateManagementMethod(id, body) {
        const methodId = parseInt(id, 10);
        if (isNaN(methodId)) {
            return {
                success: false,
                error: 'Invalid method ID',
            };
        }
        const method = await this.schedulerSettingsService.updateWasteManagementMethod(methodId, body);
        if (!method) {
            return {
                success: false,
                error: `Management method with ID ${id} not found`,
            };
        }
        return {
            success: true,
            message: 'Management method updated successfully',
            data: method,
        };
    }
    async deleteManagementMethod(id) {
        const methodId = parseInt(id, 10);
        if (isNaN(methodId)) {
            return {
                success: false,
                error: 'Invalid method ID',
            };
        }
        const deleted = await this.schedulerSettingsService.deleteWasteManagementMethod(methodId);
        if (!deleted) {
            return {
                success: false,
                error: `Management method with ID ${id} not found`,
            };
        }
        return {
            success: true,
            message: 'Management method deleted successfully',
        };
    }
};
exports.SchedulerController = SchedulerController;
__decorate([
    (0, common_1.Post)('trigger-carbon-footprint'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "triggerCarbonFootprintCalculation", null);
__decorate([
    (0, common_1.Get)('carbon-footprint/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getCarbonFootprintStats", null);
__decorate([
    (0, common_1.Get)('carbon-footprint/pending'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getPendingWasteRecords", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getAllSettings", null);
__decorate([
    (0, common_1.Put)('settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "updateSetting", null);
__decorate([
    (0, common_1.Put)('settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Put)('materials/:id/emission-factor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "updateEmissionFactor", null);
__decorate([
    (0, common_1.Get)('calculate'),
    __param(0, (0, common_1.Query)('amount')),
    __param(1, (0, common_1.Query)('emissionFactor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SchedulerController.prototype, "calculateSimple", null);
__decorate([
    (0, common_1.Post)('calculate-by-material'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "calculateByMaterial", null);
__decorate([
    (0, common_1.Post)('calculate-multiple'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "calculateMultiple", null);
__decorate([
    (0, common_1.Get)('materials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getAllMaterials", null);
__decorate([
    (0, common_1.Get)('management-methods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "getAllManagementMethods", null);
__decorate([
    (0, common_1.Post)('management-methods'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "createManagementMethod", null);
__decorate([
    (0, common_1.Put)('management-methods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "updateManagementMethod", null);
__decorate([
    (0, common_1.Delete)('management-methods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulerController.prototype, "deleteManagementMethod", null);
exports.SchedulerController = SchedulerController = __decorate([
    (0, common_1.Controller)('scheduler'),
    __metadata("design:paramtypes", [carbon_footprint_scheduler_service_1.CarbonFootprintSchedulerService,
        carbon_footprint_calculator_service_1.CarbonFootprintCalculatorService,
        scheduler_settings_service_1.SchedulerSettingsService])
], SchedulerController);
//# sourceMappingURL=scheduler.controller.js.map