"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle, Clock, Users, TrendingUp, MapPin, LogOut, UserPlus } from "lucide-react"
import { Card } from "@/components/Card"

interface Stats {
  totalReports: number
  pendingReports: number
  approvedReports: number
  rejectedReports: number
  totalUsers: number
  usersToday: number
  reportsToday: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    pendingReports: 0,
    approvedReports: 0,
    rejectedReports: 0,
    totalUsers: 0,
    usersToday: 0,
    reportsToday: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")

      // Fetch all reports
      const reportsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (reportsResponse.ok) {
        const reports = await reportsResponse.json()

        // Calculate stats from reports
        const totalReports = reports.length
        const pendingReports = reports.filter((r: any) => r.status === "pending").length
        const approvedReports = reports.filter((r: any) => r.status === "resolved").length
        const rejectedReports = reports.filter((r: any) => r.status === "rejected").length

        // Fetch users count
        const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        let totalUsers = 0
        let usersToday = 0
        if (usersResponse.ok) {
          const users = await usersResponse.json()
          totalUsers = users.length

          // Calculate users registered today
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          usersToday = users.filter((u: any) => {
            const userDate = new Date(u.created_at)
            userDate.setHours(0, 0, 0, 0)
            return userDate.getTime() === today.getTime()
          }).length
        }

        // Calculate reports today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const reportsToday = reports.filter((r: any) => {
          const reportDate = new Date(r.created_at)
          reportDate.setHours(0, 0, 0, 0)
          return reportDate.getTime() === today.getTime()
        }).length

        setStats({
          totalReports,
          pendingReports,
          approvedReports,
          rejectedReports,
          totalUsers,
          usersToday,
          reportsToday,
        })
      } else {
        console.error("Failed to fetch reports:", reportsResponse.status)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Estadísticas Generales</h2>
          <p className="text-gray-600">Resumen de la actividad del sistema</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/reports?filter=all")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reportes Totales</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/reports?filter=pending")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pendingReports}</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/reports?filter=resolved")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprobados</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{stats.approvedReports}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/reports?filter=rejected")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rechazados</p>
                <p className="mt-2 text-3xl font-bold text-red-600">{stats.rejectedReports}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/users")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span className="text-green-600 font-medium">+{stats.usersToday}</span>
              <span className="ml-2">hoy</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reportes Hoy</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.reportsToday}</p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
            <div className="mt-4 space-y-3">
              <button
                className="flex w-full items-center justify-start rounded-md border border-input bg-transparent px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => router.push("/reports")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Ver reportes pendientes
              </button>
              <button
                className="flex w-full items-center justify-start rounded-md border border-input bg-transparent px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => router.push("/users")}
              >
                <Users className="mr-2 h-4 w-4" />
                Gestionar usuarios
              </button>
              <button
                className="flex w-full items-center justify-start rounded-md border border-input bg-transparent px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => router.push("/map")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Ver mapa de reportes
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>• Nuevo reporte en Zona Norte hace 5 minutos</p>
              <p>• Usuario registrado hace 15 minutos</p>
              <p>• Reporte aprobado hace 1 hora</p>
              <p>• Comentario añadido hace 2 horas</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
