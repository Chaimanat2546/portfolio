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
exports.WasteManagementMethod = void 0;
const typeorm_1 = require("typeorm");
const waste_calculate_log_entity_1 = require("./waste-calculate-log.entity");
let WasteManagementMethod = class WasteManagementMethod {
    id;
    name;
    transport_km;
    transport_co2e_per_km;
    wasteCalculateLogs;
};
exports.WasteManagementMethod = WasteManagementMethod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], WasteManagementMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], WasteManagementMethod.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteManagementMethod.prototype, "transport_km", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteManagementMethod.prototype, "transport_co2e_per_km", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waste_calculate_log_entity_1.WasteCalculateLog, (log) => log.wasteManagementMethod),
    __metadata("design:type", Array)
], WasteManagementMethod.prototype, "wasteCalculateLogs", void 0);
exports.WasteManagementMethod = WasteManagementMethod = __decorate([
    (0, typeorm_1.Entity)('waste_management_methods')
], WasteManagementMethod);
//# sourceMappingURL=waste-management-method.entity.js.map