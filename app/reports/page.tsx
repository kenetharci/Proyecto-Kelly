'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Report {
  id: string
  category: string
  status: string
  location: { lat: number; lng: number }
  description: string
  date: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    // Get reports from localStorage
    const storedReports = localStorage.getItem('userReports')
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    } else {
      // Mock data if no reports
      setReports([
        {
          id: '1',
          category: 'Basura',
          status: 'received',
          location: { lat: 4.6097, lng: -74.0817 },
          description: 'Acumulación de basura en la esquina principal',
          date: '2025-01-13'
        },
        {
          id: '2',
          category: 'Iluminación',
          status: 'in-progress',
          location: { lat: 4.6107, lng: -74.0827 },
          description: 'Poste de luz sin funcionar desde hace 3 días',
          date: '2025-01-12'
        }
      ])
    }
  }, [])

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

  const filterReports = (filter: string) => {
    if (filter === 'all') return reports
    return reports.filter(r => r.status === filter)
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-emerald-600 px-4 py-4 text-white">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="text-white hover:bg-emerald-700"
          >
            <Link href="/home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Mis Reportes</h1>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="received">Recibidos</TabsTrigger>
            <TabsTrigger value="in-progress">En Proceso</TabsTrigger>
            <TabsTrigger value="resolved">Resueltos</TabsTrigger>
          </TabsList>

          {['all', 'received', 'in-progress', 'resolved'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {filterReports(tab).length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No hay reportes en esta categoría</p>
                </div>
              ) : (
                filterReports(tab).map((report) => (
                  <Link
                    key={report.id}
                    href={`/report/${report.id}`}
                    className="block rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {report.category}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(report.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {getStatusText(report.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
