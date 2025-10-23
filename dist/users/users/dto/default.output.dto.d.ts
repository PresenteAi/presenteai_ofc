export declare class UserOutputDto {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    isIndicated: boolean;
    indicatedById?: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}
