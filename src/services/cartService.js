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

    try {
      const existingCart = await Cart.findOne({ where: { bookId: bookId, userId: userId } });
      if (existingCart) {
        console.log(existingCart);
        existingCart.quantity += quantity;
        await existingCart.save();
        return existingCart;
      }
      const newCartItem = {
        bookId: bookId,
        quantity: quantity,
        userId: userId,
      };
      return await Cart.create(newCartItem);
    } catch (err) {
      console.error('Error in addItemToCart:', err.message);
      throw err;
    }
  }
}

export default new CartService();
