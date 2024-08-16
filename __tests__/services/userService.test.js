import userService from '../../src/services/userService'; // Adjust path as needed
import User from '../../src/models/user'; // Adjust path as needed
import bcrypt from 'bcrypt';

// Mock the User model
jest.mock('../../src/models/user');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user with default values for status, grade, and adminyn', async () => {
    // Arrange
    const inputUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      mobile: '010-1234-1234',
      policyyn: 'Y',
      address: '123 Main St',
    };

    const hashedPassword = await bcrypt.hash(inputUser.password, 10);

    const expectedUser = {
      ...inputUser,
      status: 'inactive',
      grade: 'Bronze',
      adminyn: 'N',
      password: hashedPassword,
    };

    // Mock implementation of User.create
    User.create.mockResolvedValue(expectedUser);

    // Act
    const result = await userService.createUser(inputUser);

    const isMatch = await bcrypt.compare('Password123!', expectedUser.password);
    expect(isMatch).toBe(true);
    expectedUser.password = 'Password123!';
    // Assert
    expect(User.create).toHaveBeenCalledWith(inputUser);
    expect(result).toEqual(expectedUser);
  });

  it('should not create a user without email', async () => {
    // Arrange
    const inputUser = {
      name: 'John Doe',
      password: 'Password123!',
      mobile: '010-1234-1234',
      policyyn: 'Y',
      address: '123 Main St',
      status: 'active',
      grade: 'Silver',
      adminyn: 'Y',
    };

    const error = new Error(
      'Error registering user: notNull Violation: users.email cannot be null,\nnotNull Violation: users.status cannot be null',
    );
    User.create.mockRejectedValue(error);

    // Assert
    await expect(userService.createUser(inputUser)).rejects
      .toThrow(`Error registering user: notNull Violation: users.email cannot be null,
notNull Violation: users.status cannot be null`);
  });

  it('should handle errors from User.create', async () => {
    // Arrange
    const inputUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      mobile: '010-1234-1234',
      policyyn: 'Y',
      address: '123 Main St',
    };
    const error = new Error('Database error');
    User.create.mockRejectedValue(error);

    // Act & Assert
    await expect(userService.createUser(inputUser)).rejects.toThrow('Database error');
  });
});
