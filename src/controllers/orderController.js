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
 *     summary: Create an order.
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipInfo
 *               - orderedItems
 *               - totalPrice
 *             properties:
 *               shipInfo:
 *                 type: object
 *                 required:
 *                   - name
 *                   - zipCode
 *                   - address1
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Recipient name
 *                   zipCode:
 *                     type: string
 *                     description: Postal code
 *                   address1:
 *                     type: string
 *                     description: Shipping address
 *                   phone:
 *                     type: string
 *                     description: Recipient phone number
 *               orderedItems:
 *                 type: array
 *                 description: Books and quantities to order
 *                 items:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: Unique book ID
 *                     quantity:
 *                       type: integer
 *                       description: Quantity to order
 *               totalPrice:
 *                 type: number
 *                 description: Total order price
 *     responses:
 *       200:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderNumber:
 *                   type: string
 *                   description: Created order number
 *                 message:
 *                   type: string
 *                   description: Result message
 *                   example: "successfully ordered"
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
    const { shipInfo, orderedItems, totalPrice } = req.body;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'user not found' });
    }

    const orderNumber = await orderService.makeOrder(userFromSession.id, shipInfo, orderedItems, totalPrice);
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
