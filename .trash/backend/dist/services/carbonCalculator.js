"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarbonFootprintCalculator = void 0;
exports.calculateDailyCarbonFootprint = calculateDailyCarbonFootprint;
const common_1 = require("@nestjs/common");
const decimal_js_1 = __importDefault(require("decimal.js"));
const waste_material_entity_1 = require("../waste/entities/waste-material.entity");
const waste_sorting_entity_1 = require("../waste/entities/waste-sorting.entity");
const material_guide_entity_1 = require("../waste/entities/material-guide.entity");
class CarbonFootprintCalculator {
    entityManager;
    emissionFactors;
    materialIdMap;
    wasteSortingMap;
    materialGuideMap;
    debugLogs;
    maxLogs;
    logger;
    constructor(entityManager, maxLogs = 1000, logger) {
        this.entityManager = entityManager;
        this.emissionFactors = new Map();
        this.materialIdMap = new Map();
        this.wasteSortingMap = new Map();
        this.materialGuideMap = new Map();
        this.debugLogs = [];
        this.maxLogs = maxLogs;
        this.logger = logger || new common_1.Logger(CarbonFootprintCalculator.name);
    }
    async loadEmissionFactors() {
        this.log('🔄 Loading emission factors from database...');
        try {
            const [wasteSortings, materialGuides, wasteMaterials] = await Promise.all([
                this.entityManager.find(waste_sorting_entity_1.WasteSorting),
                this.entityManager.find(material_guide_entity_1.MaterialGuide),
                this.entityManager.find(waste_material_entity_1.WasteMaterial),
            ]);
            this.emissionFactors.clear();
            this.materialIdMap.clear();
            this.wasteSortingMap.clear();
            this.materialGuideMap.clear();
            for (const sorting of wasteSortings) {
                if (sorting.name) {
                    this.wasteSortingMap.set(sorting.name.toLowerCase(), Number(sorting.id));
                    this.log(`  ✓ WasteSorting: ${sorting.name} (id: ${sorting.id})`);
                }
            }
            for (const guide of materialGuides) {
                if (guide.wastesid !== null &&
                    guide.wastesid !== undefined &&
                    guide.waste_meterialid !== null &&
                    guide.waste_meterialid !== undefined) {
                    this.materialGuideMap.set(Number(guide.wastesid), Number(guide.waste_meterialid));
                    this.log(`  ✓ MaterialGuide: wastesid=${guide.wastesid} -> materialid=${guide.waste_meterialid}`);
                }
            }
            for (const material of wasteMaterials) {
                if (material.emission_factor !== null &&
                    material.emission_factor !== undefined) {
                    this.materialIdMap.set(Number(material.id), material.emission_factor);
                    this.log(`  ✓ WasteMaterial: ${material.name} (id: ${material.id}): ${material.emission_factor}`);
                }
            }
            this.log(`✅ Loaded ${this.wasteSortingMap.size} waste sortings, ${this.materialGuideMap.size} material guides, ${this.materialIdMap.size} waste materials`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.log(`❌ Error loading emission factors: ${errorMessage}`);
            throw error;
        }
    }
    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        if (this.debugLogs.length >= this.maxLogs) {
            this.debugLogs.shift();
        }
        this.debugLogs.push(logMessage);
        this.logger.log(message);
    }
    getLogs() {
        return [...this.debugLogs];
    }
    clearLogs() {
        this.debugLogs = [];
    }
    calculate(trash) {
        if (!trash || typeof trash !== 'object') {
            throw new Error('Invalid trash data: must be an object');
        }
        this.log(`🗑️ Processing trash ID: ${trash.id ?? 'unknown'}`);
        if (trash.waste_sorting &&
            typeof trash.waste_sorting === 'object' &&
            !Array.isArray(trash.waste_sorting)) {
            return this.calculateFromWasteSorting(trash);
        }
        if (trash.waste_sorting &&
            Array.isArray(trash.waste_sorting) &&
            trash.waste_sorting.length > 0) {
            return this.calculateFromWasteSortingArray(trash);
        }
        if (trash.type && typeof trash.emission_factor === 'number') {
            return this.calculateFromSingleType(trash);
        }
        throw new Error('Invalid trash data: must have either waste_sorting (object or array) or (type + emission_factor)');
    }
    calculateFromWasteSorting(trash) {
        const { waste_sorting, weight } = trash;
        if (!waste_sorting ||
            typeof waste_sorting !== 'object' ||
            Array.isArray(waste_sorting)) {
            throw new Error('waste_sorting must be a non-array object');
        }
        this.log(`  📊 Calculating from waste_sorting (object), weight: ${weight}kg`);
        if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) {
            throw new Error(`Invalid weight: ${weight}. Must be a positive finite number (in kg)`);
        }
        if (Object.keys(waste_sorting).length === 0) {
            throw new Error('waste_sorting cannot be empty');
        }
        const totalRatio = Object.values(waste_sorting).reduce((sum, ratio) => {
            if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio < 0) {
                throw new Error(`Invalid ratio: ${String(ratio)}. Must be a non-negative finite number`);
            }
            return sum + ratio;
        }, 0);
        if (Math.abs(totalRatio - 1.0) > 0.001) {
            this.log(`  ⚠️ Warning: Ratios don't sum to 1.0: ${totalRatio.toFixed(4)}`);
        }
        let totalCarbon = new decimal_js_1.default(0);
        const breakdown = {};
        for (const [material, ratio] of Object.entries(waste_sorting)) {
            const ef = this.getEmissionFactor(material);
            const weightDecimal = new decimal_js_1.default(weight);
            const ratioDecimal = new decimal_js_1.default(ratio);
            const efDecimal = new decimal_js_1.default(ef);
            const materialWeightKg = weightDecimal.mul(ratioDecimal);
            const materialCarbon = materialWeightKg.mul(efDecimal);
            totalCarbon = totalCarbon.plus(materialCarbon);
            breakdown[material] = {
                ratio,
                weightGrams: materialWeightKg.mul(1000).toNumber(),
                weightKg: materialWeightKg.toNumber(),
                emissionFactor: ef,
                carbon: materialCarbon.toNumber(),
            };
            this.log(`    • ${material}: ${materialCarbon.toFixed(4)} kg CO2e (EF: ${ef})`);
        }
        this.log(`  ✅ Total: ${totalCarbon.toFixed(4)} kg CO2e`);
        return {
            carbon_footprint: totalCarbon.toNumber(),
            breakdown,
            method: 'waste_sorting',
            weightGrams: weight * 1000,
            totalRatio,
        };
    }
    calculateFromWasteSortingArray(trash) {
        const { waste_sorting, weight } = trash;
        if (!waste_sorting || !Array.isArray(waste_sorting)) {
            throw new Error('waste_sorting must be an array');
        }
        this.log(`  📊 Calculating from waste_sorting (array), weight: ${weight}kg`);
        if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) {
            throw new Error(`Invalid weight: ${weight}. Must be a positive finite number (in kg)`);
        }
        if (waste_sorting.length === 0) {
            throw new Error('waste_sorting array cannot be empty');
        }
        const wasteSortingRecord = {};
        for (const item of waste_sorting) {
            if (typeof item !== 'object' || item === null) {
                throw new Error('waste_sorting array items must be objects');
            }
            const sortingItem = item;
            const name = sortingItem.name || sortingItem.material || 'unknown';
            const ratio = sortingItem.ratio ?? sortingItem.percentage ?? sortingItem.amount;
            if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio < 0) {
                throw new Error(`Invalid ratio for ${name}: ${ratio}`);
            }
            wasteSortingRecord[name] = ratio;
        }
        return this.calculateFromWasteSorting({
            ...trash,
            waste_sorting: wasteSortingRecord,
        });
    }
    calculateFromSingleType(trash) {
        const { type, weight, emission_factor } = trash;
        if (!type || typeof emission_factor !== 'number') {
            throw new Error('type and emission_factor are required');
        }
        this.log(`  📊 Calculating from single type: ${type}, weight: ${weight}kg`);
        if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) {
            throw new Error(`Invalid weight: ${weight}. Must be a positive finite number (in kg)`);
        }
        if (!Number.isFinite(emission_factor) || emission_factor < 0) {
            throw new Error(`Invalid emission_factor: ${emission_factor}`);
        }
        const weightDecimal = new decimal_js_1.default(weight);
        const efDecimal = new decimal_js_1.default(emission_factor);
        const carbon = weightDecimal.mul(efDecimal);
        this.log(`  ✅ Total: ${carbon.toFixed(4)} kg CO2e`);
        return {
            carbon_footprint: carbon.toNumber(),
            breakdown: {
                [type]: {
                    ratio: 1.0,
                    weightGrams: weight * 1000,
                    weightKg: weight,
                    emissionFactor: emission_factor,
                    carbon: carbon.toNumber(),
                },
            },
            method: 'single_type',
            weightGrams: weight * 1000,
        };
    }
    async calculateByWasteId(wasteId, wasteHistory) {
        this.log(`🔄 Calculating carbon for waste_id: ${wasteId}`);
        try {
            const materialGuides = await this.entityManager.find(material_guide_entity_1.MaterialGuide, {
                where: { wastesid: wasteId },
                relations: ['wasteMaterial'],
            });
            if (materialGuides && materialGuides.length > 0) {
                this.log(`  📦 Found ${materialGuides.length} material guides (scanned waste)`);
                let totalCarbon = new decimal_js_1.default(0);
                for (const guide of materialGuides) {
                    const materialWeight = guide.weight || 0;
                    const wasteMaterial = guide.wasteMaterial;
                    if (!wasteMaterial) {
                        this.log(`  ⚠️ Warning: No waste material found for guide ${guide.id}`);
                        continue;
                    }
                    const emissionFactor = wasteMaterial.emission_factor || 0;
                    const materialCarbon = new decimal_js_1.default(materialWeight).mul(new decimal_js_1.default(emissionFactor));
                    totalCarbon = totalCarbon.plus(materialCarbon);
                    this.log(`    • ${wasteMaterial.name}: ${materialCarbon.toFixed(4)} kg CO2e (weight: ${materialWeight}kg, EF: ${emissionFactor})`);
                }
                this.log(`  ✅ Total (scanned): ${totalCarbon.toFixed(4)} kg CO2e`);
                return totalCarbon.toNumber();
            }
            this.log(`  📦 No material guides found (manual entry)`);
            if (!wasteHistory) {
                throw new Error(`No material guides found for waste_id: ${wasteId} and no wasteHistory provided for fallback`);
            }
            const amount = wasteHistory.amount || 0;
            const wasteMaterial = wasteHistory.wasteMaterial;
            if (!wasteMaterial) {
                throw new Error(`No wasteMaterial found in wasteHistory for fallback calculation (waste_id: ${wasteId})`);
            }
            const emissionFactor = wasteMaterial.emission_factor || 0;
            const totalCarbon = new decimal_js_1.default(amount).mul(new decimal_js_1.default(emissionFactor));
            this.log(`    • ${wasteMaterial.name}: ${totalCarbon.toFixed(4)} kg CO2e (amount: ${amount}, EF: ${emissionFactor})`);
            this.log(`  ✅ Total (manual): ${totalCarbon.toFixed(4)} kg CO2e`);
            return totalCarbon.toNumber();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.log(`❌ Error calculating by waste_id: ${errorMessage}`);
            throw error;
        }
    }
    getEmissionFactor(material) {
        if (typeof material === 'number') {
            const ef = this.materialIdMap.get(material);
            if (ef === undefined) {
                throw new Error(`Unknown material id: ${material}`);
            }
            return ef;
        }
        if (typeof material !== 'string') {
            throw new Error(`Invalid material type: ${typeof material}. Must be a string or number`);
        }
        const normalizedMaterial = material.toLowerCase().trim();
        const wasteSortingId = this.wasteSortingMap.get(normalizedMaterial);
        if (wasteSortingId === undefined) {
            throw new Error(`Unknown material: "${material}". No waste_sorting found with name "${normalizedMaterial}".`);
        }
        const wasteMaterialId = this.materialGuideMap.get(wasteSortingId);
        if (wasteMaterialId === undefined) {
            throw new Error(`Unknown material: "${material}". No material_guide found for waste_sorting_id ${wasteSortingId}.`);
        }
        const emissionFactor = this.materialIdMap.get(wasteMaterialId);
        if (emissionFactor === undefined) {
            throw new Error(`Unknown material: "${material}". No waste_material found with id ${wasteMaterialId} or missing emission_factor.`);
        }
        return emissionFactor;
    }
}
exports.CarbonFootprintCalculator = CarbonFootprintCalculator;
async function calculateDailyCarbonFootprint(trashItems, entityManager, logger) {
    const startTime = Date.now();
    const calculator = new CarbonFootprintCalculator(entityManager, 1000, logger);
    const results = [];
    const errors = [];
    calculator.log('🚀 =========================================');
    calculator.log('🚀 Starting Daily Carbon Footprint Calculation');
    calculator.log(`🚀 Total items to process: ${trashItems.length}`);
    calculator.log('🚀 =========================================');
    try {
        await calculator.loadEmissionFactors();
        calculator.log(`\n📦 Processing ${trashItems.length} trash items...\n`);
        for (let i = 0; i < trashItems.length; i++) {
            const trash = trashItems[i];
            calculator.log(`\n[${i + 1}/${trashItems.length}] ------------------------`);
            try {
                const calculation = calculator.calculate(trash);
                const wasteHistoryRecord = {
                    trash_id: trash.id ?? 'unknown',
                    carbon_footprint: calculation.carbon_footprint,
                    calculation_method: calculation.method,
                    breakdown: JSON.stringify(calculation.breakdown),
                    weight_grams: trash.weight * 1000,
                    calculated_at: new Date().toISOString(),
                };
                results.push(wasteHistoryRecord);
                calculator.log(`✅ SUCCESS: ${calculation.carbon_footprint.toFixed(4)} kg CO2e (${calculation.method})`);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                calculator.log(`❌ FAILED: ${errorMsg}`);
                errors.push({
                    trash_id: trash.id ?? 'unknown',
                    error: errorMsg,
                });
            }
        }
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        calculator.log(`❌ CRITICAL ERROR: ${errorMsg}`);
        throw error;
    }
    const duration = Date.now() - startTime;
    calculator.log('\n📊 =========================================');
    calculator.log('📊 CALCULATION SUMMARY');
    calculator.log('📊 =========================================');
    calculator.log(`📊 Total items: ${trashItems.length}`);
    calculator.log(`📊 Success: ${results.length} ✅`);
    calculator.log(`📊 Failed: ${errors.length} ❌`);
    calculator.log(`📊 Duration: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
    calculator.log('📊 =========================================');
    return {
        results,
        errors,
        logs: calculator.getLogs(),
        summary: {
            total: trashItems.length,
            success: results.length,
            failed: errors.length,
            duration,
        },
    };
}
//# sourceMappingURL=carbonCalculator.js.map