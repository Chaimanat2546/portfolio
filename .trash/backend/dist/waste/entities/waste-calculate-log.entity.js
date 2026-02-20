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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasteCalculateLog = void 0;
const typeorm_1 = require("typeorm");
const waste_history_entity_1 = require("./waste-history.entity");
const waste_management_method_entity_1 = require("./waste-management-method.entity");
let WasteCalculateLog = class WasteCalculateLog {
    id;
    create_at;
    waste_historyid;
    waste_management_methodid;
    amount;
    material_emission;
    transport_emission;
    total_carbon_footprint;
    wasteHistory;
    wasteManagementMethod;
};
exports.WasteCalculateLog = WasteCalculateLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], WasteCalculateLog.prototype, "create_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "waste_historyid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "waste_management_methodid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "material_emission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "transport_emission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteCalculateLog.prototype, "total_carbon_footprint", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_history_entity_1.WasteHistory, (history) => history.wasteCalculateLogs),
    (0, typeorm_1.JoinColumn)({ name: 'waste_historyid' }),
    __metadata("design:type", waste_history_entity_1.WasteHistory)
], WasteCalculateLog.prototype, "wasteHistory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_management_method_entity_1.WasteManagementMethod, (method) => method.wasteCalculateLogs),
    (0, typeorm_1.JoinColumn)({ name: 'waste_management_methodid' }),
    __metadata("design:type", waste_management_method_entity_1.WasteManagementMethod)
], WasteCalculateLog.prototype, "wasteManagementMethod", void 0);
exports.WasteCalculateLog = WasteCalculateLog = __decorate([
    (0, typeorm_1.Entity)('waste_calculate_logs')
], WasteCalculateLog);
//# sourceMappingURL=waste-calculate-log.entity.js.map