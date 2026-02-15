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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../users/user.entity");
const email_service_1 = require("./services/email.service");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    emailService;
    constructor(userRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName } = registerDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const deletedUser = await this.userRepository.findOne({
            where: { email },
            withDeleted: true,
        });
        if (deletedUser && deletedUser.deletedAt) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            deletedUser.password = hashedPassword;
            deletedUser.firstName = firstName;
            deletedUser.lastName = lastName;
            deletedUser.deletedAt = null;
            deletedUser.deletionRequestedAt = null;
            deletedUser.anonymizedAt = null;
            deletedUser.isActive = true;
            deletedUser.provider = 'local';
            await this.userRepository.save(deletedUser);
            return { message: 'Account recovered and updated successfully' };
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            provider: 'local',
        });
        await this.userRepository.save(user);
        return { message: 'Registration successful' };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const deletedUser = await this.userRepository.findOne({
            where: { email },
            withDeleted: true,
        });
        if (deletedUser && deletedUser.deletedAt) {
            throw new common_1.UnauthorizedException('บัญชีนี้ถูกลบแล้ว กรุณาสมัครสมาชิกใหม่เพื่อกู้คืนบัญชี');
        }
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('This account uses social login. Please login with Google.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        const userWithoutSensitiveData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            province: user.province,
            profilePicture: user.profilePicture,
            provider: user.provider,
            providerId: user.providerId,
            role: user.role,
            isActive: user.isActive,
            deletedAt: user.deletedAt,
            deletionRequestedAt: user.deletionRequestedAt,
            anonymizedAt: user.anonymizedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return {
            accessToken,
            user: userWithoutSensitiveData,
        };
    }
    async recoverAccount(email, password) {
        const deletedUser = await this.userRepository.findOne({
            where: { email },
            withDeleted: true,
        });
        if (!deletedUser) {
            throw new common_1.NotFoundException('ไม่พบบัญชีที่ใช้อีเมลนี้');
        }
        if (!deletedUser.deletedAt) {
            throw new common_1.BadRequestException('บัญชีนี้ยังใช้งานได้ปกติ สามารถเข้าสู่ระบบได้เลย');
        }
        if (deletedUser.anonymizedAt) {
            throw new common_1.BadRequestException('บัญชีนี้ถูกลบถาวรแล้ว ไม่สามารถกู้คืนได้');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        deletedUser.password = hashedPassword;
        deletedUser.deletedAt = null;
        deletedUser.deletionRequestedAt = null;
        deletedUser.isActive = true;
        await this.userRepository.save(deletedUser);
        return {
            message: 'กู้คืนบัญชีสำเร็จ สามารถเข้าสู่ระบบได้แล้ว',
            canRecover: true,
        };
    }
    async checkRecoverableAccount(email) {
        const deletedUser = await this.userRepository.findOne({
            where: { email },
            withDeleted: true,
        });
        if (!deletedUser) {
            return { isRecoverable: false, message: 'ไม่พบบัญชีที่ใช้อีเมลนี้' };
        }
        if (!deletedUser.deletedAt) {
            return { isRecoverable: false, message: 'บัญชีนี้ยังใช้งานได้ปกติ' };
        }
        if (deletedUser.anonymizedAt) {
            return { isRecoverable: false, message: 'บัญชีนี้ถูกลบถาวรแล้ว' };
        }
        return {
            isRecoverable: true,
            message: 'บัญชีนี้สามารถกู้คืนได้',
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            return {
                message: 'หากอีเมลของคุณลงทะเบียนไว้ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน',
            };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await this.userRepository.save(user);
        try {
            await this.emailService.sendPasswordResetEmail(email, resetToken);
        }
        catch {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = null;
            await this.userRepository.save(user);
            throw new common_1.BadRequestException('ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        }
        return {
            message: 'หากอีเมลของคุณลงทะเบียนไว้ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน',
        };
    }
    async resetPassword(token, resetPasswordDto) {
        const { password } = resetPasswordDto;
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.userRepository.findOne({
            where: {
                resetPasswordToken: tokenHash,
                resetPasswordExpires: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = null;
        await this.userRepository.save(user);
        return { message: 'Password reset successful' };
    }
    async validateOAuthUser(userData) {
        const { email, firstName, lastName, profilePicture, provider, providerId } = userData;
        let user = await this.userRepository.findOne({
            where: [{ email }, { provider, providerId }],
        });
        if (user) {
            let needsSave = false;
            if (user.provider !== provider) {
                user.provider = provider;
                user.providerId = providerId;
                needsSave = true;
            }
            if (profilePicture && user.profilePicture !== profilePicture) {
                user.profilePicture = profilePicture;
                needsSave = true;
            }
            if (needsSave) {
                await this.userRepository.save(user);
            }
            return user;
        }
        const deletedUser = await this.userRepository.findOne({
            where: [{ email }, { provider, providerId }],
            withDeleted: true,
        });
        if (deletedUser && deletedUser.deletedAt) {
            if (deletedUser.anonymizedAt) {
                user = this.userRepository.create({
                    email,
                    firstName,
                    lastName,
                    profilePicture,
                    provider,
                    providerId,
                });
                await this.userRepository.save(user);
                return user;
            }
            deletedUser.firstName = firstName;
            deletedUser.lastName = lastName;
            if (profilePicture) {
                deletedUser.profilePicture = profilePicture;
            }
            deletedUser.provider = provider;
            deletedUser.providerId = providerId;
            deletedUser.deletedAt = null;
            deletedUser.deletionRequestedAt = null;
            deletedUser.isActive = true;
            await this.userRepository.save(deletedUser);
            return deletedUser;
        }
        user = this.userRepository.create({
            email,
            firstName,
            lastName,
            profilePicture,
            provider,
            providerId,
        });
        await this.userRepository.save(user);
        return user;
    }
    generateJwtToken(user) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userWithoutSensitiveData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            province: user.province,
            profilePicture: user.profilePicture,
            provider: user.provider,
            providerId: user.providerId,
            role: user.role,
            isActive: user.isActive,
            deletedAt: user.deletedAt,
            deletionRequestedAt: user.deletionRequestedAt,
            anonymizedAt: user.anonymizedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        return userWithoutSensitiveData;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateProfileDto.firstName !== undefined) {
            user.firstName = updateProfileDto.firstName;
        }
        if (updateProfileDto.lastName !== undefined) {
            user.lastName = updateProfileDto.lastName;
        }
        if (updateProfileDto.phoneNumber !== undefined) {
            user.phoneNumber = updateProfileDto.phoneNumber;
        }
        if (updateProfileDto.province !== undefined) {
            user.province = updateProfileDto.province;
        }
        if (updateProfileDto.profilePicture !== undefined) {
            user.profilePicture = updateProfileDto.profilePicture;
        }
        await this.userRepository.save(user);
        return this.getProfile(userId);
    }
    async changeEmail(userId, changeEmailDto) {
        const { newEmail, password } = changeEmailDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('ไม่พบผู้ใช้');
        }
        if (!user.password) {
            throw new common_1.BadRequestException('บัญชีนี้ใช้ Google Login ไม่สามารถเปลี่ยนอีเมลได้');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
        }
        const existingUser = await this.userRepository.findOne({
            where: { email: newEmail },
        });
        if (existingUser && existingUser.id !== userId) {
            throw new common_1.ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
        }
        user.email = newEmail;
        await this.userRepository.save(user);
        const updatedUser = await this.getProfile(userId);
        return {
            message: 'เปลี่ยนอีเมลสำเร็จ',
            user: updatedUser,
        };
    }
    async deleteAccount(userId, deleteAccountDto) {
        const { password } = deleteAccountDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('ไม่พบผู้ใช้');
        }
        if (user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
            }
        }
        user.deletionRequestedAt = new Date();
        await this.userRepository.softRemove(user);
        return { message: 'ลบบัญชีสำเร็จ' };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('ไม่พบผู้ใช้');
        }
        if (!user.password) {
            throw new common_1.BadRequestException('บัญชีนี้ใช้ Google Login ไม่สามารถเปลี่ยนรหัสผ่านได้');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return { message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map