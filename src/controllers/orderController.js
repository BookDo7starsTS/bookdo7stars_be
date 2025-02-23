import express from 'express';
import orderService from '../services/orderService.js';
/**
 * @swagger
 * tags:
 *   name: Order
 *   description: The order managing API
 */

const router = express.Router();

/**
 * @swagger
 * /order:
 *   post:
 *     summary: 책에 리뷰를 추가합니다.
 *     tags: [Review]
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
 *                 content:
 *                   type: string
 *                   description: 리뷰 텍스트
 *                   example: "리뷰 입니다"
 *                 userId:
 *                   type: string
 *                   description: 리뷰를 단 유저 ID
 *                   example: 3
 *     responses:
 *       200:
 *         description: 리뷰가 책에 성공적으로 추가되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   description: 추가된 리뷰들
 *                   reviews:
 *                     type: object
 *                     properties:
 *                       bookId:
 *                          type: string
 *                          description: 책의 고유 ID
 *                          example: "123456789"
 *                       content:
 *                          type: string
 *                          description: 리뷰 텍스트
 *                          example: "리뷰 입니다"
 *                       userId:
 *                          type: string
 *                          description: 리뷰를 단 유저 ID
 *                          example: 3
 *                    message:
 *                      type: string
 *                      description: 결과 메시지
 *                      example: "Review is successfully added"
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
    const { address, contact, orderedBooks, totalPrice } = req.body.orderContents;

    console.log('ORDER CONTENTS', req.body.orderContents);
    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'xxx' });
    }

    const orderNumber = await orderService.makeOrder(userFromSession.id, address, contact, orderedBooks, totalPrice);
    res.status(200).json({ orderNumber: orderNumber, message: 'successfully ordered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/history', async function (req, res) {
  try {
    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      res.status(400).json({ message: 'xxx' });
      return;
    }

    const orders = await orderService.getOrders(userFromSession.id);
    res
      .status(200)
      .json({ orderHistory: orders.rows, count: orders.count, message: 'Order History loaded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
