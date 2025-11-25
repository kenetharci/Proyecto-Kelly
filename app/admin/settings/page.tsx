'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Users, MapPin, Bell, Shield, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  
  const [settings, setSettings] = useState({
    autoAssign: true,
    emailNotifications: true,
    requireApproval: false,
    allowAnonymous: true,
    maxImagesPerReport: '4',
    reportRetentionDays: '365'
  })

  const [categories, setCategories] = useState([
    { id: '1', name: 'Basura', active: true },
    { id: '2', name: 'Iluminación', active: true },
    { id: '3', name: 'Seguridad', active: true },
    { id: '4', name: 'Infraestructura', active: true },
    { id: '5', name: 'Otros', active: true }
  ])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    
    toast({
      title: 'Configuración actualizada',
      description: 'Los cambios han sido guardados'
    })
  }

  const handleCategoryToggle = (id: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    )
    
    toast({
      title: 'Categoría actualizada',
      description: 'El cambio ha sido guardado'
    })
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
              <Settings className="h-5 w-5" />
              <h1 className="text-xl font-bold text-foreground">Configuración del Sistema</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>
                Ajusta el comportamiento general del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-asignación de Reportes</p>
                  <p className="text-sm text-muted-foreground">
                    Asignar automáticamente reportes a equipos por zona
                  </p>
                </div>
                <Switch
                  checked={settings.autoAssign}
                  onCheckedChange={(checked) => handleSettingChange('autoAssign', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones por Email</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar emails a usuarios sobre actualizaciones
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Requerir Aprobación</p>
                  <p className="text-sm text-muted-foreground">
                    Los reportes deben ser aprobados antes de publicarse
                  </p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Permitir Reportes Anónimos</p>
                  <p className="text-sm text-muted-foreground">
                    Los usuarios pueden reportar sin cuenta
                  </p>
                </div>
                <Switch
                  checked={settings.allowAnonymous}
                  onCheckedChange={(checked) => handleSettingChange('allowAnonymous', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Report Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Configuración de Reportes
              </CardTitle>
              <CardDescription>
                Personaliza las reglas para los reportes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxImages">Máximo de Imágenes por Reporte</Label>
                <Select
                  value={settings.maxImagesPerReport}
                  onValueChange={(value) => handleSettingChange('maxImagesPerReport', value)}
                >
                  <SelectTrigger id="maxImages" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 imagen</SelectItem>
                    <SelectItem value="2">2 imágenes</SelectItem>
                    <SelectItem value="3">3 imágenes</SelectItem>
                    <SelectItem value="4">4 imágenes</SelectItem>
                    <SelectItem value="5">5 imágenes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="retention">Días de Retención de Reportes</Label>
                <Select
                  value={settings.reportRetentionDays}
                  onValueChange={(value) => handleSettingChange('reportRetentionDays', value)}
                >
                  <SelectTrigger id="retention" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">180 días</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                    <SelectItem value="730">2 años</SelectItem>
                    <SelectItem value="-1">Permanente</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reportes resueltos se archivarán después de este período
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestión de Categorías
              </CardTitle>
              <CardDescription>
                Activa o desactiva categorías de reportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-medium">{category.name}</span>
                    <Switch
                      checked={category.active}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Plantillas de Notificación
              </CardTitle>
              <CardDescription>
                Personaliza los mensajes automáticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="receivedTemplate">Reporte Recibido</Label>
                <Input
                  id="receivedTemplate"
                  defaultValue="Hemos recibido tu reporte y está siendo revisado"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="progressTemplate">En Proceso</Label>
                <Input
                  id="progressTemplate"
                  defaultValue="Tu reporte está siendo atendido por nuestro equipo"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="resolvedTemplate">Resuelto</Label>
                <Input
                  id="resolvedTemplate"
                  defaultValue="Tu reporte ha sido resuelto exitosamente"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Configuración de seguridad del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  defaultValue="60"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxAttempts">Máximo de Intentos de Login</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  defaultValue="5"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Restablecer Valores</Button>
            <Button onClick={() => toast({ title: 'Configuración guardada', description: 'Todos los cambios han sido aplicados' })}>
              Guardar Todos los Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
