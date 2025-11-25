'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Plus, List, User, MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Report {
  id: string
  category: string
  status: 'received' | 'in-progress' | 'resolved'
  location: { lat: number; lng: number }
  description: string
  date: string
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [nearbyReports, setNearbyReports] = useState<Report[]>([])

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock nearby reports
    setNearbyReports([
      {
        id: '1',
        category: 'Basura',
        status: 'received',
        location: { lat: 4.6097, lng: -74.0817 },
        description: 'Acumulación de basura en la esquina',
        date: '2025-01-13'
      },
      {
        id: '2',
        category: 'Iluminación',
        status: 'in-progress',
        location: { lat: 4.6107, lng: -74.0827 },
        description: 'Poste de luz sin funcionar',
        date: '2025-01-12'
      },
      {
        id: '3',
        category: 'Seguridad',
        status: 'resolved',
        location: { lat: 4.6087, lng: -74.0807 },
        description: 'Alcantarilla destapada',
        date: '2025-01-11'
      }
    ])
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-emerald-600 px-4 py-6 text-white">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hola, {user?.name || 'Usuario'}</h1>
              <p className="text-sm text-emerald-100">¿Qué problema vas a reportar hoy?</p>
            </div>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="text-white hover:bg-emerald-700"
            >
              <Link href="/profile">
                <User className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-md px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="h-auto flex-col gap-2 py-4">
            <Link href="/create-report">
              <Plus className="h-6 w-6" />
              <span>Nuevo Reporte</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link href="/reports">
              <List className="h-6 w-6" />
              <span>Mis Reportes</span>
            </Link>
          </Button>
        </div>

        {/* Map Preview */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Reportes Cercanos</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/map">
                Ver Mapa <MapIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Mock map */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="mx-auto mb-2 h-12 w-12 text-slate-400" />
                <p className="text-sm text-slate-500">Vista del mapa interactivo</p>
              </div>
            </div>
            {/* Mock pins */}
            <div className="absolute left-1/4 top-1/4 h-8 w-8 rounded-full bg-red-500 border-2 border-white shadow-lg" />
            <div className="absolute left-2/3 top-1/3 h-8 w-8 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            <div className="absolute left-1/2 top-2/3 h-8 w-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg" />
          </div>
        </div>

        {/* Recent Reports List */}
        <div>
          <h2 className="mb-3 font-semibold text-foreground">Actividad Reciente</h2>
          <div className="space-y-3">
            {nearbyReports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="block rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{report.category}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short'
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
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="mx-auto flex max-w-md items-center justify-around py-3">
          <Button asChild variant="ghost" size="sm" className="flex-col gap-1 h-auto text-emerald-600">
            <Link href="/home">
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Inicio</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-col gap-1 h-auto">
            <Link href="/map">
              <MapIcon className="h-5 w-5" />
              <span className="text-xs">Mapa</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-col gap-1 h-auto">
            <Link href="/reports">
              <List className="h-5 w-5" />
              <span className="text-xs">Reportes</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-col gap-1 h-auto">
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="text-xs">Perfil</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
