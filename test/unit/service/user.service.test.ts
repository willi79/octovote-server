import { UserService } from '../../../src/service/user.service';
import { IUserRepository } from '../../../src/repository/i-user.repository';

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    markVoted: jest.fn(),
};

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService(mockUserRepository);
    });

    // -------------------------------------------------------------------
    describe('listUsers', () => {
        it('should return all users', async () => {
            const users = [
                { _id: '1', name: 'Alice', email: 'alice@example.com', role: 'user', hasVoted: false },
                { _id: '2', name: 'Bob', email: 'bob@example.com', role: 'admin', hasVoted: false },
            ];
            mockUserRepository.findAll.mockResolvedValue(users as any);

            const result = await userService.listUsers();

            expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(users);
        });

        it('should return empty array when no users exist', async () => {
            mockUserRepository.findAll.mockResolvedValue([]);

            const result = await userService.listUsers();

            expect(result).toEqual([]);
        });
    });

    // -------------------------------------------------------------------
    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const newUser = {
                _id: '1',
                name: 'Alice',
                email: 'alice@example.com',
                role: 'user',
                hasVoted: false,
            };
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(newUser as any);

            const result = await userService.createUser({
                name: 'Alice',
                email: 'alice@example.com',
                password: 'password123',
            });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('alice@example.com');
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: 'Alice',
                email: 'alice@example.com',
                password: 'password123',
            });
            expect(result).toEqual(newUser);
        });

        it('should throw if email already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                _id: '1',
                email: 'alice@example.com',
            } as any);

            await expect(
                userService.createUser({
                    name: 'Alice',
                    email: 'alice@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow('Email already exists');
        });

        it('should throw if name is empty', async () => {
            await expect(
                userService.createUser({
                    name: '',
                    email: 'alice@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow('Name is required');
        });

        it('should throw if email is empty', async () => {
            await expect(
                userService.createUser({
                    name: 'Alice',
                    email: '',
                    password: 'password123',
                })
            ).rejects.toThrow('Email is required');
        });

        it('should throw if password is empty', async () => {
            await expect(
                userService.createUser({
                    name: 'Alice',
                    email: 'alice@example.com',
                    password: '',
                })
            ).rejects.toThrow('Password is required');
        });
    });

    // -------------------------------------------------------------------
    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            const updatedUser = {
                _id: '1',
                name: 'Alice Updated',
                email: 'alice@example.com',
                role: 'user',
                hasVoted: false,
            };
            mockUserRepository.update.mockResolvedValue(updatedUser as any);

            const result = await userService.updateUser('1', { name: 'Alice Updated' });

            expect(mockUserRepository.update).toHaveBeenCalledWith('1', { name: 'Alice Updated' });
            expect(result).toEqual(updatedUser);
        });

        it('should throw if user not found', async () => {
            mockUserRepository.update.mockResolvedValue(null);

            await expect(userService.updateUser('999', { name: 'Ghost' })).rejects.toThrow('User not found');
        });

        it('should throw if dto is empty', async () => {
            await expect(userService.updateUser('1', {})).rejects.toThrow('No fields to update');
        });
    });

    // -------------------------------------------------------------------
    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            mockUserRepository.delete.mockResolvedValue(true);

            const result = await userService.deleteUser('1');

            expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });

        it('should throw if user not found', async () => {
            mockUserRepository.delete.mockResolvedValue(false);

            await expect(userService.deleteUser('999')).rejects.toThrow('User not found');
        });
    });
});
