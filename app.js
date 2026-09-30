import express from 'express';
import setupSwagger from './src/config/swagger.js';
import {
  userController,
  bookController,
  categoryController,
  cartController,
  wishlistController,
  reviewController,
  orderController,
} from './src/controllers/index.js';
import cors from 'cors';
import './src/job/SaveAladinBooks.js';
import './src/models/index.js';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const sessionSecret = process.env.SESSION_SECRET;

if (isProduction && !sessionSecret) {
  throw new Error('SESSION_SECRET must be configured in production');
}

const app = express();
app.set('trust proxy', 1);
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

app.use(
  session({
    secret: sessionSecret || 'local-development-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

setupSwagger(app);
app.locals.pretty = true;

app.use('/user', userController);
app.use('/wishlist', wishlistController);
app.use('/book', bookController);
app.use('/category', categoryController);
app.use('/cart', cartController);
app.use('/review', reviewController);
app.use('/order', orderController);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
