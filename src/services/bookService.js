import Book from '../models/book.js';
import BookQueryType from '../models/bookQueryType.js';
import { QueryType } from '../enum/queryTypeEnum.js';
import { Op } from 'sequelize';

class BookService {
  async getAllBooks(page = 1, pageSize = 50) {
    const order = [
      ['title', 'ASC'],
      ['author', 'DESC'],
    ];

    const books = await Book.findAndCountAll({
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    return books;
  }

  async getSearchedBooks(
    page = 1,
    pageSize = 20,
    searchTarget,
    searchTerm,
    title,
    author,
    publisher,
    start_date,
    orderTerm,
  ) {
    if (searchTarget) {
      // TODO 통합검색
      return;
    }
    const currentDate = new Date().toISOString().slice(0, 10);

    const order = this.getOrderType(orderTerm);
    console.log('currentDate?', currentDate);

    const books = await Book.findAndCountAll({
      // TODO 검색어가 있을 때와 없을 때 다르게 처리
      where: {
        // title: {
        //   [Op.like]: `%${title}%`,
        // },
        author: {
          [Op.like]: `%${author}%`,
        },
        // publisher: {
        //   [Op.like]: `%${publisher}%`,
        // },
        // pub_date: {
        //   [Op.between]: [start_date, currentDate],
        // },
      },
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
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
      throw new Error('Query type is missing');
    }

    if (!Object.values(QueryType).includes(queryType)) {
      throw new Error('Invalid query type');
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    pageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 20;

    const order = queryType === 'Bestseller' ? [['sales_point', 'DESC']] : [['pub_date', 'DESC']];
    const books = await Book.findAll({
      include: [
        {
          model: BookQueryType,
          where: { query_type: queryType }, // Filter by query_type
          required: true, // INNER JOIN
        },
      ],
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return books;
  }

  getOrderType(orderTerm) {
    let order;
    switch (orderTerm) {
      case 'SALES':
        order = [['sales_point', 'ASC']];
        break;

      case 'LOWPRICE':
        order = [['price_sales', 'DESC']];
        break;

      case 'RANK':
        order = [['customer_review_rank', 'ASC']];
        break;

      case 'PUBDATE':
        order = [['pub_date', 'ASC']];
        break;

      case 'TITLE':
        order = [['title', 'ASC']];
        break;

      default:
        order = [
          ['title', 'ASC'],
          ['author', 'DESC'],
        ];
    }
    return order;
  }
}

export default new BookService();
