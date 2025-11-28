import type { Report, CreateReportDTO, UpdateReportDTO } from '../Report'

describe('Report Entity', () => {
    describe('Report interface', () => {
        it('should create a valid report with all required fields', () => {
            const report: Report = {
                id: 'report-123',
                userId: 'user-456',
                categoryId: 'cat-789',
                title: 'Pothole on Main Street',
                description: 'Large pothole causing traffic issues',
                status: 'pending',
                priority: 'high',
                latitude: 40.7128,
                longitude: -74.0060,
                address: '123 Main St, New York, NY',
                imageUrls: ['https://example.com/image1.jpg'],
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            expect(report.id).toBe('report-123')
            expect(report.title).toBe('Pothole on Main Street')
            expect(report.status).toBe('pending')
            expect(report.priority).toBe('high')
            expect(report.latitude).toBe(40.7128)
            expect(report.longitude).toBe(-74.0060)
        })

        it('should validate report status enum values', () => {
            const statuses: Array<'pending' | 'in_progress' | 'resolved' | 'rejected'> = [
                'pending',
                'in_progress',
                'resolved',
                'rejected',
            ]

            statuses.forEach((status) => {
                const report: Report = {
                    id: 'report-123',
                    userId: 'user-456',
                    categoryId: 'cat-789',
                    title: 'Test Report',
                    description: 'Test Description',
                    status: status,
                    priority: 'medium',
                    latitude: 0,
                    longitude: 0,
                    address: 'Test Address',
                    imageUrls: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }

                expect(report.status).toBe(status)
            })
        })

        it('should validate report priority enum values', () => {
            const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']

            priorities.forEach((priority) => {
                const report: Report = {
                    id: 'report-123',
                    userId: 'user-456',
                    categoryId: 'cat-789',
                    title: 'Test Report',
                    description: 'Test Description',
                    status: 'pending',
                    priority: priority,
                    latitude: 0,
                    longitude: 0,
                    address: 'Test Address',
                    imageUrls: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }

                expect(report.priority).toBe(priority)
            })
        })
    })

    describe('CreateReportDTO', () => {
        it('should create a valid CreateReportDTO', () => {
            const createReportDTO: CreateReportDTO = {
                userId: 'user-123',
                categoryId: 'cat-456',
                title: 'Broken Streetlight',
                description: 'Streetlight not working on Oak Avenue',
                latitude: 34.0522,
                longitude: -118.2437,
                address: '456 Oak Ave, Los Angeles, CA',
            }

            expect(createReportDTO.userId).toBe('user-123')
            expect(createReportDTO.title).toBe('Broken Streetlight')
            expect(createReportDTO.latitude).toBe(34.0522)
            expect(createReportDTO.longitude).toBe(-118.2437)
        })
    })

    describe('UpdateReportDTO', () => {
        it('should create a valid UpdateReportDTO with partial fields', () => {
            const updateReportDTO: UpdateReportDTO = {
                status: 'in_progress',
                priority: 'high',
                adminNotes: 'Assigned to maintenance team',
            }

            expect(updateReportDTO.status).toBe('in_progress')
            expect(updateReportDTO.priority).toBe('high')
            expect(updateReportDTO.adminNotes).toBe('Assigned to maintenance team')
        })
    })
})
