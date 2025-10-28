import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
