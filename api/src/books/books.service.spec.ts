import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../users/entities/user.entity';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() deve chamar repository.create e repository.save com os dados corretos', async () => {
    const dto: CreateBookDto = {
      title: 'Test',
      author: 'Author',
      publisher: 'Editora Teste',
    };

    const mockUser: User = { id: 1 } as User;

    const createdBook: Book = {
      id: 1,
      title: dto.title,
      author: dto.author,
      publisher: dto.publisher,
      genre: undefined,
      status: BookStatus.TO_READ,
      progress: 0,
      user: mockUser,
    };

    (repository.create as jest.Mock).mockReturnValue(createdBook);
    (repository.save as jest.Mock).mockResolvedValue(createdBook);

    const result = await service.create(mockUser.id, dto);

    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      user: { id: mockUser.id },
    });
    expect(repository.save).toHaveBeenCalledWith(createdBook);
    expect(result).toEqual(createdBook);
  });
});
