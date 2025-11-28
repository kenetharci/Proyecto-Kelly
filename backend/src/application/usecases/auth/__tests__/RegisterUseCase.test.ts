import { RegisterUseCase } from '../RegisterUseCase'
import type { IUserRepository } from '../../../../domain/ports/IUserRepository'
import type { IAuthService } from '../../../../domain/ports/IAuthService'
import type { User, CreateUserDTO } from '../../../../domain/entities/User'

describe('RegisterUseCase', () => {
    let registerUseCase: RegisterUseCase
    let mockUserRepository: jest.Mocked<IUserRepository>
    let mockAuthService: jest.Mocked<IAuthService>

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }

        mockAuthService = {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
            generateToken: jest.fn(),
            verifyToken: jest.fn(),
        }

        registerUseCase = new RegisterUseCase(mockUserRepository, mockAuthService)
    })

    it('should successfully register a new user', async () => {
        const userData: CreateUserDTO = {
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
            phone: '1234567890',
        }

        const mockCreatedUser: User = {
            id: 'user-789',
            email: userData.email,
            password: 'hashedPassword123',
            name: userData.name,
            phone: userData.phone,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockUserRepository.findByEmail.mockResolvedValue(null)
        mockAuthService.hashPassword.mockResolvedValue('hashedPassword123')
        mockUserRepository.create.mockResolvedValue(mockCreatedUser)
        mockAuthService.generateToken.mockReturnValue('new-user-token')

        const result = await registerUseCase.execute(userData)

        expect(result).not.toBeNull()
        expect(result?.token).toBe('new-user-token')
        expect(result?.user.email).toBe('newuser@example.com')
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('newuser@example.com')
        expect(mockAuthService.hashPassword).toHaveBeenCalledWith('password123')
        expect(mockUserRepository.create).toHaveBeenCalledWith({
            ...userData,
            password: 'hashedPassword123',
            role: 'user',
        })
    })

    it('should throw error when user already exists', async () => {
        const userData: CreateUserDTO = {
            email: 'existing@example.com',
            password: 'password123',
            name: 'Existing User',
            phone: '1234567890',
        }

        const existingUser: User = {
            id: 'user-existing',
            email: 'existing@example.com',
            password: 'hashedPassword',
            name: 'Existing User',
            phone: '1234567890',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockUserRepository.findByEmail.mockResolvedValue(existingUser)

        await expect(registerUseCase.execute(userData)).rejects.toThrow('User already exists')
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('existing@example.com')
        expect(mockAuthService.hashPassword).not.toHaveBeenCalled()
        expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('should hash password before creating user', async () => {
        const userData: CreateUserDTO = {
            email: 'test@example.com',
            password: 'plainPassword',
            name: 'Test User',
            phone: '5551234567',
        }

        const mockCreatedUser: User = {
            id: 'user-123',
            email: userData.email,
            password: 'hashedPlainPassword',
            name: userData.name,
            phone: userData.phone,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockUserRepository.findByEmail.mockResolvedValue(null)
        mockAuthService.hashPassword.mockResolvedValue('hashedPlainPassword')
        mockUserRepository.create.mockResolvedValue(mockCreatedUser)
        mockAuthService.generateToken.mockReturnValue('token')

        await registerUseCase.execute(userData)

        expect(mockAuthService.hashPassword).toHaveBeenCalledWith('plainPassword')
        expect(mockUserRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                password: 'hashedPlainPassword',
            }),
        )
    })
})
