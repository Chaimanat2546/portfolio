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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let AdminService = class AdminService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers(search, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const whereCondition = [];
        if (search && search.trim()) {
            const searchTerm = `%${search.trim()}%`;
            whereCondition.push({ firstName: (0, typeorm_2.Like)(searchTerm) }, { lastName: (0, typeorm_2.Like)(searchTerm) }, { email: (0, typeorm_2.Like)(searchTerm) });
        }
        const [users, total] = await this.userRepository.findAndCount({
            where: whereCondition.length > 0 ? whereCondition : undefined,
            select: [
                'id',
                'email',
                'firstName',
                'lastName',
                'phoneNumber',
                'province',
                'profilePicture',
                'isActive',
                'role',
                'provider',
                'createdAt',
            ],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async toggleUserStatus(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งาน');
        }
        user.isActive = !user.isActive;
        await this.userRepository.save(user);
        const statusText = user.isActive ? 'ปลดระงับบัญชี' : 'ระงับบัญชี';
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
            },
            message: `${statusText}สำเร็จ`,
        };
    }
    async getUserById(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: [
                'id',
                'email',
                'firstName',
                'lastName',
                'phoneNumber',
                'province',
                'profilePicture',
                'isActive',
                'role',
                'provider',
                'createdAt',
                'updatedAt',
            ],
        });
        if (!user) {
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งาน');
        }
        return user;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map