import { WasteHistory } from './waste-history.entity';
import { WasteManagementMethod } from './waste-management-method.entity';
export declare class WasteCalculateLog {
    id: number;
    create_at: Date;
    waste_historyid: number;
    waste_management_methodid: number;
    amount: number;
    material_emission: number;
    transport_emission: number;
    total_carbon_footprint: number;
    wasteHistory: WasteHistory;
    wasteManagementMethod: WasteManagementMethod;
}
