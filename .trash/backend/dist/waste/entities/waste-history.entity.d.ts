import { Waste } from './waste.entity';
import { User } from '../../users/user.entity';
import { WasteMaterial } from './waste-material.entity';
import { WasteCalculateLog } from './waste-calculate-log.entity';
export declare class WasteHistory {
    id: number;
    amount: number;
    record_type: string;
    create_at: Date;
    waste_meterialid: number;
    wastesid: number | null;
    userid: number;
    calculation_status: string;
    carbon_footprint: number;
    retry_count: number;
    last_calculation_attempt: Date;
    error_message: string;
    waste: Waste;
    user: User;
    wasteMaterial: WasteMaterial;
    wasteCalculateLogs: WasteCalculateLog[];
}
