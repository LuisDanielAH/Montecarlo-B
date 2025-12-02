"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FormularioSimulacion({ onSimular, cargando }) {
  const [precioActual, setPrecioActual] = useState("1240")
  const [volatilidad, setVolatilidad] = useState("18")
  const [dias, setDias] = useState("30")
  const [numSimulaciones, setNumSimulaciones] = useState("1000")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSimular({
      precioActual: Number.parseFloat(precioActual),
      volatilidad: Number.parseFloat(volatilidad),
      dias: Number.parseInt(dias),
      numSimulaciones: Number.parseInt(numSimulaciones),
    })
  }

  return (
    <Card className="border-default sticky top-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="precio" className="text-sm font-medium text-foreground">
              Precio Actual
            </Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              value={precioActual}
              onChange={(e) => setPrecioActual(e.target.value)}
              disabled={cargando}
              className="border-default focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volatilidad" className="text-sm font-medium text-foreground">
              Volatilidad Anual (%)
            </Label>
            <Input
              id="volatilidad"
              type="number"
              step="0.1"
              value={volatilidad}
              onChange={(e) => setVolatilidad(e.target.value)}
              disabled={cargando}
              className="border-default focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dias" className="text-sm font-medium text-foreground">
              Días
            </Label>
            <Input
              id="dias"
              type="number"
              min="1"
              max="365"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              disabled={cargando}
              className="border-default focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="simulaciones" className="text-sm font-medium text-foreground">
              Simulaciones
            </Label>
            <Input
              id="simulaciones"
              type="number"
              min="100"
              max="5000"
              value={numSimulaciones}
              onChange={(e) => setNumSimulaciones(e.target.value)}
              disabled={cargando}
              className="border-default focus:border-[var(--color-primary)]"
            />
          </div>

          <Button
            type="submit"
            disabled={cargando}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-2 rounded-lg transition-colors"
          >
            {cargando ? "Procesando..." : "Analizar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
