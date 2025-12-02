from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulacionRequest(BaseModel):
    precio_actual: float
    volatilidad: float
    dias: int
    num_simulaciones: int

@app.post("/api/simulate")
async def simulate(request: SimulacionRequest):
    precio = request.precio_actual
    volatilidad = request.volatilidad / 100
    dias = request.dias
    num_sims = request.num_simulaciones
    
    dt = 1 / 252
    
    simulaciones = np.zeros((num_sims, dias + 1))
    simulaciones[:, 0] = precio
    
    for i in range(1, dias + 1):
        ruido = np.random.normal(0, 1, num_sims)
        cambio = volatilidad * np.sqrt(dt) * ruido
        simulaciones[:, i] = simulaciones[:, i - 1] * np.exp(cambio)
    
    precios_finales = simulaciones[:, -1]
    
    percentil_5 = np.percentile(precios_finales, 5)
    percentil_25 = np.percentile(precios_finales, 25)
    percentil_50 = np.percentile(precios_finales, 50)
    percentil_75 = np.percentile(precios_finales, 75)
    percentil_95 = np.percentile(precios_finales, 95)
    
    precio_promedio = np.mean(precios_finales)
    peor_caso = np.min(precios_finales)
    mejor_caso = np.max(precios_finales)
    
    var_95 = precio - percentil_5
    var_95_porcentaje = (var_95 / precio) * 100
    
    datos_simulaciones = []
    for dia in range(dias + 1):
        datos_simulaciones.append({
            "dia": dia,
            "simulaciones": simulaciones[:, dia].tolist(),
            "promedio": float(np.mean(simulaciones[:, dia])),
            "percentil_5": float(np.percentile(simulaciones[:, dia], 5)),
            "percentil_95": float(np.percentile(simulaciones[:, dia], 95))
        })
    
    return {
        "simulaciones": datos_simulaciones,
        "estadisticas": {
            "precio_promedio": float(precio_promedio),
            "peor_caso": float(peor_caso),
            "mejor_caso": float(mejor_caso),
            "percentil_5": float(percentil_5),
            "percentil_25": float(percentil_25),
            "percentil_50": float(percentil_50),
            "percentil_75": float(percentil_75),
            "percentil_95": float(percentil_95)
        },
        "var": {
            "valor": float(var_95),
            "porcentaje": float(var_95_porcentaje)
        }
    }

@app.get("/api/health")
async def health():
    return {"status": "ok"}
