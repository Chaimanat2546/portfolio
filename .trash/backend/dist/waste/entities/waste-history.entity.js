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
exports.WasteHistory = void 0;
const typeorm_1 = require("typeorm");
const waste_entity_1 = require("./waste.entity");
const user_entity_1 = require("../../users/user.entity");
const waste_material_entity_1 = require("./waste-material.entity");
const waste_calculate_log_entity_1 = require("./waste-calculate-log.entity");
let WasteHistory = class WasteHistory {
    id;
    amount;
    record_type;
    create_at;
    waste_meterialid;
    wastesid;
    userid;
    calculation_status;
    carbon_footprint;
    retry_count;
    last_calculation_attempt;
    error_message;
    waste;
    user;
    wasteMaterial;
    wasteCalculateLogs;
};
exports.WasteHistory = WasteHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], WasteHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteHistory.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WasteHistory.prototype, "record_type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], WasteHistory.prototype, "create_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WasteHistory.prototype, "waste_meterialid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], WasteHistory.prototype, "wastesid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WasteHistory.prototype, "userid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: 'pending',
    }),
    __metadata("design:type", String)
], WasteHistory.prototype, "calculation_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteHistory.prototype, "carbon_footprint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], WasteHistory.prototype, "retry_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WasteHistory.prototype, "last_calculation_attempt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WasteHistory.prototype, "error_message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_entity_1.Waste, (waste) => waste.wasteHistories),
    (0, typeorm_1.JoinColumn)({ name: 'wastesid' }),
    __metadata("design:type", waste_entity_1.Waste)
], WasteHistory.prototype, "waste", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userid' }),
    __metadata("design:type", user_entity_1.User)
], WasteHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_material_entity_1.WasteMaterial, (material) => material.wasteHistories),
    (0, typeorm_1.JoinColumn)({ name: 'waste_meterialid' }),
    __metadata("design:type", waste_material_entity_1.WasteMaterial)
], WasteHistory.prototype, "wasteMaterial", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waste_calculate_log_entity_1.WasteCalculateLog, (log) => log.wasteHistory),
    __metadata("design:type", Array)
], WasteHistory.prototype, "wasteCalculateLogs", void 0);
exports.WasteHistory = WasteHistory = __decorate([
    (0, typeorm_1.Entity)('waste_history')
], WasteHistory);
//# sourceMappingURL=waste-history.entity.js.map