import { useEffect, useState } from 'react'

export type ColombiaDepartamentoRow = {
  id: number
  departamento: string
  ciudades: string[]
}

export function useColombiaMunicipios() {
  const [departamentos, setDepartamentos] = useState<ColombiaDepartamentoRow[] | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/geo/colombia-municipios.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<ColombiaDepartamentoRow[]>
      })
      .then((json) => {
        if (!alive) return
        setDepartamentos(Array.isArray(json) ? json : [])
        setGeoError(null)
      })
      .catch(() => {
        if (!alive) return
        setDepartamentos(null)
        setGeoError('No se pudo cargar el listado de departamentos y municipios de Colombia.')
      })
    return () => {
      alive = false
    }
  }, [])

  return { departamentos, geoError }
}
