import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Order = sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_price',
    },
    orderNumber: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'order_number',
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE', // 유저 삭제 시 관련된 주문도 삭제
      onUpdate: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    timestamps: true,
  },
);

export default Order;
