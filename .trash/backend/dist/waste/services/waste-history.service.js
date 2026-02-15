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
exports.WasteHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const typeorm_2 = require("typeorm");
let WasteHistoryService = class WasteHistoryService {
    wasteHistoryRepository;
    constructor(wasteHistoryRepository) {
        this.wasteHistoryRepository = wasteHistoryRepository;
    }
    async getAllHistory(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [histories, total] = await this.wasteHistoryRepository.findAndCount({
            relations: ['waste', 'waste.wasteCategory', 'user'],
            order: { create_at: 'DESC' },
            take: limit,
            skip: skip,
        });
        return {
            data: this.mapHistoryData(histories),
            pagination: {
                totalItems: total,
                itemCount: histories.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async getUserHistory(userId) {
        const histories = await this.wasteHistoryRepository.find({
            where: {
                user: { id: userId },
            },
            relations: [
                'waste',
                'waste.wasteCategory',
                'wasteMaterial',
                'wasteMaterial.wasteCategory',
            ],
            order: { create_at: 'DESC' },
        });
        return this.mapHistoryData(histories);
    }
    mapHistoryData(histories) {
        return histories.map((history) => {
            const materialName = history.wasteMaterial?.name || history.waste?.name || 'Unknown';
            const categoryName = history.waste?.wasteCategory?.name ||
                history.wasteMaterial?.wasteCategory?.name ||
                'N/A';
            return {
                id: Number(history.id),
                waste_category: categoryName,
                wastesid: history.wastesid,
                waste_meterialid: history.waste_meterialid,
                material_name: materialName,
                name_waste: materialName,
                create_at: history.create_at,
                amount: history.amount,
                record_type: history.record_type,
                user_id: history.userid,
            };
        });
    }
    async findHistoryDetailById(historyId) {
        const history = await this.wasteHistoryRepository.findOne({
            where: { id: historyId },
            relations: [
                'waste',
                'waste.wasteCategory',
                'waste.wasteSortings',
                'waste.materialGuides',
                'waste.materialGuides.wasteMaterial',
                'user',
            ],
        });
        if (!history) {
            throw new common_1.NotFoundException(`ไม่พบประวัติการทิ้งรหัส: ${historyId}`);
        }
        const waste = history.waste;
        if (!waste) {
            throw new common_1.NotFoundException(`ไม่พบข้อมูลขยะที่เชื่อมโยงกับประวัตินี้`);
        }
        return {
            id: waste.id,
            name: waste.name,
            waste_image: waste.waste_image,
            amount: history.amount,
            record_type: history.record_type,
            create_at: history.create_at,
            waste_categoriesid: waste.wasteCategory
                ? [
                    {
                        id: waste.wasteCategory.id,
                        name: waste.wasteCategory.name,
                    },
                ]
                : [],
            user_id: history.userid,
            waste_sorting: waste.wasteSortings?.map((sorting) => ({
                id: sorting.id,
                name: sorting.name,
                description: sorting.description,
            })) || [],
            material_guides: waste.materialGuides?.map((guide) => ({
                id: guide.id,
                guide_image: guide.guide_image,
                recommendation: guide.recommendation,
                waste_meterial_name: guide.wasteMaterial?.name || 'ไม่ระบุวัสดุ',
            })) || [],
        };
    }
};
exports.WasteHistoryService = WasteHistoryService;
exports.WasteHistoryService = WasteHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.WasteHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WasteHistoryService);
//# sourceMappingURL=waste-history.service.js.map