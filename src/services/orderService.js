import { generateOrderNumber } from '../utils/generateOrderNumber.js';
import Order from '../models/order.js';
import OrderDetails from '../models/orderDetails.js';

class OrderService {
  async makeOrder(userId, address, contact, orderedBooks, totalPrice) {
    if (!address || !contact || !orderedBooks) {
      throw new Error('Required Information is missing');
    }

    try {
      const orderNumber = generateOrderNumber();
      const orderDto = {
        userId: userId,
        address: address,
        contact: contact,
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
        bookId: element.bookId,
        quantity: element.quantity,
      }));
      console.log(orderDetailDtos);

      orderDetailDtos.map(async (orderDetail) => await OrderDetails.create(orderDetail));

      return orderNumber;
    } catch (err) {
      console.error('Error in making an Order:', err.message);
      throw err;
    }
  }
}

export default new OrderService();
