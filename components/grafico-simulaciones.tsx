"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function GraficoSimulaciones({ simulaciones, parametros }) {
  const datos_grafico = simulaciones.map((dia) => ({
    dia: dia.dia,
    promedio: Number.parseFloat(dia.promedio.toFixed(2)),
    percentil_5: Number.parseFloat(dia.percentil_5.toFixed(2)),
    percentil_95: Number.parseFloat(dia.percentil_95.toFixed(2)),
  }))

  return (
    <Card className="border-default">
      <CardContent>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={datos_grafico} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="dia" stroke="var(--color-text-secondary)" />
            <YAxis stroke="var(--color-text-secondary)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              formatter={(value) => value.toFixed(2)}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend wrapperStyle={{ color: "var(--color-text-secondary)" }} />
            <Line
              type="monotone"
              dataKey="promedio"
              stroke="var(--color-primary)"
              name="Promedio"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="percentil_95"
              stroke="var(--color-accent)"
              name="Porcentaje 95"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="percentil_5"
              stroke="var(--color-danger)"
              name="Porcentaje 5"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
