import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('JwtAuthGuard - canActivate called');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('All headers:', JSON.stringify(request.headers, null, 2));
    console.log('Authorization header:', authHeader ? authHeader.substring(0, 20) + '...' : 'MISSING');
    
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    console.log('Route is public:', isPublic);
    
    if (isPublic) {
      console.log('Public route, allowing access');
      return true;
    }
    
    if (!authHeader) {
      console.log('No authorization header found - returning false');
      return false;
    }
    
    console.log('Authorization header found, calling super.canActivate()');
    return super.canActivate(context);
  }
}