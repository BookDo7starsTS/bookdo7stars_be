import Book from '../models/book.js';

class BookService {
  async getAllBooks() {
    const books = await Book.findAll();
    return books;
  }

  async getBookDetailById(id) {
    const book = await Book.findByPk(id);
    return book;
  }

  async getBooksByQueryType(queryType, page, pageSize) {
    const offset = (page - 1) * pageSize; // 시작할 데이터 위치
    const books = await Book.findAll({ where: { queryType: queryType }, limit: pageSize, offset: offset });

    if (!books) {
      throw new Error('Books are not found');
    } else {
      return books;
    }
  }
}

export default new BookService();
