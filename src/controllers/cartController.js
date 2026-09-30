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
 *     tags: [Get All Cart items]
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
 *     summary: 카트에 아이템들을 추가합니다.
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
 *                   description: 책의 고유 ID
 *                   example: "123456789"
 *                 quantity:
 *                   type: integer
 *                   description: 추가할 수량
 *                   example: 2
 *     responses:
 *       200:
 *         description: 아이템들이 카트에 성공적으로 추가되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItems:
 *                   type: array
 *                   description: 추가된 카트 아이템들
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookId:
 *                         type: string
 *                         description: 책의 고유 ID
 *                         example: "123456789"
 *                       quantity:
 *                         type: integer
 *                         description: 추가된 수량
 *                         example: 2
 *                 message:
 *                   type: string
 *                   description: 결과 메시지
 *                   example: "Selected books are successfully added"
 *       400:
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "User Not Found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
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
 *     summary: 카트의 아이템 수량을 업데이트합니다.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 업데이트할 아이템의 책 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: 업데이트할 수량
 *                 example: 3
 *     responses:
 *       200:
 *         description: 아이템이 성공적으로 업데이트되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartItem:
 *                   type: object
 *                   description: 업데이트된 카트 아이템
 *                   properties:
 *                     bookId:
 *                       type: string
 *                       description: 책의 고유 ID
 *                       example: "123456789"
 *                     quantity:
 *                       type: integer
 *                       description: 업데이트된 수량
 *                       example: 3
 *                 message:
 *                   type: string
 *                   description: 결과 메시지
 *                   example: "Book Title is updated successfully"
 *       400:
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "User Not Found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
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
 *     summary: 카트에서 특정 아이템을 삭제합니다.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 아이템의 책 ID
 *     responses:
 *       200:
 *         description: 아이템이 성공적으로 삭제되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 결과 메시지
 *                   example: "successfully deleted!"
 *       400:
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "User Not Found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
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
