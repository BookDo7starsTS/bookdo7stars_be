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
}

export default new UserService(); // Singleton pattern for UserService
