import { generateOrderNumber } from '../utils/generateOrderNumber.js';
import Books from '../models/book.js';
import Order from '../models/order.js';
import OrderDetails from '../models/orderDetails.js';
import { Op, literal } from 'sequelize';

class OrderService {
  async makeOrder(userId, shipInfo, orderedBooks, totalPrice) {
    if (!shipInfo || !orderedBooks) {
      throw new Error('Required Information is missing');
    }

    try {
      const orderNumber = generateOrderNumber();
      const orderDto = {
        userId: userId,
        name: shipInfo.name,
        zipCode: shipInfo.zipCode,
        address: shipInfo.address1,
        contact: shipInfo.phone,
        totalPrice: totalPrice,
        orderNumber: orderNumber,
      };

      const newOrder = await Order.create(orderDto);

      console.log(newOrder);
      const orderDetailDto = {
        orderId: newOrder.id,
      };

      const orderDetailDtos = orderedBooks.map((element) => ({
        ...orderDetailDto,
        bookId: element.book.id,
        quantity: element.quantity,
      }));

      orderDetailDtos.map(async (orderDetail) => await OrderDetails.create(orderDetail));

      return orderNumber;
    } catch (err) {
      console.error('Error in making an Order:', err.message);
      throw err;
    }
  }

  async getOrders(userId, page = 1, pageSize = 5) {
    const ordersHead = await Order.findAndCountAll({
      attributes: ['order_number'],
      where: { user_id: userId },
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['created_at', 'DESC']],
    });

    const orderNumbers = ordersHead.rows.map((order) => order.dataValues.order_number);

    const orders = await Order.findAndCountAll({
      attributes: ['order_number', 'created_at', 'total_price'],
      where: {
        order_number: {
          [Op.in]: orderNumbers,
        },
      },
      include: [
        {
          model: OrderDetails,
          as: 'orderDetails',
          attributes: ['book_id', 'quantity'],
          include: [
            {
              model: Books,
              attributes: ['title'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    orders.rows = orders.rows.map((order) => ({
      ...order.toJSON(),
      title: this.getOrderTitle(order),
      orderDetails: order.orderDetails.map((detail) => ({
        book_id: detail.book_id,
        quantity: detail.quantity,
        title: detail.book?.title,
      })),
    }));
    orders.count = ordersHead.count;
    return orders;
  }

  getOrderTitle(order) {
    switch (order.orderDetails.length) {
      case 0:
        return '';
      case 1:
        return order.orderDetails[0].book.title.length < 20
          ? order.orderDetails[0].book.title
          : order.orderDetails[0].book.title.substr(0, 19) + '...';
      default:
        return (
          (order.orderDetails[0].book.title.length < 20
            ? order.orderDetails[0].book.title
            : order.orderDetails[0].book.title.substr(0, 19) + '...') +
          ' 외 ' +
          (order.orderDetails.length - 1) +
          '건'
        );
    }
  }
}

export default new OrderService();
