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
exports.SchedulerSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scheduler_settings_entity_1 = require("../entities/scheduler-settings.entity");
const waste_material_entity_1 = require("../../waste/entities/waste-material.entity");
const waste_management_method_entity_1 = require("../../waste/entities/waste-management-method.entity");
const DEFAULT_SETTINGS = [
    {
        key: 'cron_time',
        value: '02:00',
        label: 'เวลาคำนวณอัตโนมัติ',
        description: 'เวลาที่ระบบจะคำนวณ Carbon Footprint อัตโนมัติ (รูปแบบ HH:mm)',
        type: 'time',
    },
    {
        key: 'auto_calculate_enabled',
        value: 'true',
        label: 'เปิดใช้งานการคำนวณอัตโนมัติ',
        description: 'เปิด/ปิดการคำนวณอัตโนมัติรายวัน',
        type: 'boolean',
    },
    {
        key: 'default_management_method_id',
        value: '',
        label: 'วิธีการจัดการขยะที่ใช้คำนวณ',
        description: 'เลือกวิธีการจัดการขยะที่จะใช้คำนวณ Transport Emission',
        type: 'select',
    },
];
let SchedulerSettingsService = class SchedulerSettingsService {
    settingsRepository;
    wasteMaterialRepository;
    wasteManagementMethodRepository;
    constructor(settingsRepository, wasteMaterialRepository, wasteManagementMethodRepository) {
        this.settingsRepository = settingsRepository;
        this.wasteMaterialRepository = wasteMaterialRepository;
        this.wasteManagementMethodRepository = wasteManagementMethodRepository;
    }
    async onModuleInit() {
        for (const setting of DEFAULT_SETTINGS) {
            const existing = await this.settingsRepository.findOne({
                where: { key: setting.key },
            });
            if (!existing) {
                await this.settingsRepository.save({
                    key: setting.key,
                    value: setting.value,
                    label: setting.label,
                    description: setting.description,
                    type: setting.type,
                });
            }
        }
    }
    allowedSettingKeys = [
        'cron_time',
        'auto_calculate_enabled',
        'default_management_method_id',
    ];
    async getAllSettings() {
        const allSettings = await this.settingsRepository.find({
            order: { key: 'ASC' },
        });
        return allSettings.filter((s) => this.allowedSettingKeys.includes(s.key));
    }
    async getSetting(key) {
        const setting = await this.settingsRepository.findOne({
            where: { key },
        });
        return setting?.value || null;
    }
    async getSettingAsNumber(key, defaultValue) {
        const value = await this.getSetting(key);
        if (value === null)
            return defaultValue;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    async getSettingAsBoolean(key, defaultValue) {
        const value = await this.getSetting(key);
        if (value === null)
            return defaultValue;
        return value === 'true';
    }
    async updateSetting(key, value) {
        const setting = await this.settingsRepository.findOne({
            where: { key },
        });
        if (!setting) {
            return null;
        }
        setting.value = value;
        return this.settingsRepository.save(setting);
    }
    async updateSettings(updates) {
        for (const update of updates) {
            await this.updateSetting(update.key, update.value);
        }
    }
    async getAllWasteMaterials() {
        return this.wasteMaterialRepository.find({
            order: { name: 'ASC' },
        });
    }
    async updateEmissionFactor(materialId, emissionFactor, unit) {
        const material = await this.wasteMaterialRepository.findOne({
            where: { id: materialId },
        });
        if (!material) {
            return null;
        }
        material.emission_factor = emissionFactor;
        if (unit) {
            material.unit = unit;
        }
        return this.wasteMaterialRepository.save(material);
    }
    async getCronExpression() {
        const cronTime = await this.getSetting('cron_time');
        if (cronTime) {
            const [hour, minute] = cronTime.split(':').map(Number);
            return `${minute || 0} ${hour || 2} * * *`;
        }
        return '0 2 * * *';
    }
    async getAllWasteManagementMethods() {
        return this.wasteManagementMethodRepository.find({
            order: { id: 'ASC' },
        });
    }
    async createWasteManagementMethod(data) {
        const method = this.wasteManagementMethodRepository.create(data);
        return this.wasteManagementMethodRepository.save(method);
    }
    async updateWasteManagementMethod(id, data) {
        const method = await this.wasteManagementMethodRepository.findOne({
            where: { id },
        });
        if (!method) {
            return null;
        }
        if (data.name !== undefined)
            method.name = data.name;
        if (data.transport_km !== undefined)
            method.transport_km = data.transport_km;
        if (data.transport_co2e_per_km !== undefined)
            method.transport_co2e_per_km = data.transport_co2e_per_km;
        return this.wasteManagementMethodRepository.save(method);
    }
    async deleteWasteManagementMethod(id) {
        const result = await this.wasteManagementMethodRepository.delete(id);
        return (result.affected || 0) > 0;
    }
};
exports.SchedulerSettingsService = SchedulerSettingsService;
exports.SchedulerSettingsService = SchedulerSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scheduler_settings_entity_1.SchedulerSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(waste_material_entity_1.WasteMaterial)),
    __param(2, (0, typeorm_1.InjectRepository)(waste_management_method_entity_1.WasteManagementMethod)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SchedulerSettingsService);
//# sourceMappingURL=scheduler-settings.service.js.map