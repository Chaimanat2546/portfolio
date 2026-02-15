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
exports.WasteSorting = void 0;
const typeorm_1 = require("typeorm");
const waste_entity_1 = require("./waste.entity");
let WasteSorting = class WasteSorting {
    id;
    name;
    description;
    created_at;
    updated_at;
    wastesid;
    waste;
};
exports.WasteSorting = WasteSorting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], WasteSorting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], WasteSorting.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WasteSorting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], WasteSorting.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], WasteSorting.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WasteSorting.prototype, "wastesid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_entity_1.Waste, (waste) => waste.wasteSortings),
    (0, typeorm_1.JoinColumn)({ name: 'wastesid' }),
    __metadata("design:type", waste_entity_1.Waste)
], WasteSorting.prototype, "waste", void 0);
exports.WasteSorting = WasteSorting = __decorate([
    (0, typeorm_1.Entity)('waste_sorting')
], WasteSorting);
//# sourceMappingURL=waste-sorting.entity.js.map