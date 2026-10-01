import express from 'express';
import reviewService from '../services/reviewService.js';
/**
 * @swagger
 * tags:
 *   name: Review
 *   description: The review managing API
 */

const router = express.Router();

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Retrieve reviews for a specific book.
 *     tags: [Get all Reviews of a specific book]
 *     responses:
 *       200:
 *         description: Reviews loaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookId:
 *                   type: string
 *                   description: Unique book ID
 *                   example: "123456789"
 *                 reviews:
 *                   type: object
 *                   description: Array of review objects
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
 *                   example: Error loading reviews
 */
router.get('/:bookId', async function (req, res) {
  try {
    const bookId = req.params.bookId;

    const reviews = await reviewService.getAllReviewsInBook(bookId);
    res.status(200).json({ reviews: reviews.rows, count: reviews.count, message: 'Reviews loaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});
/**
 * @swagger
 * /review/{bookId}:
 *   post:
 *     summary: Add a review to a book.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Unique book ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Review text
 *                 example: "This is a review."
 *     responses:
 *       200:
 *         description: Review added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   type: object
 *                   description: Added review
 *                 message:
 *                   type: string
 *                   description: Result message
 *                   example: "Review is successfully added"
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
router.post('/:bookId', async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const { content } = req.body;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const review = await reviewService.addReviewInBook(userFromSession.id, bookId, content);
    res.status(200).json({ review, message: 'review is successfully added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /review/{bookId}/{reviewId}:
 *   put:
 *     summary: Update a review for a book.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique book ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Review text
 *                 example: "This is an updated review."
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   type: object
 *                   description: Updated review details
 *                   properties:
 *                     bookId:
 *                       type: string
 *                       description: Unique book ID
 *                       example: "123456789"
 *                     content:
 *                       type: string
 *                       description: Review text
 *                       example: "This is an updated review."
 *                     userId:
 *                       type: string
 *                       description: ID of the user who wrote the review
 *                       example: 3
 *                 message:
 *                   type: string
 *                   description: Result message
 *                   example: "Review is successfully updated"
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
router.put('/:bookId/:reviewId', async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;
    const { content } = req.body;

    console.log(req.session);
    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const review = await reviewService.updateReview(userFromSession.id, bookId, reviewId, content);
    res.status(200).json({ review, message: 'review is successfully added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /review/{bookId}/{reviewId}:
 *   delete:
 *     summary: Delete a review from a book.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique book ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Review is successfully deleted"
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
router.delete('/:bookId/:reviewId', async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    await reviewService.deleteReview(userFromSession.id, bookId, reviewId);
    res.status(200).json({ message: 'review is successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
