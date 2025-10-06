// src/auth/strategy/jwt.strategy.ts
// src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = { sub: string; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // >>> chave certa e non-null assertion <<<
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      // Se preferir, pode usar: secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: JwtPayload) {
    // o que cai em request.user
    return { sub: payload.sub, email: payload.email };
  }
}
