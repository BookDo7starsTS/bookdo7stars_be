import Cart from '../models/cart.js';

class CartService {
  async addItemToCart(bookId, quantity, userId) {
    console.log('SERVICE', bookId, quantity, userId);
    const newCartItem = {
      bookId: bookId,
      quantity: quantity,
      userId: userId,
    };
    return await Cart.create(newCartItem);
  }
}

export default new CartService();
