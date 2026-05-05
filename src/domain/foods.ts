import { useCallback, useEffect, useState } from 'react'

export interface FoodRow {
  n: string
  b: string
  t: string
  /**
   * Fine-grained category used by the plate builder to decide which wedge a
   * food naturally belongs to. Stored separately from `t` (the library tag)
   * because `t` is too coarse: "Fibre" lumps broccoli with lentils and oats.
   * Optional so legacy foods.json files keep loading; the plate builder
   * falls back to a name/type heuristic when this is missing.
   */
  cat?: string
  r?: string
  qty: string
  kcal: number
  p: number
  f: number
  c: number
  g?: string
  mech?: string
  ev?: string
  prep?: string
}

export async function loadFoods(baseUrl: string): Promise<FoodRow[]> {
  const r = await fetch(`${baseUrl}foods.json`)
  if (!r.ok) throw new Error(String(r.status))
  const data = (await r.json()) as unknown
  return Array.isArray(data) ? (data as FoodRow[]) : []
}

export function useFoods() {
  const [raw, setRaw] = useState<FoodRow[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    loadFoods(import.meta.env.BASE_URL)
      .then((data) => {
        if (!cancelled) {
          setRaw(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRaw(null)
          setErr('Could not load foods.json')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const reload = useCallback(() => {
    setErr(null)
    setLoading(true)
    setReloadKey((k) => k + 1)
  }, [])

  return { raw, err, loading, reload }
}
