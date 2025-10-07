import { UsersService } from '../users/users/users.service';
export declare class DebugController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        success: boolean;
        count: number;
        users: import("../users/users/dto/default.output.dto").UserOutputDto[];
        error?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        error: any;
        stack: any;
        count?: undefined;
        users?: undefined;
    }>;
    testFindUser(): Promise<{
        success: boolean;
        user: import("../users/users/dto/default.output.dto").UserOutputDto;
        error?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        error: any;
        stack: any;
        user?: undefined;
    }>;
    createTestUser(): Promise<{
        success: boolean;
        user: import("../users/users/dto/default.output.dto").UserOutputDto;
        error?: undefined;
        stack?: undefined;
    } | {
        success: boolean;
        error: any;
        stack: any;
        user?: undefined;
    }>;
}
