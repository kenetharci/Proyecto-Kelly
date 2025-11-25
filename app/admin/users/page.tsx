'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, UserCheck, UserX, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MOCK_USERS = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    reports: 5,
    status: 'active',
    joined: '2024-12-01'
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@email.com',
    reports: 3,
    status: 'active',
    joined: '2024-12-15'
  },
  {
    id: '3',
    name: 'Pedro López',
    email: 'pedro.lopez@email.com',
    reports: 8,
    status: 'active',
    joined: '2024-11-20'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    reports: 2,
    status: 'inactive',
    joined: '2024-10-05'
  }
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: MOCK_USERS.length,
    active: MOCK_USERS.filter(u => u.status === 'active').length,
    inactive: MOCK_USERS.filter(u => u.status === 'inactive').length
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-foreground">Gestionar Usuarios</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <UserX className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-400">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Reportes</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fecha de Registro</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.reports}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                        }
                      >
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.joined).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
