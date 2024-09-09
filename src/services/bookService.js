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

  async getBooksByQueryType(queryType, page, pageSize) {
    const { limit, offset } = this.getPagination(page, pageSize);
    try {
      const query = {
        where: { queryType },
        order: [['pubDate', 'DESC']], //내림차순(DESC)으로 설정한 이유는 최신 항목이 먼저 표시되도록 하기 위함
        limit, // 가져올 항목의 수
        offset, //DB쿼리에서 결과 집합에서 시작할 지점을 지정하는 용도로 사용(페이지네이션 구현할 때 자주 사용)
      };

      const books = await Book.findAll(query);
      return books;
    } catch (error) {
      console.error('Error fetching books', error);
      throw new Error('Failed to fetch books');
    }
  }

  getPagination(page, pageSize) {
    const limit = pageSize ? +pageSize : 20; // 페이지 크기가 없으면 기본값 20
    const offset = page ? (page - 1) * limit : 0; // 페이지에 따라 시작 지점 계산
    return { limit, offset };
  }
}

export default new BookService();
