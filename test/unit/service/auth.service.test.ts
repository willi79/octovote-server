import { AuthService } from '../../../src/service/auth.service';
import { IUserRepository } from '../../../src/repository/i-user.repository';

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    markVoted: jest.fn(),
};

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockUserRepository);
    });

    // -------------------------------------------------------------------
    describe('register', () => {
        it('should register a new user and return token and user', async () => {
            const newUser = {
                _id: '1',
                name: 'Alice',
                email: 'alice@example.com',
                password: 'hashedpassword',
                role: 'user',
                hasVoted: false,
            };
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(newUser as any);

            const result = await authService.register({
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
            expect(result.token).toBeDefined();
            expect(result.user).toEqual(newUser);
        });

        it('should throw if email already exists', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                _id: '1',
                email: 'alice@example.com',
            } as any);

            await expect(
                authService.register({
                    name: 'Alice',
                    email: 'alice@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow('Email already exists');
        });

        it('should throw if name is empty', async () => {
            await expect(
                authService.register({
                    name: '',
                    email: 'alice@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow('Name is required');
        });

        it('should throw if email is empty', async () => {
            await expect(
                authService.register({
                    name: 'Alice',
                    email: '',
                    password: 'password123',
                })
            ).rejects.toThrow('Email is required');
        });

        it('should throw if password is empty', async () => {
            await expect(
                authService.register({
                    name: 'Alice',
                    email: 'alice@example.com',
                    password: '',
                })
            ).rejects.toThrow('Password is required');
        });
    });

    // -------------------------------------------------------------------
    describe('login', () => {
        const mockUser = {
            _id: '1',
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashedpassword',
            role: 'user',
            hasVoted: false,
            comparePassword: jest.fn(),
        };

        it('should login successfully and return token and user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
            mockUser.comparePassword.mockResolvedValue(true);

            const result = await authService.login({
                email: 'alice@example.com',
                password: 'password123',
            });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('alice@example.com');
            expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
            expect(result.token).toBeDefined();
            expect(result.user).toEqual(mockUser);
        });

        it('should throw if user not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                authService.login({
                    email: 'nobody@example.com',
                    password: 'password123',
                })
            ).rejects.toThrow('Invalid email');
        });

        it('should throw if password is incorrect', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
            mockUser.comparePassword.mockResolvedValue(false);

            await expect(
                authService.login({
                    email: 'alice@example.com',
                    password: 'wrongpassword',
                })
            ).rejects.toThrow('Invalid password');
        });

        it('should throw if email is empty', async () => {
            await expect(
                authService.login({
                    email: '',
                    password: 'password123',
                })
            ).rejects.toThrow('Email is required');
        });

        it('should throw if password is empty', async () => {
            await expect(
                authService.login({
                    email: 'alice@example.com',
                    password: '',
                })
            ).rejects.toThrow('Password is required');
        });
    });
});
