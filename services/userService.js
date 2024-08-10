import User from '../models/user.js';

class UserService {
  async createUser(userDTO) {
    return await User.create(userDTO);
  }
}

export default new UserService(); // Singleton pattern for UserService
