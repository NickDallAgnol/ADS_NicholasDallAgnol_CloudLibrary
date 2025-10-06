import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // ajuste conforme seu JwtStrategy: geralmente request.user = { sub, email, ... }
    return request.user?.sub ?? request.user?.id;
  },
);