'use client'

import { useState, useEffect } from 'react'
import { MapPin, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number }) => void
  initialLocation?: { lat: number; lng: number }
}

export function LocationPicker({ onLocationChange, initialLocation }: LocationPickerProps) {
  const { toast } = useToast()
  const [location, setLocation] = useState(initialLocation || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGetLocation = () => {
    setIsLoading(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setLocation(newLocation)
          onLocationChange(newLocation)
          setIsLoading(false)
          
          toast({
            title: 'Ubicación detectada',
            description: 'Tu ubicación ha sido obtenida exitosamente'
          })
        },
        (error) => {
          console.log('[v0] Geolocation error:', error)
          // Use mock location if geolocation fails
          const mockLocation = { lat: 4.6097, lng: -74.0817 }
          setLocation(mockLocation)
          onLocationChange(mockLocation)
          setIsLoading(false)
          
          toast({
            title: 'Ubicación simulada',
            description: 'Usando ubicación de ejemplo (Bogotá, Colombia)'
          })
        }
      )
    } else {
      const mockLocation = { lat: 4.6097, lng: -74.0817 }
      setLocation(mockLocation)
      onLocationChange(mockLocation)
      setIsLoading(false)
      
      toast({
        title: 'Ubicación simulada',
        description: 'Tu navegador no soporta geolocalización'
      })
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={handleGetLocation}
        disabled={isLoading}
      >
        <Crosshair className="h-5 w-5" />
        {isLoading ? 'Obteniendo ubicación...' : location ? 'Actualizar ubicación' : 'Obtener mi ubicación'}
      </Button>

      {location && (
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium">Ubicación seleccionada</span>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                <p className="text-xs font-mono text-muted-foreground">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
