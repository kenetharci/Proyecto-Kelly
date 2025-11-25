'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, MapPin, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

const CATEGORIES = [
  { id: 'basura', name: 'Basura', icon: '🗑️' },
  { id: 'iluminacion', name: 'Iluminación', icon: '💡' },
  { id: 'seguridad', name: 'Seguridad', icon: '🚨' },
  { id: 'infraestructura', name: 'Infraestructura', icon: '🏗️' },
  { id: 'otros', name: 'Otros', icon: '📋' }
]

export default function CreateReportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          toast({
            title: 'Ubicación obtenida',
            description: 'Tu ubicación ha sido detectada exitosamente'
          })
        },
        () => {
          // Use mock location if geolocation fails
          setLocation({ lat: 4.6097, lng: -74.0817 })
          toast({
            title: 'Ubicación simulada',
            description: 'Usando ubicación de ejemplo para la demo'
          })
        }
      )
    } else {
      setLocation({ lat: 4.6097, lng: -74.0817 })
      toast({
        title: 'Ubicación simulada',
        description: 'Usando ubicación de ejemplo para la demo'
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages].slice(0, 4)) // Max 4 images
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una categoría',
        variant: 'destructive'
      })
      return
    }

    if (!location) {
      toast({
        title: 'Error',
        description: 'Por favor obtén tu ubicación',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newReport = {
        id: Date.now().toString(),
        category: CATEGORIES.find(c => c.id === selectedCategory)?.name,
        description,
        location,
        images,
        status: 'received',
        date: new Date().toISOString()
      }

      // Save to localStorage
      const reports = JSON.parse(localStorage.getItem('userReports') || '[]')
      reports.unshift(newReport)
      localStorage.setItem('userReports', JSON.stringify(reports))

      toast({
        title: 'Reporte enviado!',
        description: 'Tu reporte ha sido recibido y será procesado pronto'
      })

      router.push('/reports')
      setIsLoading(false)
    }, 1500)
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
          <h1 className="text-xl font-bold">Crear Reporte</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-md px-4 py-6">
        {/* Category Selection */}
        <div className="mb-6">
          <Label className="mb-3 block">Categoría del Problema</Label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  selectedCategory === category.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-border bg-card hover:border-emerald-300'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label className="mb-3 block">Ubicación</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleGetLocation}
          >
            <MapPin className="h-5 w-5" />
            {location
              ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
              : 'Obtener mi ubicación'}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Tu ubicación será detectada automáticamente
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <Label htmlFor="description" className="mb-3 block">
            Descripción del Problema
          </Label>
          <Textarea
            id="description"
            placeholder="Describe el problema con el mayor detalle posible..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Images */}
        <div className="mb-6">
          <Label className="mb-3 block">Fotos (Opcional)</Label>
          
          {/* Image Grid */}
          {images.length > 0 && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <img src={image || "/placeholder.svg"} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {images.length < 4 && (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-card p-6 transition-colors hover:border-emerald-300 hover:bg-accent">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Subir fotos ({images.length}/4)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Enviando Reporte...' : 'Enviar Reporte'}
        </Button>
      </form>
    </div>
  )
}
