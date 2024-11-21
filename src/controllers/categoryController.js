import express from 'express';
import categoryService from '../services/categoryService.js';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The categories managing API
 */

const router = express.Router();

/**
 * @swagger
 * /book:
 *   get:
 *     summary: 데이터베이스에 있는 전체 카테고리 목록을 불러옵니다.
 *     tags: [Get all categories]
 *     responses:
 *       200:
 *         description: 전체 카테고리 목록이 성공적으로 불려졌습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   description: category 객체의 배열
 *                   example: [{
 *                      "id": "1",
 *                      "name": "xxx",
 *                      "parentId": "2",
 *                    },
 *                    {
 *                      "id": "2",
 *                      "name": "xxx2",
 *                      "parentId": "3",
 *                    },]
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: Categories loaded successfully
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
 *                   example: Error loading Categories
 */
router.get('/', async function (req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories: categories, message: 'Categories loaded successfully' });
  } catch (err) {
    console.error('Error loading categories: ', err.message);
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error loading categories' });
  }
});

export default router;
