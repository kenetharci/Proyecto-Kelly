import type { User, CreateUserDTO, UpdateUserDTO } from '../User'

describe('User Entity', () => {
    describe('User interface', () => {
        it('should create a valid user with all required fields', () => {
            const user: User = {
                id: '123',
                email: 'test@example.com',
                password: 'hashedPassword123',
                name: 'Test User',
                phone: '1234567890',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            expect(user.id).toBe('123')
            expect(user.email).toBe('test@example.com')
            expect(user.name).toBe('Test User')
            expect(user.role).toBe('user')
        })

        it('should create a user with optional fields', () => {
            const user: User = {
                id: '456',
                email: 'admin@example.com',
                password: 'hashedPassword456',
                name: 'Admin User',
                phone: '0987654321',
                role: 'admin',
                avatarUrl: 'https://example.com/avatar.jpg',
                notificationsEnabled: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            expect(user.avatarUrl).toBe('https://example.com/avatar.jpg')
            expect(user.notificationsEnabled).toBe(true)
            expect(user.role).toBe('admin')
        })
    })

    describe('CreateUserDTO', () => {
        it('should create a valid CreateUserDTO with required fields', () => {
            const createUserDTO: CreateUserDTO = {
                email: 'newuser@example.com',
                password: 'password123',
                name: 'New User',
                phone: '5551234567',
            }

            expect(createUserDTO.email).toBe('newuser@example.com')
            expect(createUserDTO.password).toBe('password123')
            expect(createUserDTO.name).toBe('New User')
            expect(createUserDTO.phone).toBe('5551234567')
        })

        it('should create a CreateUserDTO with optional role', () => {
            const createUserDTO: CreateUserDTO = {
                email: 'admin@example.com',
                password: 'adminpass',
                name: 'Admin',
                phone: '5559876543',
                role: 'admin',
            }

            expect(createUserDTO.role).toBe('admin')
        })
    })

    describe('UpdateUserDTO', () => {
        it('should create a valid UpdateUserDTO with partial fields', () => {
            const updateUserDTO: UpdateUserDTO = {
                name: 'Updated Name',
                email: 'updated@example.com',
            }

            expect(updateUserDTO.name).toBe('Updated Name')
            expect(updateUserDTO.email).toBe('updated@example.com')
            expect(updateUserDTO.phone).toBeUndefined()
        })
    })
})
