"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../users/user.entity");
const waste_category_entity_1 = require("../waste/entities/waste-category.entity");
const waste_material_entity_1 = require("../waste/entities/waste-material.entity");
const waste_entity_1 = require("../waste/entities/waste.entity");
const waste_history_entity_1 = require("../waste/entities/waste-history.entity");
const waste_sorting_entity_1 = require("../waste/entities/waste-sorting.entity");
const material_guide_entity_1 = require("../waste/entities/material-guide.entity");
const waste_calculate_log_entity_1 = require("../waste/entities/waste-calculate-log.entity");
const waste_management_method_entity_1 = require("../waste/entities/waste-management-method.entity");
const scheduler_settings_entity_1 = require("../scheduler/entities/scheduler-settings.entity");
const scheduler_lock_entity_1 = require("../scheduler/entities/scheduler-lock.entity");
async function seedDatabase(dataSource) {
    console.log('🌱 Starting database seeding...\n');
    console.log('🧹 Cleaning existing data...');
    await dataSource.query('TRUNCATE TABLE "scheduler_locks" CASCADE');
    await dataSource.query('TRUNCATE TABLE "scheduler_settings" CASCADE');
    await dataSource.query('TRUNCATE TABLE "waste_calculate_logs" CASCADE');
    await dataSource.query('TRUNCATE TABLE "waste_history" CASCADE');
    await dataSource.query('TRUNCATE TABLE "material_guides" CASCADE');
    await dataSource.query('TRUNCATE TABLE "waste_sorting" CASCADE');
    await dataSource.query('TRUNCATE TABLE "wastes" CASCADE');
    await dataSource.query('TRUNCATE TABLE "waste_meterial" CASCADE');
    await dataSource.query('TRUNCATE TABLE "waste_categories" CASCADE');
    await dataSource.query('TRUNCATE TABLE "users" CASCADE');
    console.log('  ✅ All tables cleaned\n');
    console.log('👤 Seeding Users...');
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('Admin@1234', saltRounds);
    const userPassword = await bcrypt.hash('User@1234', saltRounds);
    const adminUser = userRepo.create({
        email: 'admin@informatics.buu.ac.th',
        password: adminPassword,
        firstName: 'Informatics',
        lastName: 'BUU',
        phoneNumber: '038-102-222',
        province: 'ชลบุรี',
        isActive: true,
        role: 'admin',
        provider: 'local',
    });
    const normalUser = userRepo.create({
        email: 'somchai@example.com',
        password: userPassword,
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phoneNumber: '081-234-5678',
        province: 'ชลบุรี',
        isActive: true,
        role: 'user',
        provider: 'local',
    });
    const savedAdmin = await userRepo.save(adminUser);
    const savedUser = await userRepo.save(normalUser);
    console.log(`  ✅ Created ${2} users (admin: ${savedAdmin.email})\n`);
    console.log('📦 Seeding Waste Categories...');
    const categoryRepo = dataSource.getRepository(waste_category_entity_1.WasteCategory);
    const categories = await categoryRepo.save([
        categoryRepo.create({ name: 'ขยะทั่วไป' }),
        categoryRepo.create({ name: 'ขยะรีไซเคิล' }),
        categoryRepo.create({ name: 'ขยะอันตราย' }),
        categoryRepo.create({ name: 'ขยะอินทรีย์' }),
    ]);
    const [catGeneral, catRecycle, catHazardous, catOrganic] = categories;
    console.log(`  ✅ Created ${categories.length} waste categories\n`);
    console.log('🧪 Seeding Waste Materials...');
    const materialRepo = dataSource.getRepository(waste_material_entity_1.WasteMaterial);
    const materials = await materialRepo.save([
        materialRepo.create({
            name: 'พลาสติก PET',
            emission_factor: 2.29,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catRecycle.id),
        }),
        materialRepo.create({
            name: 'กระดาษ',
            emission_factor: 1.17,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catRecycle.id),
        }),
        materialRepo.create({
            name: 'แก้ว',
            emission_factor: 0.86,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catRecycle.id),
        }),
        materialRepo.create({
            name: 'อลูมิเนียม',
            emission_factor: 8.14,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catRecycle.id),
        }),
        materialRepo.create({
            name: 'เศษอาหาร',
            emission_factor: 0.58,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catOrganic.id),
        }),
        materialRepo.create({
            name: 'ถ่านไฟฉาย / แบตเตอรี่',
            emission_factor: 3.5,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catHazardous.id),
        }),
        materialRepo.create({
            name: 'โฟม (Styrofoam)',
            emission_factor: 3.3,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catGeneral.id),
        }),
        materialRepo.create({
            name: 'ผ้า / สิ่งทอ',
            emission_factor: 1.5,
            unit: 'kg CO₂e/kg',
            waste_categoriesid: Number(catGeneral.id),
        }),
    ]);
    const matPET = materials[0];
    const matPaper = materials[1];
    const matGlass = materials[2];
    const matAluminum = materials[3];
    const matFood = materials[4];
    const matFoam = materials[6];
    console.log(`  ✅ Created ${materials.length} waste materials\n`);
    console.log('🗑️  Seeding Wastes...');
    const wasteRepo = dataSource.getRepository(waste_entity_1.Waste);
    const wastes = await wasteRepo.save([
        wasteRepo.create({
            name: 'ขวดน้ำพลาสติก',
            barcode: 8851028001010,
            waste_categoriesid: Number(catRecycle.id),
        }),
        wasteRepo.create({
            name: 'กล่องกระดาษ',
            barcode: 8851028002020,
            waste_categoriesid: Number(catRecycle.id),
        }),
        wasteRepo.create({
            name: 'ขวดแก้ว',
            barcode: 8851028003030,
            waste_categoriesid: Number(catRecycle.id),
        }),
        wasteRepo.create({
            name: 'กระป๋องอลูมิเนียม',
            barcode: 8851028004040,
            waste_categoriesid: Number(catRecycle.id),
        }),
        wasteRepo.create({
            name: 'เปลือกผลไม้',
            waste_categoriesid: Number(catOrganic.id),
        }),
        wasteRepo.create({
            name: 'กล่องโฟมใส่อาหาร',
            waste_categoriesid: Number(catGeneral.id),
        }),
    ]);
    const [wasteBottle, wasteBox, wasteGlass, wasteCan, wasteFruit, wasteFoam] = wastes;
    console.log(`  ✅ Created ${wastes.length} wastes\n`);
    console.log('🗑️  Seeding Additional Wastes (manual entry only)...');
    const manualWastes = await wasteRepo.save([
        wasteRepo.create({
            name: 'ซองขนม',
            waste_categoriesid: Number(catGeneral.id),
        }),
        wasteRepo.create({
            name: 'กล่องนม',
            waste_categoriesid: Number(catRecycle.id),
        }),
        wasteRepo.create({
            name: 'ขวดแก้วน้ำผลไม้',
            barcode: 8851028005050,
            waste_categoriesid: Number(catRecycle.id),
        }),
    ]);
    const [wasteSnackBag, wasteMilkBox, wasteJuiceBottle] = manualWastes;
    console.log(`  ✅ Created ${manualWastes.length} manual-only wastes\n`);
    console.log('♻️  Seeding Waste Sorting...');
    const sortingRepo = dataSource.getRepository(waste_sorting_entity_1.WasteSorting);
    const sortings = await sortingRepo.save([
        sortingRepo.create({
            name: 'ล้างทำความสะอาด',
            description: 'ล้างขวดน้ำให้สะอาดก่อนทิ้ง แกะฉลากออก',
            wastesid: Number(wasteBottle.id),
        }),
        sortingRepo.create({
            name: 'พับให้แบน',
            description: 'พับกล่องกระดาษให้แบนเพื่อประหยัดพื้นที่',
            wastesid: Number(wasteBox.id),
        }),
        sortingRepo.create({
            name: 'แยกฝา',
            description: 'แยกฝาขวดแก้วออก ล้างให้สะอาด',
            wastesid: Number(wasteGlass.id),
        }),
        sortingRepo.create({
            name: 'บีบให้แบน',
            description: 'บีบกระป๋องให้แบนเพื่อประหยัดพื้นที่',
            wastesid: Number(wasteCan.id),
        }),
        sortingRepo.create({
            name: 'ใส่ถังขยะเปียก',
            description: 'ทิ้งเปลือกผลไม้ในถังขยะเปียก / ขยะอินทรีย์',
            wastesid: Number(wasteFruit.id),
        }),
        sortingRepo.create({
            name: 'ทิ้งถังขยะทั่วไป',
            description: 'ล้างกล่องโฟมก่อนทิ้ง ทิ้งในถังขยะทั่วไป',
            wastesid: Number(wasteFoam.id),
        }),
    ]);
    console.log(`  ✅ Created ${sortings.length} waste sorting entries\n`);
    console.log('📖 Seeding Material Guides...');
    const guideRepo = dataSource.getRepository(material_guide_entity_1.MaterialGuide);
    const guides = await guideRepo.save([
        guideRepo.create({
            recommendation: 'ล้างขวดให้สะอาด แกะฉลากออก บีบให้แบน ส่งขายร้านรับซื้อของเก่า',
            weight: 0.03,
            waste_meterialid: Number(matPET.id),
            wastesid: Number(wasteBottle.id),
        }),
        guideRepo.create({
            recommendation: 'พับกล่องให้แบน มัดรวมกัน ส่งขายร้านรับซื้อของเก่าหรือบริจาค',
            weight: 0.15,
            waste_meterialid: Number(matPaper.id),
            wastesid: Number(wasteBox.id),
        }),
        guideRepo.create({
            recommendation: 'ล้างขวดให้สะอาด แยกฝาออก ส่งศูนย์รีไซเคิล',
            weight: 0.25,
            waste_meterialid: Number(matGlass.id),
            wastesid: Number(wasteGlass.id),
        }),
        guideRepo.create({
            recommendation: 'ล้างกระป๋อง บีบให้แบน ส่งขายร้านรับซื้อโลหะ',
            weight: 0.015,
            waste_meterialid: Number(matAluminum.id),
            wastesid: Number(wasteCan.id),
        }),
        guideRepo.create({
            recommendation: 'ทำปุ๋ยหมัก หรือทิ้งที่ถังขยะอินทรีย์',
            weight: 0.2,
            waste_meterialid: Number(matFood.id),
            wastesid: Number(wasteFruit.id),
        }),
        guideRepo.create({
            recommendation: 'หลีกเลี่ยงการใช้ ใช้ภาชนะทดแทน ทิ้งขยะทั่วไป',
            weight: 0.01,
            waste_meterialid: Number(matFoam.id),
            wastesid: Number(wasteFoam.id),
        }),
        guideRepo.create({
            recommendation: 'ล้างขวดให้สะอาด แกะฉลากพลาสติกออก แยกส่งรีไซเคิลตามประเภท',
            weight: 0.22,
            waste_meterialid: Number(matGlass.id),
            wastesid: Number(wasteJuiceBottle.id),
        }),
        guideRepo.create({
            recommendation: 'ฉลากพลาสติก: แกะออกจากขวดแก้ว ทิ้งถังรีไซเคิลพลาสติก',
            weight: 0.005,
            waste_meterialid: Number(matPET.id),
            wastesid: Number(wasteJuiceBottle.id),
        }),
    ]);
    console.log(`  ✅ Created ${guides.length} material guides\n`);
    console.log('🏭 Seeding Waste Management Methods...');
    const methodRepo = dataSource.getRepository(waste_management_method_entity_1.WasteManagementMethod);
    const methods = await methodRepo.save([
        methodRepo.create({
            name: 'รีไซเคิล (Recycle)',
            transport_km: 15.0,
            transport_co2e_per_km: 0.21,
        }),
        methodRepo.create({
            name: 'ฝังกลบ (Landfill)',
            transport_km: 30.0,
            transport_co2e_per_km: 0.25,
        }),
        methodRepo.create({
            name: 'เผา (Incineration)',
            transport_km: 25.0,
            transport_co2e_per_km: 0.23,
        }),
        methodRepo.create({
            name: 'ทำปุ๋ยหมัก (Composting)',
            transport_km: 5.0,
            transport_co2e_per_km: 0.15,
        }),
    ]);
    const methodRecycle = methods[0];
    const methodCompost = methods[3];
    console.log(`  ✅ Created ${methods.length} waste management methods\n`);
    console.log('📊 Seeding Waste History...');
    const historyRepo = dataSource.getRepository(waste_history_entity_1.WasteHistory);
    const histories = await historyRepo.save([
        historyRepo.create({
            amount: 10,
            record_type: 'scan',
            waste_meterialid: Number(matPET.id),
            wastesid: Number(wasteBottle.id),
            userid: savedUser.id,
            calculation_status: 'completed',
            carbon_footprint: 10 * 0.03 * 2.29 + 15.0 * 0.21,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 5,
            record_type: 'scan',
            waste_meterialid: Number(matPaper.id),
            wastesid: Number(wasteBox.id),
            userid: savedUser.id,
            calculation_status: 'completed',
            carbon_footprint: 5 * 0.15 * 1.17 + 15.0 * 0.21,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 4,
            record_type: 'scan',
            waste_meterialid: Number(matGlass.id),
            wastesid: Number(wasteGlass.id),
            userid: savedUser.id,
            calculation_status: 'completed',
            carbon_footprint: 4 * 0.25 * 0.86 + 15.0 * 0.21,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 3,
            record_type: 'scan',
            waste_meterialid: Number(matGlass.id),
            wastesid: Number(wasteJuiceBottle.id),
            userid: savedAdmin.id,
            calculation_status: 'pending',
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 8,
            record_type: 'scan',
            waste_meterialid: Number(matFoam.id),
            wastesid: Number(wasteFoam.id),
            userid: savedUser.id,
            calculation_status: 'pending',
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 2.5,
            record_type: 'manual',
            waste_meterialid: Number(matPET.id),
            wastesid: null,
            userid: savedUser.id,
            calculation_status: 'completed',
            carbon_footprint: 2.5 * 2.29 + 15.0 * 0.21,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 1.5,
            record_type: 'manual',
            waste_meterialid: Number(matPaper.id),
            wastesid: null,
            userid: savedUser.id,
            calculation_status: 'completed',
            carbon_footprint: 1.5 * 1.17 + 15.0 * 0.21,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 0.8,
            record_type: 'manual',
            waste_meterialid: Number(matAluminum.id),
            wastesid: Number(wasteCan.id),
            userid: savedAdmin.id,
            calculation_status: 'completed',
            carbon_footprint: 0.8 * 8.14 + 15.0 * 0.21,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 3.0,
            record_type: 'manual',
            waste_meterialid: Number(matFood.id),
            wastesid: null,
            userid: savedAdmin.id,
            calculation_status: 'completed',
            carbon_footprint: 3.0 * 0.58 + 5.0 * 0.15,
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 0.5,
            record_type: 'manual',
            waste_meterialid: Number(matFoam.id),
            wastesid: Number(wasteSnackBag.id),
            userid: savedUser.id,
            calculation_status: 'pending',
            retry_count: 0,
        }),
        historyRepo.create({
            amount: 2.0,
            record_type: 'manual',
            waste_meterialid: Number(matPaper.id),
            wastesid: Number(wasteMilkBox.id),
            userid: savedAdmin.id,
            calculation_status: 'pending',
            retry_count: 0,
        }),
    ]);
    console.log(`  ✅ Created ${histories.length} waste history records\n`);
    console.log('🔢 Seeding Waste Calculate Logs...');
    const calcLogRepo = dataSource.getRepository(waste_calculate_log_entity_1.WasteCalculateLog);
    const calcLogs = await calcLogRepo.save([
        calcLogRepo.create({
            waste_historyid: Number(histories[0].id),
            waste_management_methodid: Number(methodRecycle.id),
            amount: 10,
            material_emission: 10 * 0.03 * 2.29,
            transport_emission: 15.0 * 0.21,
            total_carbon_footprint: 10 * 0.03 * 2.29 + 15.0 * 0.21,
        }),
        calcLogRepo.create({
            waste_historyid: Number(histories[1].id),
            waste_management_methodid: Number(methodRecycle.id),
            amount: 5,
            material_emission: 5 * 0.15 * 1.17,
            transport_emission: 15.0 * 0.21,
            total_carbon_footprint: 5 * 0.15 * 1.17 + 15.0 * 0.21,
        }),
        calcLogRepo.create({
            waste_historyid: Number(histories[2].id),
            waste_management_methodid: Number(methodRecycle.id),
            amount: 4,
            material_emission: 4 * 0.25 * 0.86,
            transport_emission: 15.0 * 0.21,
            total_carbon_footprint: 4 * 0.25 * 0.86 + 15.0 * 0.21,
        }),
        calcLogRepo.create({
            waste_historyid: Number(histories[5].id),
            waste_management_methodid: Number(methodRecycle.id),
            amount: 2.5,
            material_emission: 2.5 * 2.29,
            transport_emission: 15.0 * 0.21,
            total_carbon_footprint: 2.5 * 2.29 + 15.0 * 0.21,
        }),
        calcLogRepo.create({
            waste_historyid: Number(histories[6].id),
            waste_management_methodid: Number(methodRecycle.id),
            amount: 1.5,
            material_emission: 1.5 * 1.17,
            transport_emission: 15.0 * 0.21,
            total_carbon_footprint: 1.5 * 1.17 + 15.0 * 0.21,
        }),
        calcLogRepo.create({
            waste_historyid: Number(histories[7].id),
            waste_management_methodid: Number(methodRecycle.id),
            amount: 0.8,
            material_emission: 0.8 * 8.14,
            transport_emission: 15.0 * 0.21,
            total_carbon_footprint: 0.8 * 8.14 + 15.0 * 0.21,
        }),
        calcLogRepo.create({
            waste_historyid: Number(histories[8].id),
            waste_management_methodid: Number(methodCompost.id),
            amount: 3.0,
            material_emission: 3.0 * 0.58,
            transport_emission: 5.0 * 0.15,
            total_carbon_footprint: 3.0 * 0.58 + 5.0 * 0.15,
        }),
    ]);
    console.log(`  ✅ Created ${calcLogs.length} waste calculate logs\n`);
    console.log('⚙️  Seeding Scheduler Settings...');
    const settingsRepo = dataSource.getRepository(scheduler_settings_entity_1.SchedulerSettings);
    const settings = await settingsRepo.save([
        settingsRepo.create({
            key: 'carbon_footprint_cron',
            value: '*/5 * * * *',
            label: 'Carbon Footprint Cron Schedule',
            description: 'Cron expression สำหรับ scheduler คำนวณ Carbon Footprint (ทุก 5 นาที)',
            type: 'string',
        }),
        settingsRepo.create({
            key: 'carbon_footprint_batch_size',
            value: '50',
            label: 'Batch Size',
            description: 'จำนวนรายการที่ต้องคำนวณต่อครั้ง',
            type: 'number',
        }),
        settingsRepo.create({
            key: 'carbon_footprint_max_retries',
            value: '3',
            label: 'Max Retries',
            description: 'จำนวนครั้งสูงสุดที่จะ retry เมื่อคำนวณล้มเหลว',
            type: 'number',
        }),
    ]);
    console.log(`  ✅ Created ${settings.length} scheduler settings\n`);
    console.log('🔒 Seeding Scheduler Lock...');
    const lockRepo = dataSource.getRepository(scheduler_lock_entity_1.SchedulerLock);
    await lockRepo.save(lockRepo.create({
        name: 'carbon_footprint_calculation',
        is_locked: false,
        locked_by: undefined,
    }));
    console.log(`  ✅ Created 1 scheduler lock\n`);
    console.log('═'.repeat(50));
    console.log('🎉 Database seeding completed successfully!');
    console.log('═'.repeat(50));
    console.log('');
    console.log('📋 Summary:');
    console.log(`   👤 Users:                   2 (admin + 1 user)`);
    console.log(`   📦 Waste Categories:        ${categories.length}`);
    console.log(`   🧪 Waste Materials:         ${materials.length}`);
    console.log(`   🗑️  Wastes:                  ${wastes.length + manualWastes.length} (${wastes.length} with guides + ${manualWastes.length} manual-only)`);
    console.log(`   ♻️  Waste Sorting:            ${sortings.length}`);
    console.log(`   📖 Material Guides:         ${guides.length} (includes 2 composite guides)`);
    console.log(`   🏭 Management Methods:      ${methods.length}`);
    console.log(`   📊 Waste History:           ${histories.length} (${histories.filter(h => h.record_type === 'scan').length} scan + ${histories.filter(h => h.record_type === 'manual').length} manual)`);
    console.log(`   🔢 Calculate Logs:          ${calcLogs.length}`);
    console.log(`   ⚙️  Scheduler Settings:      ${settings.length}`);
    console.log(`   🔒 Scheduler Locks:         1`);
    console.log('');
    console.log('🧪 Test Coverage:');
    console.log('   ✅ Scanned waste with MaterialGuide (single material)');
    console.log('   ✅ Scanned waste with composite materials (multiple guides)');
    console.log('   ✅ Manual entry with WasteMaterial (direct)');
    console.log('   ✅ Manual entry for waste without MaterialGuide');
    console.log('');
    console.log('🔑 Admin Login:');
    console.log('   Email:    admin@informatics.buu.ac.th');
    console.log('   Password: Admin@1234');
    console.log('');
}
//# sourceMappingURL=seed.js.map