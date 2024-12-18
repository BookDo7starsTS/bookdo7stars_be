import Cart from '../models/cart.js';

class CartService {
  async addItemToCart(bookId, quantity, userId) {
    console.log('SERVICE', bookId, quantity, userId);

    if (!bookId || !quantity) {
      throw new Error('bookId and quantity are required');
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }
    const newCartItem = {
      bookId: bookId,
      quantity: quantity,
      userId: userId,
    };
    return await Cart.create(newCartItem);
  }
}

export default new CartService();
