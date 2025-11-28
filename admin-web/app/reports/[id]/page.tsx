"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, User, Mail, Phone, Image as ImageIcon } from "lucide-react"
import { Card } from "@/components/Card"

interface Report {
    id: number
    title: string
    description: string
    categoryId: number
    categoryName?: string
    status: string
    address: string
    latitude: number
    longitude: number
    contactName?: string
    contactEmail?: string
    contactPhone?: string
    imageUrls: string[]
    createdAt: string
    updatedAt: string
    userId: number
    userName?: string
}

export default function ReportDetailPage() {
    const router = useRouter()
    const params = useParams()
    const reportId = params.id

    const [report, setReport] = useState<Report | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        fetchReportDetails()
    }, [reportId])

    const fetchReportDetails = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.ok) {
                const data = await response.json()
                setReport(data)
            } else {
                console.error("Failed to fetch report")
            }
        } catch (error) {
            console.error("Error fetching report:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!report) return

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/${reportId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                const updatedReport = await response.json()
                setReport(updatedReport)
            }
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved": return "bg-green-100 text-green-800 border-green-300"
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300"
            case "rejected": return "bg-red-100 text-red-800 border-red-300"
            default: return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "resolved": return "Resuelto"
            case "pending": return "Pendiente"
            case "in_progress": return "En Proceso"
            case "rejected": return "Rechazado"
            default: return status
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Cargando reporte...</p>
            </div>
        )
    }

    if (!report) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Reporte no encontrado</p>
                    <button
                        onClick={() => router.push("/reports")}
                        className="text-blue-600 hover:underline"
                    >
                        Volver a reportes
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-7xl p-4">
                    <button
                        onClick={() => router.push("/reports")}
                        className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Reportes
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                            <p className="text-sm text-gray-600">Reporte #{report.id}</p>
                        </div>
                        <div className={`rounded-full border px-4 py-2 text-sm font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
                        </Card>

                        {/* Images */}
                        {report.imageUrls && report.imageUrls.length > 0 && (
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Imágenes ({report.imageUrls.length})
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {report.imageUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setSelectedImage(url)}
                                        >
                                            <img
                                                src={url}
                                                alt={`Imagen ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Location */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Ubicación
                            </h2>
                            <p className="text-gray-700 mb-2">{report.address}</p>
                            <p className="text-sm text-gray-500">
                                Coordenadas: {report.latitude}, {report.longitude}
                            </p>
                            <a
                                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block text-blue-600 hover:underline text-sm"
                            >
                                Ver en Google Maps →
                            </a>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Change */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Estado</h2>
                            <select
                                value={report.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="in_progress">En Proceso</option>
                                <option value="resolved">Resuelto</option>
                                <option value="rejected">Rechazado</option>
                            </select>
                        </Card>

                        {/* Contact Information */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Nombre</p>
                                        <p className="text-sm text-gray-900">{report.contactName || "No disponible"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Email</p>
                                        {report.contactEmail ? (
                                            <a href={`mailto:${report.contactEmail}`} className="text-sm text-blue-600 hover:underline">
                                                {report.contactEmail}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500">No disponible</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Teléfono</p>
                                        {report.contactPhone ? (
                                            <a href={`tel:${report.contactPhone}`} className="text-sm text-blue-600 hover:underline">
                                                {report.contactPhone}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500">No disponible</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Metadata */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Reporte</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Reportado por</p>
                                    <p className="text-sm text-gray-900">{report.userName || `Usuario #${report.userId}`}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Categoría</p>
                                    <p className="text-sm text-gray-900">{report.categoryName || "Sin categoría"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                                    <p className="text-sm text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(report.createdAt).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={selectedImage}
                            alt="Vista ampliada"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-6 w-6 rotate-180" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
