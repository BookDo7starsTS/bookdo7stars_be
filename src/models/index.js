import Book from './book.js';
import Cart from './cart.js';
import User from './user.js';
import BookQueryType from './bookQueryType.js';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

Cart.belongsTo(Book, { foreignKey: 'book_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

export { Book, BookQueryType, Cart };
