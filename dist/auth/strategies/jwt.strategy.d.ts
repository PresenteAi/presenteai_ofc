import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users/users.service';
export interface JwtPayload {
    sub: number;
    email: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<import("../../users/users/dto/default.output.dto").UserOutputDto>;
}
export {};
