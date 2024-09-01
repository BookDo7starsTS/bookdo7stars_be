import bookService from '../../src/services/bookService';
import Book from '../../src/models/book';

// Mock the Book model
jest.mock('../../src/models/book');

describe('bookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load all books in Book table in the database', async () => {
    const mockBooks = [
      {
        id: '1',
        isbn: 'xxx',
        title: 'book1',
        author: 'author1',
        description: 'description1',
        cover: 'cover1',
        stockStatus: 'xx',
        categoryId: 'id1',
        mileage: 1,
        categoryName: 'cat1',
        publisher: 'publisher1',
        adult: true,
        fixedPrice: true,
        priceStandard: 100,
        priceSales: 90,
        customerReviewRank: 10,
        queryType: 'queryType1',
        deleted: false,
      },
      {
        id: '2',
        isbn: 'xxx2',
        title: 'book2',
        author: 'author2',
        description: 'description2',
        cover: 'cover2',
        stockStatus: 'xx2',
        categoryId: 'id2',
        mileage: 2,
        categoryName: 'cat1',
        publisher: 'publisher2',
        adult: true,
        fixedPrice: true,
        priceStandard: 100,
        priceSales: 90,
        customerReviewRank: 10,
        queryType: 'queryType1',
        deleted: false,
      },
    ];
    Book.findAll.mockResolvedValue(mockBooks);

    const result = await bookService.getAllBooks();

    expect(result).toEqual(mockBooks);
  });
});

describe('bookService.getBooksByQueryType', () => {
  it('should return books filtered by queryType with pagination', async () => {
    // 가짜 데이터 설정
    const mockBooks = [
      { id: 3, title: 'Book 3', queryType: 'ItemNewAll' },
      { id: 2, title: 'Book 2', queryType: 'ItemNewAll' },
    ];

    Book.findAll.mockResolvedValue(mockBooks);

    const queryType = 'ItemNewAll';
    const page = 2;
    const pageSize = 50;

    // getBooksByQueryType 호출
    const result = await bookService.getBooksByQueryType(queryType, page, pageSize);

    // Book.findAll이 정확한 매개변수로 호출되었는지 확인
    expect(Book.findAll).toHaveBeenCalledWith({
      limit: 50,
      offset: 50,
      where: { queryType },
      order: [['id', 'DESC']],
    });

    // 결과가 mockBooks와 일치하는지 확인
    expect(result).toEqual(mockBooks);
  });

  it('should handle empty results', async () => {
    // Book.findAll이 빈 배열을 반환하도록 설정
    Book.findAll.mockResolvedValue([]);

    const queryType = 'ItemNewAll';
    const page = 3;
    const pageSize = 17;

    const result = await bookService.getBooksByQueryType(queryType, page, pageSize);

    expect(Book.findAll).toHaveBeenCalledWith({
      limit: 17,
      offset: 34,
      where: { queryType },
      order: [['id', 'DESC']],
    });

    // 빈 결과가 반환되는지 확인
    expect(result).toEqual([]);
  });

  it('should throw an error if findAll fails', async () => {
    // Book.findAll에서 에러를 던지도록 설정
    Book.findAll.mockRejectedValue(new Error('Database error'));

    const queryType = 'ItemNewAll';
    const page = 1;
    const pageSize = 2;

    // 에러가 발생하는지 확인
    await expect(bookService.getBooksByQueryType(queryType, page, pageSize)).rejects.toThrow('Database error');
  });
});
