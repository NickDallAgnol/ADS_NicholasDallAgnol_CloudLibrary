import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Estratégia de validação JWT
 * Extrai e valida tokens do header Authorization
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }

  // Extrai os dados do usuário do payload do token
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}

