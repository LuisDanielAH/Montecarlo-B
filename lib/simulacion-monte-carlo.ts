export interface ParametrosSimulacion {
  precioActual: number
  volatilidad: number
  dias: number
  numSimulaciones: number
}

export interface ResultadoSimulacion {
  simulaciones: Array<{
    dia: number
    promedio: number
    percentil_5: number
    percentil_95: number
  }>
  estadisticas: {
    precio_promedio: number
    mejor_caso: number
    peor_caso: number
    percentil_5: number
    percentil_25: number
    percentil_50: number
    percentil_75: number
    percentil_95: number
  }
  var: {
    valor: number
    porcentaje: number
  }
}

export function generarNumeroAleatorio(): number {
  return Math.random()
}

export function boxMullerTransform(): number {
  const u1 = generarNumeroAleatorio()
  const u2 = generarNumeroAleatorio()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z0
}

export function simularMonteCarlo(params: ParametrosSimulacion): ResultadoSimulacion {
  const { precioActual, volatilidad, dias, numSimulaciones } = params

  const tasa_diaria = volatilidad / 100 / Math.sqrt(252)
  const simulations: number[][] = []

  for (let i = 0; i < numSimulaciones; i++) {
    const camino = [precioActual]
    let precio = precioActual

    for (let d = 1; d <= dias; d++) {
      const z = boxMullerTransform()
      const cambio = precio * tasa_diaria * z
      precio = precio + cambio
      precio = Math.max(precio, 0.01)
      camino.push(precio)
    }

    simulations.push(camino)
  }

  const simulaciones_por_dia = []

  for (let dia = 0; dia <= dias; dia++) {
    const precios_dia = simulations.map((camino) => camino[dia]).sort((a, b) => a - b)

    const promedio = precios_dia.reduce((a, b) => a + b, 0) / precios_dia.length
    const percentil_5 = precios_dia[Math.floor(precios_dia.length * 0.05)]
    const percentil_95 = precios_dia[Math.floor(precios_dia.length * 0.95)]

    simulaciones_por_dia.push({
      dia,
      promedio,
      percentil_5,
      percentil_95,
    })
  }

  const precios_finales = simulations.map((camino) => camino[dias]).sort((a, b) => a - b)
  const precio_promedio = precios_finales.reduce((a, b) => a + b, 0) / precios_finales.length
  const mejor_caso = Math.max(...precios_finales)
  const peor_caso = Math.min(...precios_finales)

  const percentil_5 = precios_finales[Math.floor(precios_finales.length * 0.05)]
  const percentil_25 = precios_finales[Math.floor(precios_finales.length * 0.25)]
  const percentil_50 = precios_finales[Math.floor(precios_finales.length * 0.5)]
  const percentil_75 = precios_finales[Math.floor(precios_finales.length * 0.75)]
  const percentil_95 = precios_finales[Math.floor(precios_finales.length * 0.95)]

  const var_95 = percentil_5
  const perdida_maxima = precioActual - var_95
  const porcentaje_perdida = (perdida_maxima / precioActual) * 100

  return {
    simulaciones: simulaciones_por_dia,
    estadisticas: {
      precio_promedio,
      mejor_caso,
      peor_caso,
      percentil_5,
      percentil_25,
      percentil_50,
      percentil_75,
      percentil_95,
    },
    var: {
      valor: var_95,
      porcentaje: porcentaje_perdida,
    },
  }
}
