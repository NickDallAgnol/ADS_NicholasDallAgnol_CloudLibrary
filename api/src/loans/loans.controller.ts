import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';

/**
 * Controller de empréstimos
 * Gerencia empréstimos de livros entre usuários
 */
@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateLoanDto) {
    return this.loansService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.loansService.findAll(req.user.id, query);
  }

  // Lista livros que o usuário pegou emprestado
  @Get('borrowed/me')
  findBorrowed(@Request() req: any, @Query() query: any) {
    return this.loansService.findBorrowed(req.user.id, query);
  }

  @Get(':id')
  findOne(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.loansService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLoanDto,
  ) {
    return this.loansService.update(req.user.id, id, dto);
  }

  @Patch(':id/return')
  returnLoan(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.loansService.returnLoan(req.user.id, id);
  }

  @Delete(':id')
  remove(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.loansService.remove(req.user.id, id);
  }
}
