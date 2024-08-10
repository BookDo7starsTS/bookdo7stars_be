import UserService from '../../src/services/userService'; // Adjust path as needed
import User from '../../src/models/user'; // Adjust path as needed

// Mock the User model
jest.mock('../../src/models/user');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user', async () => {
    // Arrange
    const userDTO = { name: 'John Doe', email: 'john.doe@example.com' };
    const createdUser = { id: 1, ...userDTO }; // Mocked result
    User.create.mockResolvedValue(createdUser); // Mock the User.create method

    // Act
    const result = await UserService.createUser(userDTO);

    // Assert
    expect(User.create).toHaveBeenCalledWith(userDTO);
    expect(result).toEqual(createdUser);
  });
});
