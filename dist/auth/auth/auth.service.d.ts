import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users/users.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    private validateLoginDto;
}
