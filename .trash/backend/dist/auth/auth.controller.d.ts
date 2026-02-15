import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, UpdateProfileDto, ChangeEmailDto, DeleteAccountDto, ChangePasswordDto, RecoverAccountDto, CheckRecoverableDto } from './dto';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
interface RequestWithUser extends Request {
    user: User;
}
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: RequestWithUser, res: Response): void;
    getProfile(req: RequestWithUser): Promise<Partial<User>>;
    updateProfile(req: RequestWithUser, updateProfileDto: UpdateProfileDto): Promise<Partial<User>>;
    changeEmail(req: RequestWithUser, changeEmailDto: ChangeEmailDto): Promise<{
        message: string;
        user: Partial<User>;
    }>;
    deleteAccount(req: RequestWithUser, deleteAccountDto: DeleteAccountDto): Promise<{
        message: string;
    }>;
    changePassword(req: RequestWithUser, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    recoverAccount(recoverAccountDto: RecoverAccountDto): Promise<{
        message: string;
        canRecover: boolean;
    }>;
    checkRecoverable(checkRecoverableDto: CheckRecoverableDto): Promise<{
        isRecoverable: boolean;
        message: string;
    }>;
}
export {};
