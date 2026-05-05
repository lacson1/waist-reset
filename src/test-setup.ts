/**
 * Test setup: shared shims for the `node` vitest environment.
 *
 * Several stores use zustand's `persist` middleware, which reads/writes
 * `window.localStorage` on module load. The default vitest env is `node`
 * (no DOM), so we install a minimal in-memory `Storage` impl globally
 * before any store module gets imported.
 */

function createMemoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    key: (i: number) => Array.from(data.keys())[i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v)
    },
    removeItem: (k: string) => {
      data.delete(k)
    },
    clear: () => data.clear(),
  }
}

const g = globalThis as { localStorage?: Storage }
if (!g.localStorage) g.localStorage = createMemoryStorage()
