// api/src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo registro de usuário no banco de dados.
   * @param createUserDto Os dados para o novo usuário.
   * @returns O usuário salvo.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  /**
   * Encontra um usuário pelo seu endereço de email.
   * @param email O email a ser procurado.
   * @returns O usuário encontrado ou null.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Encontra um usuário pelo seu ID.
   * @param id O ID do usuário.
   * @returns O usuário encontrado ou null.
   */
  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}