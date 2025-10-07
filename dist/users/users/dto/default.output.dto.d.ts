export declare class UserOutputDto {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    isIndicated: boolean;
    indicatedById?: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}
