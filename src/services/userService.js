import User from '../models/user.js';
import bcrypt from 'bcrypt';

class UserService {
  async createUser(user) {
    const inputUser = { ...user };
    inputUser.status = 'inactive';
    inputUser.grade = 'Bronze';
    inputUser.adminyn = 'N';

    inputUser.password = await bcrypt.hash(inputUser.password, 10);
    return await User.create(user);
  }

  async findUser(user) {
    const email = user.email;
    const password = user.password;
    const userFound = await User.findOne({ where: { email, password } });

    if (!userFound) {
      throw new Error('User not found');
    }

    return userFound;
  }
}

export default new UserService(); // Singleton pattern for UserService
