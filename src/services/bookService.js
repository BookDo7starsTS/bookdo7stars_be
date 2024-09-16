import Book from '../models/book.js';

class BookService {
  async getAllBooks() {
    const books = await Book.findAll();
    return books;
  }

  async getBookDetailById(id) {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async getBooksByQueryType(queryType, page = 1, pageSize = 20) {
    if (!queryType) {
      throw new Error('Invalid query type');
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    pageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 20;

    const order = queryType === 'Bestseller' ? [['salespoint', 'DESC']] : [['pubDate', 'DESC']];

    const books = await Book.findAll({
      where: {
        queryType,
      },
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return books;
  }
}

export default new BookService();
