import Book from './book.js';
import User from './user.js';
import BookQueryType from './bookQueryType.js';
import Wishlist from './wishlist.js';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

Book.hasMany(Wishlist, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

User.hasMany(Wishlist, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});

export { Book, BookQueryType, User, Wishlist };
