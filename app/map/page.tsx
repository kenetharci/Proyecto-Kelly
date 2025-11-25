'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapIcon, Filter, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Report {
  id: string
  category: string
  status: 'received' | 'in-progress' | 'resolved'
  location: { lat: number; lng: number }
  description: string
}

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Mock reports data
    setReports([
      {
        id: '1',
        category: 'Basura',
        status: 'received',
        location: { lat: 4.6097, lng: -74.0817 },
        description: 'Acumulación de basura'
      },
      {
        id: '2',
        category: 'Iluminación',
        status: 'in-progress',
        location: { lat: 4.6107, lng: -74.0827 },
        description: 'Poste de luz sin funcionar'
      },
      {
        id: '3',
        category: 'Seguridad',
        status: 'resolved',
        location: { lat: 4.6087, lng: -74.0807 },
        description: 'Alcantarilla destapada'
      },
      {
        id: '4',
        category: 'Infraestructura',
        status: 'received',
        location: { lat: 4.6117, lng: -74.0797 },
        description: 'Bache en la vía'
      },
      {
        id: '5',
        category: 'Basura',
        status: 'in-progress',
        location: { lat: 4.6077, lng: -74.0837 },
        description: 'Contenedor desbordado'
      }
    ])

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          setUserLocation({ lat: 4.6097, lng: -74.0817 })
        }
      )
    } else {
      setUserLocation({ lat: 4.6097, lng: -74.0817 })
    }
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    return matchesCategory && matchesStatus
  })

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'resolved':
        return 'bg-emerald-500'
      default:
        return 'bg-gray-500'
    }
  }

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

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-emerald-600 px-4 py-3 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
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
          <div className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            <h1 className="text-lg font-bold">Mapa de Reportes</h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-background px-4 py-3">
        <div className="mx-auto flex max-w-7xl gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="Basura">Basura</SelectItem>
              <SelectItem value="Iluminación">Iluminación</SelectItem>
              <SelectItem value="Seguridad">Seguridad</SelectItem>
              <SelectItem value="Infraestructura">Infraestructura</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="received">Recibidos</SelectItem>
              <SelectItem value="in-progress">En Proceso</SelectItem>
              <SelectItem value="resolved">Resueltos</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-muted-foreground">
            {filteredReports.length} reportes
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map Area */}
        <div className="relative flex-1 bg-slate-200 dark:bg-slate-800">
          {/* Mock Map Background */}
          <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-700">
              {/* Grid Pattern */}
              <div className="h-full w-full opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,.1) 25%, rgba(0,0,0,.1) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,.1) 25%, rgba(0,0,0,.1) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1) 76%, transparent 77%, transparent)',
                  backgroundSize: '50px 50px'
                }}
              />
            </div>
          </div>

          {/* User Location Marker */}
          {userLocation && (
            <div 
              className="absolute z-20"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative">
                <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-pulse" />
                <div className="absolute -inset-2 rounded-full bg-blue-400 opacity-30 animate-ping" />
              </div>
            </div>
          )}

          {/* Report Markers */}
          {filteredReports.map((report, index) => {
            const offsetX = (index % 5 - 2) * 80
            const offsetY = (Math.floor(index / 5) - 1) * 80
            
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="absolute z-10 transition-transform hover:scale-110"
                style={{
                  left: `calc(50% + ${offsetX}px)`,
                  top: `calc(50% + ${offsetY}px)`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="relative">
                  {/* Pin */}
                  <div className={`h-8 w-8 rounded-full ${getMarkerColor(report.status)} border-2 border-white shadow-lg flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{report.id}</span>
                  </div>
                  {/* Pin pointer */}
                  <div className={`absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 ${getMarkerColor(report.status)}`} 
                    style={{ marginTop: '-4px' }}
                  />
                </div>
              </button>
            )
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg border bg-white p-3 shadow-lg dark:bg-slate-800">
            <h3 className="mb-2 text-xs font-semibold">Leyenda</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Recibido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>En Proceso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span>Resuelto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-600 border-2 border-white" />
                <span>Tu ubicación</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Detail Sidebar */}
        {selectedReport && (
          <div className="w-80 overflow-y-auto border-l bg-background p-4">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-lg font-semibold">Detalle del Reporte</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">ID</p>
                <p className="font-medium">#{selectedReport.id}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Categoría</p>
                <p className="font-medium">{selectedReport.category}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Estado</p>
                <Badge className={getStatusColor(selectedReport.status)} variant="secondary">
                  {selectedReport.status === 'received' && 'Recibido'}
                  {selectedReport.status === 'in-progress' && 'En Proceso'}
                  {selectedReport.status === 'resolved' && 'Resuelto'}
                </Badge>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Descripción</p>
                <p className="text-sm">{selectedReport.description}</p>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Coordenadas</p>
                <p className="text-sm font-mono">
                  {selectedReport.location.lat.toFixed(4)}, {selectedReport.location.lng.toFixed(4)}
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href={`/report/${selectedReport.id}`}>
                  Ver Detalles Completos
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="border-t bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
        Mapa interactivo simulado. En producción se integrará con Google Maps o Mapbox.
      </div>
    </div>
  )
}
