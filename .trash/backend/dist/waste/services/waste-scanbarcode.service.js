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
exports.WasteScannerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const entities_1 = require("../entities");
let WasteScannerService = class WasteScannerService {
    wasteRepository;
    userRepository;
    wasteCategoryRepository;
    wasteHistoryRepository;
    constructor(wasteRepository, userRepository, wasteCategoryRepository, wasteHistoryRepository) {
        this.wasteRepository = wasteRepository;
        this.userRepository = userRepository;
        this.wasteCategoryRepository = wasteCategoryRepository;
        this.wasteHistoryRepository = wasteHistoryRepository;
    }
    async findByBarcode(barcode) {
        const waste = await this.wasteRepository.findOne({
            where: { barcode: barcode },
            relations: [
                'wasteCategory',
                'wasteSortings',
                'materialGuides',
                'materialGuides.wasteMaterial',
                'user',
            ],
        });
        if (!waste) {
            throw new common_1.NotFoundException(`ไม่พบสินค้าที่มีบาร์โค้ด: ${barcode}`);
        }
        return {
            id: waste.id,
            barcode: waste.barcode,
            name: waste.name,
            waste_image: waste.waste_image,
            amount: 1,
            create_at: waste.create_at,
            waste_categoriesid: waste.wasteCategory
                ? [
                    {
                        id: waste.wasteCategory.id,
                        name: waste.wasteCategory.name,
                    },
                ]
                : [],
            user_id: waste.userid,
            waste_sorting: waste.wasteSortings?.map((sorting) => ({
                id: sorting.id,
                name: sorting.name,
                description: sorting.description,
            })) || [],
            material_guides: waste.materialGuides?.map((guide) => ({
                id: guide.id,
                guide_image: guide.guide_image,
                recommendation: guide.recommendation,
                waste_meterial_name: guide.wasteMaterial.name,
            })) || [],
        };
    }
    async recordWaste(dto) {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
        });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งาน');
        const waste = await this.wasteRepository.findOne({
            where: { id: Number(dto.wasteId) },
            relations: ['materialGuides'],
        });
        if (!waste)
            throw new common_1.NotFoundException('ไม่พบข้อมูลขยะ');
        let finalAmount = 0;
        if (dto.source === 'scan') {
            if (waste.materialGuides && waste.materialGuides.length > 0) {
                finalAmount = waste.materialGuides.reduce((sum, guide) => sum + Number(guide.weight), 0);
            }
            else {
                finalAmount = 0.0;
            }
        }
        else {
            if (!dto.amount)
                throw new Error('กรุณาระบุน้ำหนัก (kg)');
            finalAmount = dto.amount;
        }
        const newHistory = this.wasteHistoryRepository.create({
            user: user,
            waste: waste,
            amount: finalAmount,
            record_type: dto.source,
            create_at: new Date(),
        });
        await this.wasteHistoryRepository.save(newHistory);
        return {
            message: 'บันทึกสำเร็จ',
            data: {
                type: dto.source,
                amount: finalAmount,
            },
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
};
exports.WasteScannerService = WasteScannerService;
exports.WasteScannerService = WasteScannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Waste)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.WasteCategory)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.WasteHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WasteScannerService);
//# sourceMappingURL=waste-scanbarcode.service.js.map