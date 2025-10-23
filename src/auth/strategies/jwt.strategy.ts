import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users/users.service';

export interface JwtPayload {
  sub: number; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
    
    console.log('JWT Strategy initialized with secret:', 
      process.env.JWT_SECRET ? 'FROM_ENV' : 'DEFAULT_SECRET');
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Strategy validating payload:', JSON.stringify(payload, null, 2));
    console.log('Looking for user with ID:', payload.sub, 'type:', typeof payload.sub);
    
    try {
      const user = await this.usersService.findById(payload.sub);
      console.log('User found:', user ? 'YES' : 'NO');
      
      if (!user) {
        console.log('User not found in database');
        throw new UnauthorizedException('User not found');
      }
      
      console.log('JWT validation successful for user:', user.email);
      return user;
    } catch (error) {
      console.error('Error during JWT validation:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
}