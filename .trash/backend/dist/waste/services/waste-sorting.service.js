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
exports.WasteSortingService = void 0;
const waste_material_entity_1 = require("./../entities/waste-material.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let WasteSortingService = class WasteSortingService {
    wasteCategoryRepository;
    wasteHistoryRepo;
    wasteMaterialRepo;
    constructor(wasteCategoryRepository, wasteHistoryRepo, wasteMaterialRepo) {
        this.wasteCategoryRepository = wasteCategoryRepository;
        this.wasteHistoryRepo = wasteHistoryRepo;
        this.wasteMaterialRepo = wasteMaterialRepo;
    }
    async findByMaterialId(materialId) {
        const material = await this.wasteMaterialRepo.findOne({
            where: { id: materialId },
            relations: ['wasteCategory', 'materialGuides'],
        });
        if (!material) {
            throw new common_1.NotFoundException(`ไม่พบข้อมูลขยะ: ${materialId}`);
        }
        return {
            material_id: material.id,
            material_name: material.name,
            material_image: material.meterial_image,
            waste_category: material.wasteCategory
                ? [
                    {
                        id: material.wasteCategory.id,
                        name: material.wasteCategory.name,
                    },
                ]
                : [],
            create_at: material.created_at,
        };
    }
    async recordWasteWeight(materialId, weight, userId) {
        const material = await this.wasteMaterialRepo.findOne({
            where: { id: materialId },
            relations: ['wasteCategory'],
        });
        if (!material) {
            throw new common_1.NotFoundException('ไม่พบข้อมูลวัสดุที่ระบุ');
        }
        const newHistory = this.wasteHistoryRepo.create({
            amount: weight,
            record_type: 'weight_entry',
            waste_meterialid: materialId,
            userid: userId,
            wastesid: null,
            create_at: new Date(),
        });
        const savedHistory = await this.wasteHistoryRepo.save(newHistory);
        return {
            meterial_image: material.meterial_image,
            meterial_name: material.name,
            category: material.wasteCategory
                ? [
                    {
                        id: material.wasteCategory.id,
                        name: material.wasteCategory.name,
                    },
                ]
                : [],
            weight: savedHistory.amount,
            create_at: savedHistory.create_at,
        };
    }
    async findAllCategories() {
        const categories = await this.wasteCategoryRepository.find({
            order: {
                id: 'ASC',
            },
        });
        return {
            data: categories,
        };
    }
    async findMeterialsAll(page = 1, categoryName, materialName) {
        const limit = 6;
        const skip = (page - 1) * limit;
        const whereCondition = {};
        if (categoryName) {
            whereCondition.wasteCategory = { name: (0, typeorm_2.ILike)(`%${categoryName}%`) };
        }
        if (materialName) {
            whereCondition.name = (0, typeorm_2.ILike)(`%${materialName}%`);
        }
        const [results, total] = await this.wasteMaterialRepo.findAndCount({
            where: whereCondition,
            relations: ['wasteCategory'],
            take: limit,
            skip: skip,
            order: { id: 'ASC' },
        });
        const formattedData = results.map((item) => ({
            id: Number(item.id),
            name: item.name,
            meterial_image: item.meterial_image || '',
            waste_categoriesid: item.wasteCategory
                ? {
                    id: item.wasteCategory.id,
                    name: item.wasteCategory.name,
                }
                : null,
        }));
        const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
        return {
            data: formattedData,
            pagination: {
                total_items: total,
                per_page: limit,
                current_page: Number(page),
                total_pages: totalPages,
                page_info: total === 0 ? '0 / 0' : `${page} / ${totalPages}`,
            },
        };
    }
};
exports.WasteSortingService = WasteSortingService;
exports.WasteSortingService = WasteSortingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.WasteCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.WasteHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(waste_material_entity_1.WasteMaterial)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WasteSortingService);
//# sourceMappingURL=waste-sorting.service.js.map