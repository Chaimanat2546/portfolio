"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const waste_scanbarcode_controller_1 = require("./controllers/waste-scanbarcode.controller");
const waste_scanbarcode_service_1 = require("./services/waste-scanbarcode.service");
const user_entity_1 = require("../users/user.entity");
const waste_history_controller_1 = require("./controllers/waste-history.controller");
const waste_history_service_1 = require("./services/waste-history.service");
const waste_sorting_controller_1 = require("./controllers/waste-sorting.controller");
const waste_sorting_service_1 = require("./services/waste-sorting.service");
let WasteModule = class WasteModule {
};
exports.WasteModule = WasteModule;
exports.WasteModule = WasteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.WasteCategory,
                entities_1.Waste,
                entities_1.WasteHistory,
                entities_1.WasteSorting,
                entities_1.WasteMaterial,
                entities_1.MaterialGuide,
                user_entity_1.User,
            ]),
        ],
        controllers: [
            waste_scanbarcode_controller_1.WasteScannerController,
            waste_history_controller_1.WasteHistoryController,
            waste_sorting_controller_1.WasteSortingController,
        ],
        providers: [waste_scanbarcode_service_1.WasteScannerService, waste_history_service_1.WasteHistoryService, waste_sorting_service_1.WasteSortingService],
        exports: [typeorm_1.TypeOrmModule],
    })
], WasteModule);
//# sourceMappingURL=waste.module.js.map