'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapIcon, BarChart3, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminMapPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [categoryStats, setCategoryStats] = useState([
    { category: 'Basura', count: 45, percentage: 35 },
    { category: 'Iluminación', count: 32, percentage: 25 },
    { category: 'Seguridad', count: 28, percentage: 22 },
    { category: 'Infraestructura', count: 23, percentage: 18 }
  ])

  const getBarWidth = (percentage: number) => {
    return `${percentage}%`
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
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <h1 className="text-xl font-bold text-foreground">Estadísticas y Mapa</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Time Range Selector */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Análisis de Reportes</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Heat Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                Mapa de Calor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                {/* Mock heat map */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-700">
                  {/* Hot zones */}
                  <div className="absolute left-1/4 top-1/4 h-24 w-24 rounded-full bg-red-500/40 blur-xl" />
                  <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-orange-500/30 blur-xl" />
                  <div className="absolute bottom-1/4 left-1/3 h-20 w-20 rounded-full bg-yellow-500/20 blur-xl" />
                  
                  {/* Markers */}
                  <div className="absolute left-1/4 top-1/4 h-3 w-3 rounded-full bg-red-600 border-2 border-white shadow-lg" />
                  <div className="absolute right-1/4 top-1/3 h-3 w-3 rounded-full bg-orange-600 border-2 border-white shadow-lg" />
                  <div className="absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-yellow-600 border-2 border-white shadow-lg" />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-emerald-600 border-2 border-white shadow-lg" />
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Las zonas rojas indican mayor concentración de reportes
              </p>
            </CardContent>
          </Card>

          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reportes por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{stat.category}</span>
                      <span className="text-muted-foreground">{stat.count} reportes</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: getBarWidth(stat.percentage) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Reportes Totales</span>
                    <span className="text-sm text-emerald-600">+12% ↑</span>
                  </div>
                  <p className="text-2xl font-bold">128</p>
                  <p className="text-xs text-muted-foreground">vs. período anterior</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Tiempo de Resolución</span>
                    <span className="text-sm text-emerald-600">-8% ↓</span>
                  </div>
                  <p className="text-2xl font-bold">4.2 días</p>
                  <p className="text-xs text-muted-foreground">promedio</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Tasa de Resolución</span>
                    <span className="text-sm text-emerald-600">+5% ↑</span>
                  </div>
                  <p className="text-2xl font-bold">86%</p>
                  <p className="text-xs text-muted-foreground">reportes resueltos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Zona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Zona Norte</p>
                    <p className="text-sm text-muted-foreground">45 reportes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">Alto</p>
                    <p className="text-xs text-muted-foreground">+15% esta semana</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Zona Centro</p>
                    <p className="text-sm text-muted-foreground">32 reportes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">Medio</p>
                    <p className="text-xs text-muted-foreground">+5% esta semana</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Zona Sur</p>
                    <p className="text-sm text-muted-foreground">28 reportes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">Medio</p>
                    <p className="text-xs text-muted-foreground">-2% esta semana</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Zona Oeste</p>
                    <p className="text-sm text-muted-foreground">23 reportes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600">Bajo</p>
                    <p className="text-xs text-muted-foreground">-8% esta semana</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
