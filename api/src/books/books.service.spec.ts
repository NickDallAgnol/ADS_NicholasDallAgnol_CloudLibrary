// src/books/books.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BooksService', () => {
  let service: BooksService;

  const createPrismaMock = () => {
    const book = {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
    const $transaction = jest.fn(async (cb: any) => cb?.({ book }));
    return { book, $transaction };
  };
  let prismaMock: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create() deve chamar prisma.book.create com os defaults corretos', async () => {
    prismaMock.book.create.mockResolvedValue({
      id: 1,
      title: 'Test',
      author: 'Author',
      publisher: null,
      genre: null,
      status: 'A LER',
      progress: 0,
      userId: 1,
    });

    const result = await service.create(1, {
      title: 'Test',
      author: 'Author',
      publisher: 'Editora Teste',
    } as any);

    expect(prismaMock.book.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Test',
          author: 'Author',
          publisher: null,
          genre: null,
          status: 'A LER',
          progress: 0,
          userId: 1,
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'Test',
        author: 'Author',
        status: 'A LER',
        progress: 0,
        userId: 1,
      }),
    );
  });
});
