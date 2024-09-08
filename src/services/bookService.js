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

  async getBooksByQueryType(queryType) {
    const books = await Book.findAll({
      where: {
        queryType,
      },
    });

    if (books.length === 0) {
      throw new Error('No books found for this group');
    }

    return books;
  }
}

export default new BookService();
