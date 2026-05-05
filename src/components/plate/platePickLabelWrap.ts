/**
 * Greedy word-wrap for SVG pick labels drawn inside wedge clips (narrow usable width).
 * Long single tokens are hard-split so nothing is replaced with an ellipsis.
 */
export function wrapPlatePickLabel(label: string, maxCharsPerLine: number): string[] {
  const cap = Math.max(4, Math.floor(maxCharsPerLine))
  const t = label.trim()
  if (!t) return ['']

  const chunksOf = (word: string): string[] => {
    if (word.length <= cap) return [word]
    const out: string[] = []
    for (let i = 0; i < word.length; i += cap) {
      out.push(word.slice(i, i + cap))
    }
    return out
  }

  const words = t.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''

  const flush = () => {
    if (cur) {
      lines.push(cur)
      cur = ''
    }
  }

  for (const word of words) {
    if (word.length > cap) {
      flush()
      lines.push(...chunksOf(word))
      continue
    }
    const trial = cur ? `${cur} ${word}` : word
    if (trial.length <= cap) {
      cur = trial
    } else {
      flush()
      cur = word
    }
  }
  flush()
  return lines.length ? lines : [t]
}
