import Link from 'next/link'
import { MapPin, Camera, Bell, Users, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-background">
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Logo/Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg">
            <MapPin className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            App Urbana Reporta
          </h1>
          <p className="text-balance text-muted-foreground">
            Mejoremos juntos nuestra ciudad
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-4">
          <FeatureCard
            icon={<Camera className="h-6 w-6" />}
            title="Reporta problemas"
            description="Captura y envía incidencias urbanas con fotos"
          />
          <FeatureCard
            icon={<MapPin className="h-6 w-6" />}
            title="Geolocalización"
            description="Ubicación automática de tu reporte"
          />
          <FeatureCard
            icon={<Bell className="h-6 w-6" />}
            title="Seguimiento"
            description="Recibe actualizaciones del estado"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Comunidad"
            description="Ve reportes de otros ciudadanos"
          />
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
            <Link href="/home" className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              Entrar como Usuario
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950" size="lg">
            <Link href="/admin/dashboard" className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Entrar como Admin
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Alineado con ODS 11</p>
          <p className="mt-1">Ciudades y Comunidades Sostenibles</p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-card">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
