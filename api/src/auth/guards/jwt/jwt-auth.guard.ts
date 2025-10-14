import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('👀 JwtAuthGuard acionado');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    console.log('👀 handleRequest:', { err, user, info });
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
