import { PostgresUserRepository } from '../PostgresUserRepository'
import type { CreateUserDTO } from '../../../domain/entities/User'
import pool from '../../database/connection'

// Mock the database connection
jest.mock('../../database/connection', () => ({
    query: jest.fn(),
}))

describe('PostgresUserRepository', () => {
    let repository: PostgresUserRepository
    let mockQuery: any

    beforeEach(() => {
        repository = new PostgresUserRepository()
        mockQuery = pool.query
        jest.clearAllMocks()
    })

    describe('findById', () => {
        it('should return a user when found', async () => {
            const mockRow = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
                phone: '1234567890',
                role: 'user',
                avatar_url: 'https://example.com/avatar.jpg',
                notifications_enabled: true,
                created_at: new Date('2024-01-01'),
                updated_at: new Date('2024-01-02'),
            }

            mockQuery.mockResolvedValue({
                rows: [mockRow],
                command: 'SELECT',
                rowCount: 1,
                oid: 0,
                fields: [],
            })

            const result = await repository.findById('user-123')

            expect(result).not.toBeNull()
            expect(result?.id).toBe('user-123')
            expect(result?.email).toBe('test@example.com')
            expect(result?.name).toBe('Test User')
            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['user-123'])
        })

        it('should return null when user not found', async () => {
            mockQuery.mockResolvedValue({
                rows: [],
                command: 'SELECT',
                rowCount: 0,
                oid: 0,
                fields: [],
            })

            const result = await repository.findById('nonexistent-id')

            expect(result).toBeNull()
            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['nonexistent-id'])
        })
    })

    describe('findByEmail', () => {
        it('should return a user when found by email', async () => {
            const mockRow = {
                id: 'user-456',
                name: 'Email User',
                email: 'email@example.com',
                password: 'hashedPassword',
                phone: '9876543210',
                role: 'admin',
                avatar_url: null,
                notifications_enabled: false,
                created_at: new Date(),
                updated_at: new Date(),
            }

            mockQuery.mockResolvedValue({
                rows: [mockRow],
                command: 'SELECT',
                rowCount: 1,
                oid: 0,
                fields: [],
            })

            const result = await repository.findByEmail('email@example.com')

            expect(result).not.toBeNull()
            expect(result?.email).toBe('email@example.com')
            expect(result?.role).toBe('admin')
            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
                'email@example.com',
            ])
        })

        it('should return null when email not found', async () => {
            mockQuery.mockResolvedValue({
                rows: [],
                command: 'SELECT',
                rowCount: 0,
                oid: 0,
                fields: [],
            })

            const result = await repository.findByEmail('notfound@example.com')

            expect(result).toBeNull()
        })
    })

    describe('create', () => {
        it('should create a new user successfully', async () => {
            const userData: CreateUserDTO = {
                name: 'New User',
                email: 'new@example.com',
                password: 'hashedPassword123',
                phone: '5551234567',
                role: 'user',
            }

            const mockCreatedRow = {
                id: 'user-new',
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                role: userData.role,
                avatar_url: null,
                notifications_enabled: true,
                created_at: new Date(),
                updated_at: new Date(),
            }

            mockQuery.mockResolvedValue({
                rows: [mockCreatedRow],
                command: 'INSERT',
                rowCount: 1,
                oid: 0,
                fields: [],
            })

            const result = await repository.create(userData)

            expect(result.id).toBe('user-new')
            expect(result.email).toBe('new@example.com')
            expect(result.name).toBe('New User')
            expect(result.notificationsEnabled).toBe(true)
            expect(mockQuery).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                expect.arrayContaining([
                    userData.name,
                    userData.email,
                    userData.password,
                    userData.phone,
                    userData.role,
                ]),
            )
        })
    })
})
