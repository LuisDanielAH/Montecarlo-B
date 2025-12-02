"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import FormularioSimulacion from "@/components/formulario-simulacion"
import GraficoSimulaciones from "@/components/grafico-simulaciones"
import ResumenResultados from "@/components/resumen-resultados"
import { simularMonteCarlo } from "@/lib/simulacion-monte-carlo"

export default function Inicio() {
  const [resultados, setResultados] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [parametros, setParametros] = useState(null)

  const manejarSimulacion = async (datos) => {
    setParametros(datos)
    setCargando(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const resultado = simularMonteCarlo({
        precioActual: datos.precioActual,
        volatilidad: datos.volatilidad,
        dias: datos.dias,
        numSimulaciones: datos.numSimulaciones,
      })
      setResultados(resultado)
    } catch (error) {
      console.error("Error en la simulacion:", error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="pt-2">
              <h1 className="text-3xl font-bold text-foreground">Análisis de Riesgo</h1>
            </div>

            <FormularioSimulacion onSimular={manejarSimulacion} cargando={cargando} />
          </div>

          <div className="lg:col-span-9 flex flex-col gap-6">
            {resultados && parametros ? (
              <>
                <GraficoSimulaciones simulaciones={resultados.simulaciones} parametros={parametros} />
                <ResumenResultados
                  estadisticas={resultados.estadisticas}
                  var={resultados.var}
                  precioActual={parametros.precioActual}
                />
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center border-default">
                <CardContent className="text-center text-secondary">
                  Análisis
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
