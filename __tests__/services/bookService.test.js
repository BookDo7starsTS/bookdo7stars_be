import bookService from '../../src/services/bookService';
import Book from '../../src/models/book';
import { mockBooks } from '../models/Book';
// Mock the Book model
jest.mock('../../src/models/book');

describe('bookService', () => {
  let req;
  beforeEach(() => {
    req = {
      params: {
        groupName: 'BlogBest',
      },
      query: {
        page: '1',
        pageSize: '1',
      },
    };

    jest.clearAllMocks();
  });

  it('should load all books in Book table in the database', async () => {
    Book.findAll.mockResolvedValue(mockBooks);

    const result = await bookService.getAllBooks();

    expect(result).toEqual(mockBooks);
  });
  it('should load only blogbest books in Book table in the database, when the queryType is BlogBest.', async () => {
    const groupName = req.params.groupName;
    const { page, pageSize } = req.query;

    Book.findAll.mockResolvedValue(mockBooks);

    const result = await bookService.getBooksByQueryType(groupName, page, pageSize);

    expect(result).toEqual(mockBooks);
  });

  it('should give you only one BlogBest book, when pageSize(limit) is 1', async () => {
    const groupName = req.params.groupName;
    const page = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    Book.findAll.mockImplementation(({ limit, offset }) => {
      return Promise.resolve(mockBooks.slice(offset, offset + limit));
    });

    const result = await bookService.getBooksByQueryType(groupName, page, pageSize);

    expect(result).toEqual(mockBooks.slice(0, 1));
    expect(result.length).toEqual(1);
  });
});
