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
exports.WasteScannerController = void 0;
const common_1 = require("@nestjs/common");
const create_waste_record_dto_1 = require("../dto/create-waste-record.dto");
const waste_scanbarcode_service_1 = require("../services/waste-scanbarcode.service");
let WasteScannerController = class WasteScannerController {
    wasteService;
    constructor(wasteService) {
        this.wasteService = wasteService;
    }
    async scanBarcode(barcode) {
        return this.wasteService.findByBarcode(barcode);
    }
    async recordWaste(createWasteRecordDto) {
        return this.wasteService.recordWaste(createWasteRecordDto);
    }
};
exports.WasteScannerController = WasteScannerController;
__decorate([
    (0, common_1.Get)('scan/:barcode'),
    __param(0, (0, common_1.Param)('barcode', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WasteScannerController.prototype, "scanBarcode", null);
__decorate([
    (0, common_1.Post)('record'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_waste_record_dto_1.CreateWasteRecordDto]),
    __metadata("design:returntype", Promise)
], WasteScannerController.prototype, "recordWaste", null);
exports.WasteScannerController = WasteScannerController = __decorate([
    (0, common_1.Controller)('waste'),
    __metadata("design:paramtypes", [waste_scanbarcode_service_1.WasteScannerService])
], WasteScannerController);
//# sourceMappingURL=waste-scanbarcode.controller.js.map