'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function AdminReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [status, setStatus] = useState('received')
  const [adminComment, setAdminComment] = useState('')
  const [report] = useState({
    id: params.id,
    category: 'Basura',
    status: 'received',
    description: 'Acumulación de basura en la esquina principal del barrio. Se necesita recolección urgente.',
    location: 'Carrera 7 con Calle 45',
    coords: { lat: 4.6097, lng: -74.0817 },
    date: '2025-01-14',
    reporter: 'Juan Pérez',
    reporterEmail: 'juan.perez@email.com',
    comments: [
      {
        text: 'Reporte recibido y en revisión',
        date: '2025-01-14',
        author: 'Sistema',
        isAdmin: true
      }
    ]
  })

  const handleUpdateStatus = () => {
    toast({
      title: 'Estado actualizado',
      description: 'El estado del reporte ha sido actualizado exitosamente'
    })
  }

  const handleAddComment = () => {
    if (!adminComment.trim()) return

    toast({
      title: 'Comentario agregado',
      description: 'Tu comentario ha sido enviado al usuario'
    })

    setAdminComment('')
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/reports">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Detalle del Reporte #{report.id}</h1>
              <p className="text-sm text-muted-foreground">{report.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Management */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold">Gestionar Estado</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Estado Actual</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Recibido</SelectItem>
                      <SelectItem value="in-progress">En Proceso</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleUpdateStatus} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Actualizar Estado
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold">Descripción del Problema</h2>
              <p className="text-muted-foreground">{report.description}</p>
            </div>

            {/* Map */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold">Ubicación en el Mapa</h2>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-12 w-12 text-emerald-600" />
                    <p className="text-sm text-muted-foreground">{report.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {report.coords.lat.toFixed(4)}, {report.coords.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comunicación con el Usuario
              </h2>
              
              {/* Existing Comments */}
              <div className="mb-4 space-y-3">
                {report.comments.map((comment, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 ${
                      comment.isAdmin
                        ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'bg-slate-50 border dark:bg-slate-900'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {comment.isAdmin ? '🛡️ ' : ''}
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Escribe un comentario para el usuario..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} className="w-full">
                  Enviar Comentario
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Info */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold">Información del Reporte</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de reporte</p>
                    <p className="text-sm font-medium">
                      {new Date(report.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ubicación</p>
                    <p className="text-sm font-medium">{report.location}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Badge className={getStatusColor(report.status)} variant="secondary">
                    {report.status === 'received' && 'Recibido'}
                    {report.status === 'in-progress' && 'En Proceso'}
                    {report.status === 'resolved' && 'Resuelto'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold">Reportado Por</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">{report.reporter}</p>
                  <p className="text-sm text-muted-foreground">{report.reporterEmail}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border bg-white p-6 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-semibold">Acciones Rápidas</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Asignar a Equipo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Ver en Mapa
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Marcar como Spam
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
