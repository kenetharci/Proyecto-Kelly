'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Bell, Shield, LogOut, Edit, Save, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    statusUpdates: true,
    communityUpdates: false
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setName(parsedUser.name)
      setEmail(parsedUser.email)
    } else {
      router.push('/login')
    }

    // Get user reports stats
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]')
    setStats({
      totalReports: reports.length,
      pendingReports: reports.filter((r: any) => r.status === 'received' || r.status === 'in-progress').length,
      resolvedReports: reports.filter((r: any) => r.status === 'resolved').length
    })
  }, [router])

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name,
      email
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    
    toast({
      title: 'Perfil actualizado',
      description: 'Tus cambios han sido guardados exitosamente'
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión exitosamente'
    })
    router.push('/')
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
    
    toast({
      title: 'Preferencia actualizada',
      description: 'Tu configuración de notificaciones ha sido guardada'
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-emerald-600 px-4 py-4 text-white">
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
          <h1 className="text-xl font-bold">Mi Perfil</h1>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        {/* Profile Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <User className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mb-1 text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.role === 'admin' && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              <Shield className="h-3 w-3" />
              Administrador
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalReports}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.resolvedReports}</p>
              <p className="text-xs text-muted-foreground">Resueltos</p>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones por Email</p>
                <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones Push</p>
                <p className="text-sm text-muted-foreground">Alertas en tiempo real</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Actualizaciones de Estado</p>
                <p className="text-sm text-muted-foreground">Cuando cambien tus reportes</p>
              </div>
              <Switch
                checked={notifications.statusUpdates}
                onCheckedChange={(checked) => handleNotificationChange('statusUpdates', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Noticias de la Comunidad</p>
                <p className="text-sm text-muted-foreground">Reportes cercanos a ti</p>
              </div>
              <Switch
                checked={notifications.communityUpdates}
                onCheckedChange={(checked) => handleNotificationChange('communityUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/reports">
                <MapPin className="mr-2 h-4 w-4" />
                Ver Mis Reportes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/map">
                <MapPin className="mr-2 h-4 w-4" />
                Explorar Mapa
              </Link>
            </Button>
            {user.role === 'admin' && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/dashboard">
                  <Shield className="mr-2 h-4 w-4" />
                  Panel de Administración
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acerca de la App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">App Urbana Reporta</strong> es una plataforma ciudadana para reportar problemas urbanos y contribuir a ciudades más sostenibles.
            </p>
            <p>
              Alineado con el <strong className="text-foreground">ODS 11</strong>: Ciudades y Comunidades Sostenibles
            </p>
            <p className="text-xs">Versión 1.0.0 - Demo</p>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
