import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Book from './book.js';

const Review = sequelize.define(
  'reviews',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'book_id',
      references: {
        model: Book,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  },
);

export default Review;
