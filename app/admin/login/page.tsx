'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    
    // Validar credenciales
    if (trimmedEmail === 'admin@urbana.com' && trimmedPassword === 'admin123') {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@urbana.com',
        name: 'Administrador Municipal',
        role: 'admin'
      }
      
      try {
        localStorage.setItem('user', JSON.stringify(adminUser))
        
        // Redirect immediately
        window.location.href = '/admin/dashboard'
      } catch (err) {
        setError('Error al guardar sesión')
        setIsLoading(false)
      }
    } else {
      setError('Credenciales incorrectas. Usa admin@urbana.com / admin123')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Panel de Administración
          </h1>
          <p className="text-slate-300">
            Acceso solo para personal autorizado
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-900/30 border border-red-700 p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@urbana.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            size="lg" 
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Acceder al Panel'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-white">
            ← Volver al inicio
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-blue-900/30 p-4 border border-blue-700">
          <p className="text-center text-sm font-semibold text-blue-200 mb-2">
            Credenciales de Administrador
          </p>
          <p className="text-center text-xs text-blue-300">
            Email: admin@urbana.com
          </p>
          <p className="text-center text-xs text-blue-300">
            Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  )
}
