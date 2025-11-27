import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator customizado para extrair o ID do usuário autenticado
 * Simplifica a obtenção do userId nos controllers
 */
export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Extrai o ID do payload JWT
    return request.user?.sub ?? request.user?.id;
  },
);