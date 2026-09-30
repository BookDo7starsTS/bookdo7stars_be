import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { QueryTypes } from 'sequelize';
import sequelize from '../src/config/db.js';

dotenv.config();

const sampleUsers = [
  { name: '테스트 사용자 1', email: 'test-user-1@example.com' },
  { name: '테스트 사용자 2', email: 'test-user-2@example.com' },
  { name: '테스트 사용자 3', email: 'test-user-3@example.com' },
];

try {
  const books = await sequelize.query('SELECT id FROM books ORDER BY id LIMIT 3', { type: QueryTypes.SELECT });
  if (books.length === 0) {
    throw new Error('No books found. Run "npm run import:aladin" before seeding test data.');
  }

  const password = await bcrypt.hash('Test1234!', 10);
  await sequelize.transaction(async (transaction) => {
    const users = [];
    for (const user of sampleUsers) {
      const [result] = await sequelize.query(
        `
          INSERT INTO users (name, email, password, grade, adminyn, status)
          VALUES (:name, :email, :password, 'Bronze', false, 'active')
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            password = EXCLUDED.password,
            grade = EXCLUDED.grade,
            adminyn = EXCLUDED.adminyn,
            status = EXCLUDED.status,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id
        `,
        { replacements: { ...user, password }, type: QueryTypes.SELECT, transaction },
      );
      users.push(result);
    }

    const userIds = users.map((user) => user.id);
    await sequelize.query('DELETE FROM reviews WHERE user_id IN (:userIds)', {
      replacements: { userIds },
      transaction,
    });
    await sequelize.query('DELETE FROM carts WHERE user_id IN (:userIds)', { replacements: { userIds }, transaction });
    await sequelize.query('DELETE FROM wishlist WHERE user_id IN (:userIds)', {
      replacements: { userIds },
      transaction,
    });

    for (let index = 0; index < users.length; index += 1) {
      const user = users[index];
      const book = books[index % books.length];
      const nextBook = books[(index + 1) % books.length];

      await sequelize.query('INSERT INTO wishlist (user_id, book_id) VALUES (:userId, :bookId)', {
        replacements: { userId: user.id, bookId: book.id },
        transaction,
      });
      await sequelize.query('INSERT INTO wishlist (user_id, book_id) VALUES (:userId, :bookId)', {
        replacements: { userId: user.id, bookId: nextBook.id },
        transaction,
      });
      await sequelize.query('INSERT INTO carts (user_id, book_id, quantity) VALUES (:userId, :bookId, :quantity)', {
        replacements: { userId: user.id, bookId: book.id, quantity: index + 1 },
        transaction,
      });
      await sequelize.query('INSERT INTO reviews (user_id, book_id, content) VALUES (:userId, :bookId, :content)', {
        replacements: {
          userId: user.id,
          bookId: book.id,
          content: `테스트 사용자 ${index + 1}이 작성한 샘플 리뷰입니다.`,
        },
        transaction,
      });
    }
  });

  console.log('Seeded 3 test users, 6 wishlist items, 3 cart items, and 3 reviews.');
  console.log('Test-user password: Test1234!');
} catch (error) {
  console.error('Test-data seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
