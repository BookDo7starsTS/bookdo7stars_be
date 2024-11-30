import sequelize from '../config/db.js';

class CategoryService {
  async getCategoryHierarchy(level) {
    const categoryHierarchy = await sequelize.query(
      `WITH RECURSIVE category_hierarchy AS(
            SELECT id, name, parent_id, 1 as level,
            name::VARCHAR as route
            FROM categories
            WHERE parent_id IS NULL

            UNION ALL

            SELECT o.id, o.name, o.parent_id, oh.level +1,
            oh.route || '>' || o.name as route
            FROM categories o
            JOIN category_hierarchy oh ON o.parent_id = oh.id
        )
        SELECT id, name, parent_id, level, route
        FROM category_hierarchy
        ${level ? 'WHERE level <= :level' : ''}
        ORDER BY level`,
      {
        replacements: level ? { level } : {},
      },
    );

    let result = [];
    let categoryMap = new Map();
    for (let category of categoryHierarchy[0]) {
      if (category.level == 1) continue;
      category.children = [];
      categoryMap.set(category.id, category);
      const parentCategory = categoryMap.get(category.parent_id);
      if (parentCategory) {
        parentCategory.children.push(category);
      } else {
        console.error(`Parent category with ID ${category.parent_id} not found!`);
      }
      result.push(categoryMap.get(category.id));
    }
    return result;
  }
}

export default new CategoryService();
