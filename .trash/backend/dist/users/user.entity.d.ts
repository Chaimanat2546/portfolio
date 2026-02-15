export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    province: string;
    profilePicture: string;
    isActive: boolean;
    role: string;
    provider: string;
    providerId: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date | null;
    deletedAt: Date | null;
    deletionRequestedAt: Date | null;
    anonymizedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
