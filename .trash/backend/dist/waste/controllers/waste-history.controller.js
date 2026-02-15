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
exports.WasteHistoryController = void 0;
const common_1 = require("@nestjs/common");
const waste_history_service_1 = require("../services/waste-history.service");
let WasteHistoryController = class WasteHistoryController {
    wasteService;
    constructor(wasteService) {
        this.wasteService = wasteService;
    }
    async getAllHistory(page = 1, limit = 10) {
        return this.wasteService.getAllHistory(Number(page), Number(limit));
    }
    async getUserHistory(userId) {
        return this.wasteService.getUserHistory(userId);
    }
    async getWasteById(id) {
        return this.wasteService.findHistoryDetailById(id);
    }
};
exports.WasteHistoryController = WasteHistoryController;
__decorate([
    (0, common_1.Get)('history/all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], WasteHistoryController.prototype, "getAllHistory", null);
__decorate([
    (0, common_1.Get)('history/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WasteHistoryController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)('/history/detail/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WasteHistoryController.prototype, "getWasteById", null);
exports.WasteHistoryController = WasteHistoryController = __decorate([
    (0, common_1.Controller)('waste'),
    __metadata("design:paramtypes", [waste_history_service_1.WasteHistoryService])
], WasteHistoryController);
//# sourceMappingURL=waste-history.controller.js.map