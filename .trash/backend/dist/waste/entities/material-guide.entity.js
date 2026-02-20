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
exports.MaterialGuide = void 0;
const typeorm_1 = require("typeorm");
const waste_material_entity_1 = require("./waste-material.entity");
const waste_entity_1 = require("./waste.entity");
let MaterialGuide = class MaterialGuide {
    id;
    guide_image;
    recommendation;
    weight;
    created_at;
    updated_at;
    waste_meterialid;
    wastesid;
    wasteMaterial;
    waste;
};
exports.MaterialGuide = MaterialGuide;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], MaterialGuide.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MaterialGuide.prototype, "guide_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MaterialGuide.prototype, "recommendation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], MaterialGuide.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], MaterialGuide.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], MaterialGuide.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], MaterialGuide.prototype, "waste_meterialid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], MaterialGuide.prototype, "wastesid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_material_entity_1.WasteMaterial, (material) => material.materialGuides),
    (0, typeorm_1.JoinColumn)({ name: 'waste_meterialid' }),
    __metadata("design:type", waste_material_entity_1.WasteMaterial)
], MaterialGuide.prototype, "wasteMaterial", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_entity_1.Waste, (waste) => waste.materialGuides),
    (0, typeorm_1.JoinColumn)({ name: 'wastesid' }),
    __metadata("design:type", waste_entity_1.Waste)
], MaterialGuide.prototype, "waste", void 0);
exports.MaterialGuide = MaterialGuide = __decorate([
    (0, typeorm_1.Entity)('material_guides')
], MaterialGuide);
//# sourceMappingURL=material-guide.entity.js.map