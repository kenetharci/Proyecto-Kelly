"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Card } from "@/components/Card"

interface Report {
    id: number
    title: string
    description: string
    category: string
    status: string
    address: string
    created_at: string
    user_id?: number
    user_name?: string
    image_urls?: string[]
}

export default function ReportsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const filterParam = searchParams.get("filter") || "all"

    const [reports, setReports] = useState<Report[]>([])
    const [filteredReports, setFilteredReports] = useState<Report[]>([])
    const [activeFilter, setActiveFilter] = useState(filterParam)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        loadAllReports()
    }, [])

    useEffect(() => {
        filterReports()
    }, [activeFilter, reports])

    const loadAllReports = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.ok) {
                const allReports = await response.json()

                // Sort by date (newest first)
                allReports.sort((a: Report, b: Report) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )

                setReports(allReports)
            } else {
                console.error("Failed to fetch reports")
                setReports([])
            }
        } catch (error) {
            console.error("Error loading reports:", error)
            setReports([])
        } finally {
            setLoading(false)
        }
    }

    const filterReports = () => {
        let filtered = [...reports]

        switch (activeFilter) {
            case "pending":
                filtered = reports.filter(r => r.status === "pending")
                break
            case "in_progress":
                filtered = reports.filter(r => r.status === "in_progress")
                break
            case "resolved":
                filtered = reports.filter(r => r.status === "resolved")
                break
            case "rejected":
                filtered = reports.filter(r => r.status === "rejected")
                break
            case "all":
            default:
                filtered = reports
                break
        }

        setFilteredReports(filtered)
    }

    const handleStatusChange = async (reportId: number, newStatus: string) => {
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
                // Update local state
                setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r))
            } else {
                console.error("Failed to update report status")
            }
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "resolved":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-600" />
            case "in_progress":
                return <Clock className="h-5 w-5 text-blue-600" />
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-600" />
            default:
                return <AlertTriangle className="h-5 w-5 text-gray-600" />
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved": return "bg-green-100 text-green-800"
            case "pending": return "bg-yellow-100 text-yellow-800"
            case "in_progress": return "bg-blue-100 text-blue-800"
            case "rejected": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Cargando reportes...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-7xl p-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h1>
                    <p className="text-gray-600">Total: {filteredReports.length} reportes</p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl p-6">
                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`rounded-md px-4 py-2 text-sm font-medium ${activeFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Todos ({reports.length})
                    </button>
                    <button
                        onClick={() => setActiveFilter("pending")}
                        className={`rounded-md px-4 py-2 text-sm font-medium ${activeFilter === "pending"
                            ? "bg-yellow-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Pendientes ({reports.filter(r => r.status === "pending").length})
                    </button>
                    <button
                        onClick={() => setActiveFilter("in_progress")}
                        className={`rounded-md px-4 py-2 text-sm font-medium ${activeFilter === "in_progress"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        En Proceso ({reports.filter(r => r.status === "in_progress").length})
                    </button>
                    <button
                        onClick={() => setActiveFilter("resolved")}
                        className={`rounded-md px-4 py-2 text-sm font-medium ${activeFilter === "resolved"
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Resueltos ({reports.filter(r => r.status === "resolved").length})
                    </button>
                    <button
                        onClick={() => setActiveFilter("rejected")}
                        className={`rounded-md px-4 py-2 text-sm font-medium ${activeFilter === "rejected"
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Rechazados ({reports.filter(r => r.status === "rejected").length})
                    </button>
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                    {filteredReports.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-gray-600">No hay reportes para mostrar</p>
                        </Card>
                    ) : (
                        filteredReports.map((report) => (
                            <Card
                                key={report.id}
                                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => router.push(`/reports/${report.id}`)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                {getStatusText(report.status)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                                        {/* Image Thumbnails */}
                                        {report.image_urls && report.image_urls.length > 0 && (
                                            <div className="flex gap-2 mb-3">
                                                {report.image_urls.slice(0, 3).map((img: string, idx: number) => (
                                                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-gray-200">
                                                        <img
                                                            src={img}
                                                            alt={`Imagen ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {report.image_urls.length > 3 && (
                                                    <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                                                        +{report.image_urls.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span>📍 {report.address}</span>
                                            <span>📁 {report.category}</span>
                                            <span>👤 {report.user_name || `Usuario #${report.user_id}`}</span>
                                            <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="ml-4" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value={report.status}
                                            onChange={(e) => handleStatusChange(report.id, e.target.value)}
                                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="in_progress">En Proceso</option>
                                            <option value="resolved">Resuelto</option>
                                            <option value="rejected">Rechazado</option>
                                        </select>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
