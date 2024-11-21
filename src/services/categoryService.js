import Category from '../models/category.js';

class CategoryService {
  async getAllCategories() {
    const categories = await Category.findAll();
    return categories;
  }
}

export default new CategoryService();
