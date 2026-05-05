import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/** Same-origin default: Vite dev proxy and optional Vercel `api/openai.ts` */
export const DEFAULT_OPENAI_PROXY_BASE = '/api/openai'

export const PLATE_AI_PREFS_STORAGE_KEY = 'vat_plate_prefs_v1'

interface PlateAiPrefsStore {
  openaiApiKey: string
  /** Base URL without trailing slash, e.g. `/api/openai` or `https://your-worker.dev` */
  openaiProxyBase: string
  setOpenaiApiKey: (k: string) => void
  setOpenaiProxyBase: (b: string) => void
}

export const usePlateAiPrefsStore = create<PlateAiPrefsStore>()(
  persist(
    (set) => ({
      openaiApiKey: '',
      openaiProxyBase: DEFAULT_OPENAI_PROXY_BASE,
      setOpenaiApiKey: (openaiApiKey) => set({ openaiApiKey }),
      setOpenaiProxyBase: (openaiProxyBase) =>
        set({ openaiProxyBase: openaiProxyBase.replace(/\/$/, '') || DEFAULT_OPENAI_PROXY_BASE }),
    }),
    {
      name: PLATE_AI_PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        openaiApiKey: s.openaiApiKey,
        openaiProxyBase: s.openaiProxyBase,
      }),
    },
  ),
)
