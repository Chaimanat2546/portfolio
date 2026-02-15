import { WasteCalculateLog } from './waste-calculate-log.entity';
export declare class WasteManagementMethod {
    id: number;
    name: string;
    transport_km: number;
    transport_co2e_per_km: number;
    wasteCalculateLogs: WasteCalculateLog[];
}
