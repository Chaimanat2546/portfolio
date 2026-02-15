"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const seed_1 = require("./seed");
(0, dotenv_1.config)();
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
async function runSeeder() {
    console.log('🔌 Connecting to database...');
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'informatics_go_green',
        entities: [
            user_entity_1.User,
            waste_category_entity_1.WasteCategory,
            waste_material_entity_1.WasteMaterial,
            waste_entity_1.Waste,
            waste_history_entity_1.WasteHistory,
            waste_sorting_entity_1.WasteSorting,
            material_guide_entity_1.MaterialGuide,
            waste_calculate_log_entity_1.WasteCalculateLog,
            waste_management_method_entity_1.WasteManagementMethod,
            scheduler_settings_entity_1.SchedulerSettings,
            scheduler_lock_entity_1.SchedulerLock,
        ],
        synchronize: true,
    });
    try {
        await dataSource.initialize();
        console.log('✅ Database connected successfully!');
        await (0, seed_1.seedDatabase)(dataSource);
        await dataSource.destroy();
        console.log('👋 Database connection closed.');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error running seeder:', error);
        process.exit(1);
    }
}
void runSeeder();
//# sourceMappingURL=run-seed.js.map