import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1, name: 'Test', email: 'test@test.com', password: 'hashed' }),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = { name: 'Test', email: 'test@test.com', password: '123456' };
    const result = await service.register(dto);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', 'Test');
    expect(result).toHaveProperty('email', 'test@test.com');
    expect(result).not.toHaveProperty('password');
  });
});
