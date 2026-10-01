import express from 'express';
import userService from '../services/userService.js';
import passport from '../passport/oauth.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

const router = express.Router();

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user.
 *     tags: [Create a user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - policyyn
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: Password123!
 *               mobile:
 *                 type: string
 *                 description: User phone number
 *                 example: 010-1234-1234
 *               policyyn:
 *                 type: string
 *                 description: Whether the user accepts the policy
 *                 example: "Y"
 *               address:
 *                 type: string
 *                 description: User address
 *                 example: "123 Main St"
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created user
 *                   example: 1
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: User registered successfully
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
 *                   example: Error registering user
 */
router.post('/', async function (req, res) {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ userId: newUser.id, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error registering user' });
  }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Sign in a user.
 *     tags: [sign in a user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: john.123doe@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User signed in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: User name
 *                   example: John Doe
 *                 grade:
 *                   type: string
 *                   description: Membership grade
 *                   example: Bronze
 *       401:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User not found or Incorrect Password
 */

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      return res.status(200).json(user);
    });
  })(req, res);
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureMessage: { message: 'fault' }, successMessage: { message: 'success' } }),
  async (req, res) => {
    const user = await userService.findUserByEmail(req.session.passport.user);
    if (!user) {
      const newUser = {
        email: req.session.passport.user.email,
        password: Math.random().toFixed(5).toString(),
        name: req.session.passport.user.login,
      };
      await userService.createUser(newUser);
    }

    res.status(201).json(req.session.passport.user);
  },
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureMessage: { message: 'fault' }, successMessage: { message: 'success' } }),
  async (req, res) => {
    const user = await userService.findUserByEmail(req.session.passport.user);
    if (!user) {
      const newUser = {
        email: req.session.passport.user.email,
        password: Math.random().toFixed(5).toString(),
        name: req.session.passport.user.login,
      };
      await userService.createUser(newUser);
    }

    res.status(201).json(req.session.passport.user);
  },
);

router.get('/session', async function (req, res) {
  try {
    const user = await userService.findUserByEmail(req.session.passport.user);
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error logging in user', err.message);
  }
});

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Sign out the current user.
 *     tags: [sign out a user]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: User signed out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout success message
 *                   example: Logout successful
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout error message
 *                   example: Error logging out
 */

router.post('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logout successful' });
    });
  });
});

export default router;
