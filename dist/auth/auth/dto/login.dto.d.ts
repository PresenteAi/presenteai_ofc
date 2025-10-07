export declare class LoginDto {
    email: string;
    password: string;
}
export declare class LoginResponseDto {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
