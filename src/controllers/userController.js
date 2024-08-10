import express from 'express';
import bodyParser from 'body-parser';
import UserDTO from '../dtos/userDto.js';
import userService from '../services/userService.js';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/users', async function (req, res) {
  try {
    const userDTO = new UserDTO(req.body);
    const newUser = await userService.createUser(userDTO);
    res.status(201).json({ userId: newUser.id, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    if (err.errors != null) console.error(err.errors[0].message);
    res.status(500).json({ message: 'Error registering user' });
  }
});

export default router;
