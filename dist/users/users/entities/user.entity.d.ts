export declare class User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    isActive: boolean;
    isIndicated: boolean;
    indicatedById: number;
    lastLoginAt: Date;
    updatedAt: Date;
    createdAt: Date;
}
