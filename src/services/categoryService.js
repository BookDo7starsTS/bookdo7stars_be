import sequelize from '../config/db.js';

class CategoryService {
  async getCategories(level) {
    const categoriesHierarchy = await sequelize.query(
      `WITH RECURSIVE categories_hierarchy AS (
          SELECT id, name, parent_id, 1 AS level,
                 name::VARCHAR as route
          FROM categories
          WHERE parent_id IS NULL --최상위 관리자 선택 (CEO)

          UNION ALL

          SELECT o.id, o.name, o.parent_id, oh.level + 1,
                 oh.route || '>' || o.name as route
          FROM categories o
          JOIN categories_hierarchy oh ON o.parent_id = oh.id
      )
      SELECT id, name, parent_id, level, route 
      FROM categories_hierarchy
      WHERE level <= :level
      ORDER BY level`,
      {
        replacements: { level },
      },
    );
    let result = [];
    let categoryMap = new Map();
    for (let category of categoriesHierarchy[0]) {
      if (category.level === 1) continue;
      if (category.level === 2) {
        category.children = [];
        categoryMap.set(category.id, { children: category.children, id: category.id, name: category.name });
        result.push(categoryMap.get(category.id));
        continue;
      }
      categoryMap.get(category.parent_id).children.push({ id: category.id, name: category.name });
    }

    return result;
  }
  async getCategoriesById(id) {
    const categories = await sequelize.query(
      `SELECT id, name, parent_id,
      (SELECT count(*) FROM categories b WHERE b.parent_id = a.id) as count
      FROM categories a
      WHERE parent_id = :id;
      `,
      {
        replacements: { id },
      },
    );
    const result = [];
    let categoryMap = new Map();
    for (let category of categories[0]) {
      result.push(category);
      categoryMap.set(id, result);
    }

    return categoryMap;
  }
}

export default new CategoryService();
