'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    // Simulate registration with fake data
    setTimeout(() => {
      // Store mock user session
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email,
        name,
        role: 'user'
      }))

      toast({
        title: 'Cuenta creada!',
        description: 'Tu cuenta ha sido creada exitosamente',
      })

      router.push('/home')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-background">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </Link>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Crear Cuenta
          </h1>
          <p className="text-muted-foreground">
            Únete a la comunidad
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <p className="text-center text-xs text-emerald-700 dark:text-emerald-300">
            Demo: Ingresa cualquier datos para crear tu cuenta
          </p>
        </div>
      </div>
    </div>
  )
}
