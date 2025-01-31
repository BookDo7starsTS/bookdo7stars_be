import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.js';
import Book from './book.js';

const OrderDetails = sequelize.define(
  'order_details',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'order_id',
      references: {
        model: Order,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    bookId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'book_id',
      references: {
        model: Book,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    timestamps: false,
  },
);

export default OrderDetails;
