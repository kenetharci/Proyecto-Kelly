'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, MapPin, Users, AlertCircle, CheckCircle, Clock, LogOut, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 156,
    received: 45,
    inProgress: 38,
    resolved: 73
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role !== 'admin') {
        router.push('/login')
      }
      setAdmin(userData)
    } else {
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/admin/login')
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">App Urbana Reporta</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reportes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Todos los reportes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recibidos</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.received}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Siendo atendidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Completados</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Button asChild size="lg" className="h-auto flex-col gap-2 py-6">
            <Link href="/admin/reports">
              <MapPin className="h-6 w-6" />
              <span>Gestionar Reportes</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-2 py-6">
            <Link href="/admin/users">
              <Users className="h-6 w-6" />
              <span>Gestionar Usuarios</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-2 py-6">
            <Link href="/admin/map">
              <BarChart3 className="h-6 w-6" />
              <span>Ver Estadísticas</span>
            </Link>
          </Button>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar reportes..." className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Link
                href="/admin/reports/1"
                className="block rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Basura acumulada</h4>
                    <p className="text-sm text-muted-foreground">Carrera 7 con Calle 45</p>
                  </div>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Recibido
                  </span>
                </div>
              </Link>
              <Link
                href="/admin/reports/2"
                className="block rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Poste de luz dañado</h4>
                    <p className="text-sm text-muted-foreground">Avenida 68 con Calle 80</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    En Proceso
                  </span>
                </div>
              </Link>
              <Link
                href="/admin/reports/3"
                className="block rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Alcantarilla destapada</h4>
                    <p className="text-sm text-muted-foreground">Calle 100 con Carrera 15</p>
                  </div>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Recibido
                  </span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
