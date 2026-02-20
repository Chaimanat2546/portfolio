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
exports.WasteMaterial = void 0;
const typeorm_1 = require("typeorm");
const waste_category_entity_1 = require("./waste-category.entity");
const material_guide_entity_1 = require("./material-guide.entity");
const waste_history_entity_1 = require("./waste-history.entity");
let WasteMaterial = class WasteMaterial {
    id;
    name;
    emission_factor;
    unit;
    created_at;
    updated_at;
    meterial_image;
    waste_categoriesid;
    wasteCategory;
    materialGuides;
    wasteHistories;
};
exports.WasteMaterial = WasteMaterial;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], WasteMaterial.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], WasteMaterial.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], WasteMaterial.prototype, "emission_factor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WasteMaterial.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], WasteMaterial.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], WasteMaterial.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WasteMaterial.prototype, "meterial_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], WasteMaterial.prototype, "waste_categoriesid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_category_entity_1.WasteCategory, (category) => category.materials),
    (0, typeorm_1.JoinColumn)({ name: 'waste_categoriesid' }),
    __metadata("design:type", waste_category_entity_1.WasteCategory)
], WasteMaterial.prototype, "wasteCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => material_guide_entity_1.MaterialGuide, (guide) => guide.wasteMaterial),
    __metadata("design:type", Array)
], WasteMaterial.prototype, "materialGuides", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waste_history_entity_1.WasteHistory, (history) => history.wasteMaterial),
    __metadata("design:type", Array)
], WasteMaterial.prototype, "wasteHistories", void 0);
exports.WasteMaterial = WasteMaterial = __decorate([
    (0, typeorm_1.Entity)('waste_meterial')
], WasteMaterial);
//# sourceMappingURL=waste-material.entity.js.map