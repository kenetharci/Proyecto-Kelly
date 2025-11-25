'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      // Validate specific user credentials
      if (email === 'usuario@urbana.com' && password === 'usuario123') {
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          email: 'usuario@urbana.com',
          name: 'Juan Pérez',
          role: 'user'
        }))

        toast({
          title: 'Bienvenido Juan!',
          description: 'Has iniciado sesión correctamente',
        })

        router.push('/home')
      } else {
        toast({
          title: 'Error de autenticación',
          description: 'Correo o contraseña incorrectos',
          variant: 'destructive'
        })
      }
      
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
            Iniciar Sesión
          </h1>
          <p className="text-muted-foreground">
            Accede a tu cuenta
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">o</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Links */}
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Regístrate
            </Link>
          </p>
          <Link href="/home" className="block text-sm text-muted-foreground hover:text-foreground">
            Continuar sin cuenta
          </Link>
        </div>

        {/* Demo Info */}
        <div className="mt-8 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <p className="text-center text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
            Credenciales de Usuario
          </p>
          <p className="text-center text-xs text-emerald-700 dark:text-emerald-300">
            Email: usuario@urbana.com
          </p>
          <p className="text-center text-xs text-emerald-700 dark:text-emerald-300">
            Contraseña: usuario123
          </p>
        </div>
      </div>
    </div>
  )
}
