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
exports.CarbonFootprintCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const waste_material_entity_1 = require("../../waste/entities/waste-material.entity");
let CarbonFootprintCalculatorService = class CarbonFootprintCalculatorService {
    wasteMaterialRepository;
    constructor(wasteMaterialRepository) {
        this.wasteMaterialRepository = wasteMaterialRepository;
    }
    calculate(amount, emissionFactor) {
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
        if (emissionFactor < 0) {
            throw new Error('Emission factor cannot be negative');
        }
        const result = amount * emissionFactor;
        return Math.round(result * 1000) / 1000;
    }
    async calculateByMaterialId(amount, wasteMaterialId) {
        const material = await this.wasteMaterialRepository.findOne({
            where: { id: wasteMaterialId },
        });
        if (!material) {
            throw new Error(`Waste material with ID ${wasteMaterialId} not found`);
        }
        if (material.emission_factor === null ||
            material.emission_factor === undefined) {
            throw new Error(`Emission factor is not set for material: ${material.name}`);
        }
        const carbonFootprint = this.calculate(amount, material.emission_factor);
        return {
            carbonFootprint,
            amount,
            emissionFactor: material.emission_factor,
            unit: material.unit || 'kg CO2e',
        };
    }
    async calculateMultiple(items) {
        const breakdown = [];
        let total = 0;
        for (const item of items) {
            const result = await this.calculateByMaterialId(item.amount, item.wasteMaterialId);
            breakdown.push(result);
            total += result.carbonFootprint;
        }
        return {
            total: Math.round(total * 1000) / 1000,
            breakdown,
        };
    }
    async getAllMaterialsWithEmissionFactor() {
        const materials = await this.wasteMaterialRepository.find({
            select: ['id', 'name', 'emission_factor', 'unit'],
        });
        return materials.map((m) => ({
            id: Number(m.id),
            name: m.name,
            emissionFactor: m.emission_factor,
            unit: m.unit,
        }));
    }
};
exports.CarbonFootprintCalculatorService = CarbonFootprintCalculatorService;
exports.CarbonFootprintCalculatorService = CarbonFootprintCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(waste_material_entity_1.WasteMaterial)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CarbonFootprintCalculatorService);
//# sourceMappingURL=carbon-footprint-calculator.service.js.map