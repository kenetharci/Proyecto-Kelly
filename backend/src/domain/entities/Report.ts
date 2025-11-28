export interface Report {
  id: string
  userId: string
  categoryId: string
  title: string
  description: string
  status: "pending" | "in_progress" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  latitude: number
  longitude: number
  address: string
  imageUrls: string[]
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  userName?: string
  categoryName?: string
  adminNotes?: string
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateReportDTO {
  userId: string
  categoryId: string
  title: string
  description: string
  latitude: number
  longitude: number
  address: string
  imageUrls?: string[]
  contactName?: string
  contactEmail?: string
  contactPhone?: string
}

export interface UpdateReportDTO {
  title?: string
  description?: string
  categoryId?: string
  status?: "pending" | "in_progress" | "resolved" | "rejected"
  priority?: "low" | "medium" | "high"
  adminNotes?: string
}
