import express from 'express';
import cartService from '../services/cartService.js';

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The cart managing API
 */

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve the cart from the database.
 *     tags: [Get All Cart items]
 *     responses:
 *       200:
 *         description: Cart loaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   description: Array of cart items
 *                   example: [{}]
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Error loading categories
 */
router.get('/', async function (req, res) {
  try {
    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }
    const cartItems = await cartService.getAllItemsInCart(userFromSession.id);
    res.status(200).json({ cartItems, message: 'CartItems successfully loaded' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add items to the cart.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 bookId:
 *                   type: string
 *                   description: Unique book ID
 *                   example: "123456789"
 *                 quantity:
 *                   type: integer
 *                   description: Quantity to add
 *                   example: 2
 *     responses:
 *       200:
 *         description: Items added to the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItems:
 *                   type: array
 *                   description: Added cart items
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookId:
 *                         type: string
 *                         description: Unique book ID
 *                         example: "123456789"
 *                       quantity:
 *                         type: integer
 *                         description: Added quantity
 *                         example: 2
 *                 message:
 *                   type: string
 *                   description: Result message
 *                   example: "Selected books are successfully added"
 *       400:
 *         description: User information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal Server Error"
 */
router.post('/', async function (req, res) {
  try {
    console.log('/cart/', req.body);
    const cartItemDto = req.body;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    let cartItems = [];
    if (cartItemDto.length === 1) {
      const cartItem = await cartService.addItemToCart(
        cartItemDto[0].bookId,
        cartItemDto[0].quantity,
        userFromSession.id,
      );
      cartItems.push(cartItem);
      return res.status(200).json({ cartItems, message: `${cartItem.book.title}` + ' is successfully added' });
    }

    if (cartItemDto.length > 1) {
      cartItemDto.map(async (item) => {
        const cartItem = await cartService.addItemToCart(item.bookId, item.quantity, userFromSession.id);
        cartItems.push(cartItem);
      });
      return res.status(200).json({ cartItems, message: 'Selected books are successfully added' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update the quantity of a cart item.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantity to update
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItem:
 *                   type: object
 *                   description: Updated cart item
 *                   properties:
 *                     bookId:
 *                       type: string
 *                       description: Unique book ID
 *                       example: "123456789"
 *                     quantity:
 *                       type: integer
 *                       description: Updated quantity
 *                       example: 3
 *                 message:
 *                   type: string
 *                   description: Result message
 *                   example: "Book Title is updated successfully"
 *       400:
 *         description: User information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Error loading cart"
 */
router.put('/:id', async function (req, res) {
  try {
    const bookId = req.params.id;
    const { quantity } = req.body;
    console.log(req);

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const cartItem = await cartService.updateItemInCart(bookId, quantity, userFromSession.id);
    res.status(200).json({ cartItem, message: `${cartItem.book.title}` + ' is updated successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Error loading cart' });
  }
});
/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove a specific item from the cart.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID of the item to remove
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Result message
 *                   example: "successfully deleted!"
 *       400:
 *         description: User information not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Error loading cart"
 */
router.delete('/:id', async function (req, res) {
  try {
    const bookId = req.params.id;
    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    await cartService.deleteItemInCart(bookId, userFromSession.id);
    res.status(200).json({ message: 'successfully deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

export default router;
