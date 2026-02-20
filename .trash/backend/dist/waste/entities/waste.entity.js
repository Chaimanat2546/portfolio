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
exports.Waste = void 0;
const typeorm_1 = require("typeorm");
const waste_category_entity_1 = require("./waste-category.entity");
const user_entity_1 = require("../../users/user.entity");
const waste_history_entity_1 = require("./waste-history.entity");
const waste_sorting_entity_1 = require("./waste-sorting.entity");
const material_guide_entity_1 = require("./material-guide.entity");
let Waste = class Waste {
    id;
    name;
    waste_image;
    barcode;
    create_at;
    waste_categoriesid;
    userid;
    wasteCategory;
    user;
    wasteHistories;
    wasteSortings;
    materialGuides;
};
exports.Waste = Waste;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Waste.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Waste.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Waste.prototype, "waste_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Waste.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'date' }),
    __metadata("design:type", Date)
], Waste.prototype, "create_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Waste.prototype, "waste_categoriesid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Waste.prototype, "userid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => waste_category_entity_1.WasteCategory, (category) => category.wastes),
    (0, typeorm_1.JoinColumn)({ name: 'waste_categoriesid' }),
    __metadata("design:type", waste_category_entity_1.WasteCategory)
], Waste.prototype, "wasteCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userid' }),
    __metadata("design:type", user_entity_1.User)
], Waste.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waste_history_entity_1.WasteHistory, (history) => history.waste),
    __metadata("design:type", Array)
], Waste.prototype, "wasteHistories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => waste_sorting_entity_1.WasteSorting, (sorting) => sorting.waste),
    __metadata("design:type", Array)
], Waste.prototype, "wasteSortings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => material_guide_entity_1.MaterialGuide, (guide) => guide.waste),
    __metadata("design:type", Array)
], Waste.prototype, "materialGuides", void 0);
exports.Waste = Waste = __decorate([
    (0, typeorm_1.Entity)('wastes')
], Waste);
//# sourceMappingURL=waste.entity.js.map