import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, UpdateProfileDto, ChangeEmailDto, DeleteAccountDto, ChangePasswordDto } from './dto';
import { EmailService } from './services/email.service';
export interface OAuthUserData {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    provider: string;
    providerId: string;
}
export declare class AuthService {
    private userRepository;
    private jwtService;
    private emailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, emailService: EmailService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    recoverAccount(email: string, password: string): Promise<{
        message: string;
        canRecover: boolean;
    }>;
    checkRecoverableAccount(email: string): Promise<{
        isRecoverable: boolean;
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    validateOAuthUser(userData: OAuthUserData): Promise<User>;
    generateJwtToken(user: User): string;
    getProfile(userId: string): Promise<Partial<User>>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Partial<User>>;
    changeEmail(userId: string, changeEmailDto: ChangeEmailDto): Promise<{
        message: string;
        user: Partial<User>;
    }>;
    deleteAccount(userId: string, deleteAccountDto: DeleteAccountDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
