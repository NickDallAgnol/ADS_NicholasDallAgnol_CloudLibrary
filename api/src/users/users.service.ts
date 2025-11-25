import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.password !== undefined) user.password = updateUserDto.password;
    if (updateUserDto.favoriteBook !== undefined) user.favoriteBook = updateUserDto.favoriteBook;
    if (updateUserDto.favoriteAuthor !== undefined) user.favoriteAuthor = updateUserDto.favoriteAuthor;
    if (updateUserDto.favoriteGenre !== undefined) user.favoriteGenre = updateUserDto.favoriteGenre;
    if (updateUserDto.yearlyReadingGoal !== undefined) user.yearlyReadingGoal = updateUserDto.yearlyReadingGoal;
    if (updateUserDto.bio !== undefined) user.bio = updateUserDto.bio;
    if (updateUserDto.avatarUrl !== undefined) user.avatarUrl = updateUserDto.avatarUrl;
    
    return this.usersRepository.save(user);
  }

  // MÉTODOS COMENTADOS POR SEGURANÇA
  // Não devem estar disponíveis em produção
  // Descomentar apenas para desenvolvimento/testes quando necessário
  
  /*
  async resetDatabase(): Promise<any> {
    // ⚠️ PERIGOSO: Deleta TODOS os dados
    await this.usersRepository.query('DELETE FROM loans');
    await this.usersRepository.query('DELETE FROM books');
    await this.usersRepository.query('DELETE FROM users');
    
    await this.usersRepository.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await this.usersRepository.query('ALTER SEQUENCE books_id_seq RESTART WITH 1');
    await this.usersRepository.query('ALTER SEQUENCE loans_id_seq RESTART WITH 1');
    
    return {
      message: 'Banco de dados limpo com sucesso!',
      deletedTables: ['loans', 'books', 'users'],
      sequencesReset: true
    };
  }

  async deleteInvalidUsers(): Promise<any> {
    const validDomainPattern = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|icloud|protonmail|live|msn|aol|zoho|mail|yandex|tutanota)\.(com|br|net|org|co\.uk|de|fr|es|it|pt)$/i;
    
    const allUsers = await this.usersRepository.find();
    const invalidUsers: any[] = [];
    const validUsers: any[] = [];
    
    for (const user of allUsers) {
      if (!validDomainPattern.test(user.email)) {
        invalidUsers.push({ id: user.id, name: user.name, email: user.email });
        await this.usersRepository.delete(user.id);
      } else {
        validUsers.push({ id: user.id, name: user.name, email: user.email });
      }
    }
    
    return {
      message: `${invalidUsers.length} usuário(s) inválido(s) removido(s)`,
      deletedUsers: invalidUsers,
      remainingUsers: validUsers,
      total: {
        deleted: invalidUsers.length,
        remaining: validUsers.length
      }
    };
  }
  */
}
