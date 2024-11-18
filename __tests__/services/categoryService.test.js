import categoryService from '../../src/services/categoryService.js';

describe('bookService', () => {
  //beforeEach(() => {
  //  jest.clearAllMocks();
  //});

  it('should load all books in Book table in the database', async () => {
    const result = await categoryService.getCategories(3);
    console.log(result);
  });
});
