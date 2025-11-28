import { CreateReportUseCase } from '../CreateReportUseCase'
import type { IReportRepository } from '../../../../domain/ports/IReportRepository'
import type { CreateReportDTO, Report } from '../../../../domain/entities/Report'

describe('CreateReportUseCase', () => {
    let createReportUseCase: CreateReportUseCase
    let mockReportRepository: jest.Mocked<IReportRepository>

    beforeEach(() => {
        mockReportRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            findByStatus: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }

        createReportUseCase = new CreateReportUseCase(mockReportRepository)
    })

    it('should successfully create a report', async () => {
        const reportData: CreateReportDTO = {
            userId: 'user-123',
            categoryId: 'cat-456',
            title: 'Broken Streetlight',
            description: 'The streetlight on Main St is not working',
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Main St, New York, NY',
            imageUrls: ['https://example.com/image1.jpg'],
        }

        const mockCreatedReport: Report = {
            id: 'report-789',
            userId: reportData.userId,
            categoryId: reportData.categoryId,
            title: reportData.title,
            description: reportData.description,
            status: 'pending',
            priority: 'medium',
            latitude: reportData.latitude,
            longitude: reportData.longitude,
            address: reportData.address,
            imageUrls: reportData.imageUrls || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockReportRepository.create.mockResolvedValue(mockCreatedReport)

        const result = await createReportUseCase.execute(reportData)

        expect(result).toEqual(mockCreatedReport)
        expect(mockReportRepository.create).toHaveBeenCalledWith(reportData)
        expect(result.id).toBe('report-789')
        expect(result.title).toBe('Broken Streetlight')
        expect(result.status).toBe('pending')
    })

    it('should create a report with all required fields', async () => {
        const reportData: CreateReportDTO = {
            userId: 'user-456',
            categoryId: 'cat-789',
            title: 'Pothole',
            description: 'Large pothole on Oak Avenue',
            latitude: 34.0522,
            longitude: -118.2437,
            address: '456 Oak Ave, Los Angeles, CA',
        }

        const mockCreatedReport: Report = {
            id: 'report-999',
            ...reportData,
            status: 'pending',
            priority: 'medium',
            imageUrls: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockReportRepository.create.mockResolvedValue(mockCreatedReport)

        const result = await createReportUseCase.execute(reportData)

        expect(result.userId).toBe('user-456')
        expect(result.categoryId).toBe('cat-789')
        expect(result.latitude).toBe(34.0522)
        expect(result.longitude).toBe(-118.2437)
        expect(mockReportRepository.create).toHaveBeenCalledTimes(1)
    })

    it('should handle optional contact information', async () => {
        const reportData: CreateReportDTO = {
            userId: 'user-789',
            categoryId: 'cat-123',
            title: 'Graffiti',
            description: 'Graffiti on building wall',
            latitude: 41.8781,
            longitude: -87.6298,
            address: '789 Elm St, Chicago, IL',
            contactName: 'John Doe',
            contactEmail: 'john@example.com',
            contactPhone: '5551234567',
        }

        const mockCreatedReport: Report = {
            id: 'report-contact',
            ...reportData,
            status: 'pending',
            priority: 'low',
            imageUrls: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        mockReportRepository.create.mockResolvedValue(mockCreatedReport)

        const result = await createReportUseCase.execute(reportData)

        expect(result.contactName).toBe('John Doe')
        expect(result.contactEmail).toBe('john@example.com')
        expect(result.contactPhone).toBe('5551234567')
    })
})
