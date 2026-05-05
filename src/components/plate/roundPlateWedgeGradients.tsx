import type { ReactNode } from 'react'

/**
 * Shared wedge tints for round rest + training plates: light washes (veg-forward greens,
 * distinct protein / fibre / carbs) so imprint food lines stay readable on top.
 */
export function RoundPlateWedgeGradients({
  idPrefix,
  fibreOrCarbs,
}: {
  idPrefix: (key: string) => string
  fibreOrCarbs: 'fibre' | 'carbs'
}): ReactNode {
  const g = idPrefix
  const third = fibreOrCarbs === 'fibre' ? g('fibre') : g('carbs')

  return (
    <>
      <linearGradient id={g('veg')} x1="18%" y1="4%" x2="82%" y2="96%">
        <stop offset="0%" stopColor="#f4faf7" />
        <stop offset="38%" stopColor="#dceee4" />
        <stop offset="72%" stopColor="#b8d9c4" />
        <stop offset="100%" stopColor="#8eb89a" />
      </linearGradient>
      <linearGradient id={g('protein')} x1="6%" y1="6%" x2="94%" y2="94%">
        <stop offset="0%" stopColor="#faf7f9" />
        <stop offset="42%" stopColor="#ebe2ea" />
        <stop offset="78%" stopColor="#cfc0d0" />
        <stop offset="100%" stopColor="#a89bab" />
      </linearGradient>
      {fibreOrCarbs === 'fibre' ? (
        <linearGradient id={third} x1="92%" y1="8%" x2="8%" y2="92%">
          <stop offset="0%" stopColor="#f5f8f5" />
          <stop offset="40%" stopColor="#e2ebe1" />
          <stop offset="74%" stopColor="#c5d4c4" />
          <stop offset="100%" stopColor="#9aaf9a" />
        </linearGradient>
      ) : (
        <linearGradient id={third} x1="10%" y1="92%" x2="90%" y2="8%">
          <stop offset="0%" stopColor="#faf8f4" />
          <stop offset="42%" stopColor="#ebe6dc" />
          <stop offset="76%" stopColor="#d4cbb8" />
          <stop offset="100%" stopColor="#aea08c" />
        </linearGradient>
      )}
    </>
  )
}
