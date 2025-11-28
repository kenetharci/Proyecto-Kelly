import { LoginUseCase } from '../LoginUseCase'
import type { IUserRepository } from '../../../../domain/ports/IUserRepository'
import type { IAuthService } from '../../../../domain/ports/IAuthService'
import type { User } from '../../../../domain/entities/User'

describe('LoginUseCase', () => {
    let loginUseCase: LoginUseCase
    let mockUserRepository: jest.Mocked<IUserRepository>
    let mockAuthService: jest.Mocked<IAuthService>

    beforeEach(() => {
        // Create mock implementations
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

        loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService)
    })

    it('should successfully login with valid credentials', async () => {
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            password: 'hashedPassword',
            name: 'Test User',
            phone: '1234567890',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockUserRepository.findByEmail.mockResolvedValue(mockUser)
        mockAuthService.comparePassword.mockResolvedValue(true)
        mockAuthService.generateToken.mockReturnValue('mock-jwt-token')

        const result = await loginUseCase.execute('test@example.com', 'password123')

        expect(result).not.toBeNull()
        expect(result?.token).toBe('mock-jwt-token')
        expect(result?.user.email).toBe('test@example.com')
        expect(result?.user.name).toBe('Test User')
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
        expect(mockAuthService.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword')
    })

    it('should return null when user does not exist', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null)

        const result = await loginUseCase.execute('nonexistent@example.com', 'password123')

        expect(result).toBeNull()
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com')
        expect(mockAuthService.comparePassword).not.toHaveBeenCalled()
    })

    it('should return null when password is invalid', async () => {
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            password: 'hashedPassword',
            name: 'Test User',
            phone: '1234567890',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockUserRepository.findByEmail.mockResolvedValue(mockUser)
        mockAuthService.comparePassword.mockResolvedValue(false)

        const result = await loginUseCase.execute('test@example.com', 'wrongpassword')

        expect(result).toBeNull()
        expect(mockAuthService.comparePassword).toHaveBeenCalledWith('wrongpassword', 'hashedPassword')
        expect(mockAuthService.generateToken).not.toHaveBeenCalled()
    })
})
