import express from 'express';

import userController from './controllers/userController.js';

const app = express();
app.locals.pretty = true;

app.use('/', userController);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
