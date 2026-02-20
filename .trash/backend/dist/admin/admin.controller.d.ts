import { AdminService } from './admin.service';
import { GetUsersQueryDto } from './dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getAllUsers(query: GetUsersQueryDto): Promise<{
        users: Partial<import("../users/user.entity").User>[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: string): Promise<Partial<import("../users/user.entity").User>>;
    toggleUserStatus(id: string): Promise<{
        user: Partial<import("../users/user.entity").User>;
        message: string;
    }>;
}
