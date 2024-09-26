import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Book from './book.js';

const BookQueryType = sequelize.define(
  'book_query_types',
  {
    /*book_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: book,
        key: 'id',
      },
      primaryKey: true,
    },*/
    query_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  },
);
/*
BookQueryType.associate = (models) => {
  BookQueryType.belongsTo(models.Book, {
      foreignKey: 'book_id',
      targetKey: 'id',
  });
};*/


export default BookQueryType;
