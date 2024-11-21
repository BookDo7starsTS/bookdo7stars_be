import categoryService from '../../src/services/categoryService.js';
import Category from '../../src/models/category.js';
// Mock the Category model
jest.mock('../../src/models/category');
const mockCategories = [
  {
    id: 1,
    name: 'category1',
    parent_id: 2,
  },
  {
    id: 2,
    name: 'category2',
    parent_id: 3,
  },
];

describe('categoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load all categories in Category table in the database', async () => {
    Category.findAll.mockResolvedValue(mockCategories);

    const result = await categoryService.getAllCategories();

    expect(result).toEqual(mockCategories);
  });
});
