import userService from '../../src/services/userService'; // Adjust path as needed
import User from '../../src/models/user'; // Adjust path as needed
import bcrypt from 'bcrypt';

// Mock the User model
jest.mock('../../src/models/user');
jest.mock('bcrypt'); // bcrypt 모듈을 모킹

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

    bcrypt.hash.mockResolvedValue('encrypted password');
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
    bcrypt.compare.mockResolvedValue(true);

    // Act
    const result = await userService.createUser(inputUser);

    const isMatch = await bcrypt.compare('Password123!', expectedUser.password);
    expect(isMatch).toBe(true);
    // Assert
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

describe('findUserByEmail', () => {
  it('should return user when found by email', async () => {
    const mockUser = { email: 'test@example.com' };
    User.findOne.mockResolvedValue(mockUser);

    const userFound = await userService.findUserByEmail(mockUser);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(userFound).toEqual(mockUser);
  });

  it('should return null if user is not found by email', async () => {
    User.findOne.mockResolvedValue(null);

    const userFound = await userService.findUserByEmail({ email: 'test@example.com' });

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(userFound).toBeNull();
  });
});

describe('findUserByPassword', () => {
  it('should return user when password matches', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
    const mockRequest = { email: 'test@example.com', password: 'plainPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const userFound = await userService.findUserByPassword(mockRequest);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockRequest.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockRequest.password, mockUser.password);
    expect(userFound).toEqual(mockUser);
  });

  it('should throw an error when email does not exist', async () => {
    const mockRequest = { email: 'test@example.com', password: 'password' };
    User.findOne.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false); // bcrypt.compare을 모킹하여 false 반환

    await expect(userService.findUserByPassword(mockRequest)).rejects.toThrow('User not found');

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockRequest.email } });
  });

  it('should throw an error when password does not match', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
    const mockRequest = { email: 'test@example.com', password: 'wrongPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); // bcrypt.compare을 모킹하여 false 반환

    await expect(userService.findUserByPassword(mockRequest)).rejects.toThrow('Incorrect Password');

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockRequest.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockRequest.password, mockUser.password);
  });
});
