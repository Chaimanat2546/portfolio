"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const scheduler_lock_entity_1 = require("./entities/scheduler-lock.entity");
const scheduler_settings_entity_1 = require("./entities/scheduler-settings.entity");
const carbon_footprint_scheduler_service_1 = require("./services/carbon-footprint-scheduler.service");
const carbon_footprint_calculator_service_1 = require("./services/carbon-footprint-calculator.service");
const scheduler_settings_service_1 = require("./services/scheduler-settings.service");
const scheduler_controller_1 = require("./controllers/scheduler.controller");
const waste_history_entity_1 = require("../waste/entities/waste-history.entity");
const waste_material_entity_1 = require("../waste/entities/waste-material.entity");
const waste_management_method_entity_1 = require("../waste/entities/waste-management-method.entity");
const waste_calculate_log_entity_1 = require("../waste/entities/waste-calculate-log.entity");
let SchedulerModule = class SchedulerModule {
};
exports.SchedulerModule = SchedulerModule;
exports.SchedulerModule = SchedulerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forFeature([
                scheduler_lock_entity_1.SchedulerLock,
                scheduler_settings_entity_1.SchedulerSettings,
                waste_history_entity_1.WasteHistory,
                waste_material_entity_1.WasteMaterial,
                waste_management_method_entity_1.WasteManagementMethod,
                waste_calculate_log_entity_1.WasteCalculateLog,
            ]),
        ],
        controllers: [scheduler_controller_1.SchedulerController],
        providers: [
            carbon_footprint_scheduler_service_1.CarbonFootprintSchedulerService,
            carbon_footprint_calculator_service_1.CarbonFootprintCalculatorService,
            scheduler_settings_service_1.SchedulerSettingsService,
        ],
        exports: [
            carbon_footprint_scheduler_service_1.CarbonFootprintSchedulerService,
            carbon_footprint_calculator_service_1.CarbonFootprintCalculatorService,
            scheduler_settings_service_1.SchedulerSettingsService,
        ],
    })
], SchedulerModule);
//# sourceMappingURL=scheduler.module.js.map