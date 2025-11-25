'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MOCK_REPORTS = [
  {
    id: '1',
    category: 'Basura',
    status: 'received',
    description: 'Acumulación de basura en esquina principal',
    location: 'Carrera 7 con Calle 45',
    date: '2025-01-14',
    reporter: 'Juan Pérez'
  },
  {
    id: '2',
    category: 'Iluminación',
    status: 'in-progress',
    description: 'Poste de luz sin funcionar',
    location: 'Avenida 68 con Calle 80',
    date: '2025-01-13',
    reporter: 'María García'
  },
  {
    id: '3',
    category: 'Seguridad',
    status: 'received',
    description: 'Alcantarilla destapada peligrosa',
    location: 'Calle 100 con Carrera 15',
    date: '2025-01-13',
    reporter: 'Pedro López'
  },
  {
    id: '4',
    category: 'Infraestructura',
    status: 'resolved',
    description: 'Bache grande en la vía',
    location: 'Autopista Norte Km 12',
    date: '2025-01-11',
    reporter: 'Ana Martínez'
  },
  {
    id: '5',
    category: 'Basura',
    status: 'in-progress',
    description: 'Contenedor de basura desbordado',
    location: 'Carrera 13 con Calle 26',
    date: '2025-01-12',
    reporter: 'Carlos Rodríguez'
  }
]

export default function AdminReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredReports = MOCK_REPORTS.filter(report => {
    const matchesSearch = 
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      default:
        return ''
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received':
        return 'Recibido'
      case 'in-progress':
        return 'En Proceso'
      case 'resolved':
        return 'Resuelto'
      default:
        return status
    }
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
            <h1 className="text-xl font-bold text-foreground">Gestionar Reportes</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar reportes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="received">Recibidos</SelectItem>
              <SelectItem value="in-progress">En Proceso</SelectItem>
              <SelectItem value="resolved">Resueltos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="Basura">Basura</SelectItem>
              <SelectItem value="Iluminación">Iluminación</SelectItem>
              <SelectItem value="Seguridad">Seguridad</SelectItem>
              <SelectItem value="Infraestructura">Infraestructura</SelectItem>
              <SelectItem value="Otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Mostrando {filteredReports.length} de {MOCK_REPORTS.length} reportes
        </p>

        {/* Reports Table */}
        <div className="overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Descripción</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ubicación</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Reportado por</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-sm">#{report.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{report.category}</td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">{report.description}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{report.location}</td>
                    <td className="px-4 py-3 text-sm">{report.reporter}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {getStatusText(report.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/reports/${report.id}`}>
                          Ver Detalles
                        </Link>
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
