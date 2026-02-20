import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class AdminService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(search?: string, page?: number, limit?: number): Promise<{
        users: Partial<User>[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    toggleUserStatus(userId: string): Promise<{
        user: Partial<User>;
        message: string;
    }>;
    getUserById(userId: string): Promise<Partial<User>>;
}
