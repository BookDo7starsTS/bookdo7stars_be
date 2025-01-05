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
 *     summary: 데이터베이스에 있는 cart 목록을 불러옵니다.
 *     tags: [Get all Categories]
 *     responses:
 *       200:
 *         description: cart 목록이 성공적으로 불려졌습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   description: cart 배열
 *                   example: [{}]
 *
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메세지
 *                   example: Error loading categories
 */
router.get('/', async function (req, res) {
  try {
    console.log('nicht hier???');
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

router.post('/', async function (req, res) {
  try {
    const { bookId, quantity } = req.body;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const cartItem = await cartService.addItemToCart(bookId, quantity, userFromSession.id);
    console.log('cartItem', cartItem);
    res.status(200).json({ cartItem, message: `${cartItem.book.title}` + ' is added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
