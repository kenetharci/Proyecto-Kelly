'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface Report {
  id: string
  category: string
  status: string
  location: { lat: number; lng: number }
  description: string
  date: string
  images?: string[]
  comments?: Array<{ text: string; date: string; author: string }>
}

export default function ReportDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [report, setReport] = useState<Report | null>(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    // Get report from localStorage or use mock data
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]')
    const found = reports.find((r: Report) => r.id === params.id)
    
    if (found) {
      setReport(found)
    } else {
      // Mock data
      setReport({
        id: params.id as string,
        category: 'Basura',
        status: 'in-progress',
        location: { lat: 4.6097, lng: -74.0817 },
        description: 'Acumulación de basura en la esquina principal del barrio',
        date: '2025-01-13',
        comments: [
          {
            text: 'Hemos recibido tu reporte y está siendo revisado',
            date: '2025-01-13',
            author: 'Sistema'
          }
        ]
      })
    }
  }, [params.id])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const updatedReport = {
      ...report!,
      comments: [
        ...(report?.comments || []),
        {
          text: newComment,
          date: new Date().toISOString(),
          author: 'Tú'
        }
      ]
    }

    setReport(updatedReport)
    setNewComment('')

    toast({
      title: 'Comentario agregado',
      description: 'Tu comentario ha sido añadido al reporte'
    })
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
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
            <Link href="/reports">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Detalle del Reporte</h1>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        {/* Status Badge */}
        <div className="mb-4 flex justify-between items-start">
          <Badge className={getStatusColor(report.status)} variant="secondary">
            {getStatusText(report.status)}
          </Badge>
          <span className="text-sm text-muted-foreground">#{report.id}</span>
        </div>

        {/* Category */}
        <h2 className="mb-4 text-2xl font-bold text-foreground">{report.category}</h2>

        {/* Info Cards */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-card p-3 border">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha de reporte</p>
              <p className="font-medium">
                {new Date(report.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-card p-3 border">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Ubicación</p>
              <p className="font-medium">
                {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-foreground">Descripción</h3>
          <p className="text-muted-foreground">{report.description}</p>
        </div>

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-foreground">Fotos</h3>
            <div className="grid grid-cols-2 gap-2">
              {report.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Foto ${index + 1}`}
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Map Preview */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-foreground">Ubicación en el Mapa</h3>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-foreground">Comentarios y Actualizaciones</h3>
          <div className="space-y-3">
            {report.comments?.map((comment, index) => (
              <div key={index} className="rounded-lg border bg-card p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div>
          <h3 className="mb-3 font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Agregar Información
          </h3>
          <Textarea
            placeholder="Añade información adicional sobre este reporte..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="mb-3"
          />
          <Button onClick={handleAddComment} className="w-full">
            Agregar Comentario
          </Button>
        </div>
      </div>
    </div>
  )
}
