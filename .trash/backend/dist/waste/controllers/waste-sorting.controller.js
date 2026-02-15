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
exports.WasteSortingController = void 0;
const common_1 = require("@nestjs/common");
const waste_sorting_service_1 = require("../services/waste-sorting.service");
let WasteSortingController = class WasteSortingController {
    wasteService;
    constructor(wasteService) {
        this.wasteService = wasteService;
    }
    async getMaterialDetail(id) {
        return await this.wasteService.findByMaterialId(id);
    }
    async createRecord(materialId, weight, userId) {
        return await this.wasteService.recordWasteWeight(materialId, weight, userId);
    }
    async getMaterials(page = 1, categoryName, materialName) {
        return this.wasteService.findMeterialsAll(page, categoryName, materialName);
    }
    async getAllCategories() {
        return this.wasteService.findAllCategories();
    }
};
exports.WasteSortingController = WasteSortingController;
__decorate([
    (0, common_1.Get)('material/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WasteSortingController.prototype, "getMaterialDetail", null);
__decorate([
    (0, common_1.Post)('sorting/record'),
    __param(0, (0, common_1.Body)('meterialId')),
    __param(1, (0, common_1.Body)('weight')),
    __param(2, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], WasteSortingController.prototype, "createRecord", null);
__decorate([
    (0, common_1.Get)('waste-materials'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('category_name')),
    __param(2, (0, common_1.Query)('material_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], WasteSortingController.prototype, "getMaterials", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WasteSortingController.prototype, "getAllCategories", null);
exports.WasteSortingController = WasteSortingController = __decorate([
    (0, common_1.Controller)('waste'),
    __metadata("design:paramtypes", [waste_sorting_service_1.WasteSortingService])
], WasteSortingController);
//# sourceMappingURL=waste-sorting.controller.js.map