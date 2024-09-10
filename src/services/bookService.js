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

    page = Number.isInteger(parseInt(page)) && parseInt(page) > 0 ? parseInt(page) : 1;
    pageSize = Number.isInteger(parseInt(pageSize)) && parseInt(pageSize) > 0 ? parseInt(pageSize) : 20;

    const books = await Book.findAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: {
        queryType,
      },
      order: [['id', 'DESC']],
    });

    return books;
  }
}

export default new BookService();
