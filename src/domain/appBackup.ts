import { FOOD_SEARCH_PREFS_STORAGE_KEY } from '../store/foodSearchPrefsStore'
import { MEAL_LOG_STORAGE_KEY } from '../store/mealLogStore'
import {
  PLATE_AI_PREFS_STORAGE_KEY,
  DEFAULT_OPENAI_PROXY_BASE,
} from '../store/plateAiPrefsStore'
import { PLATE_BUILDER_STORAGE_KEY } from '../store/plateBuilderStore'
import { STORAGE_KEY as PROGRESS_STORAGE_KEY } from '../store/progressStore'
import { RECENT_FOODS_STORAGE_KEY } from '../store/recentFoodsStore'
import { USER_FOODS_STORAGE_KEY } from '../store/userFoodsStore'

/** Sidebar collapsed preference (`AppShell`). */
export const SIDEBAR_COLLAPSED_KEY = 'wr_sidebar_collapsed'

/** Weekly review entries (`ReviewPage`). */
export const REVIEW_STORAGE_KEY = 'wr-reviews'

export const BACKUP_FORMAT = 'waist-reset-backup' as const
export const BACKUP_VERSION = 1

/** Keys we ever write during a full restore — reject unknown keys from imported files. */
export const FULL_BACKUP_KEYS: readonly string[] = [
  PROGRESS_STORAGE_KEY,
  MEAL_LOG_STORAGE_KEY,
  PLATE_BUILDER_STORAGE_KEY,
  RECENT_FOODS_STORAGE_KEY,
  FOOD_SEARCH_PREFS_STORAGE_KEY,
  PLATE_AI_PREFS_STORAGE_KEY,
  USER_FOODS_STORAGE_KEY,
  SIDEBAR_COLLAPSED_KEY,
  REVIEW_STORAGE_KEY,
]

const ALLOWED = new Set(FULL_BACKUP_KEYS)

export interface FullBackupDocument {
  format: typeof BACKUP_FORMAT
  version: number
  exportedAt: string
  /** Raw localStorage string values (Zustand persist blobs or plain JSON strings). */
  keys: Record<string, string>
}

/** Remove OpenAI API key from persisted plate prefs so backups are safer to share. */
export function redactPlateAiPrefsForExport(raw: string): string {
  try {
    const o = JSON.parse(raw) as {
      state?: { openaiApiKey?: string; openaiProxyBase?: string }
      version?: number
    }
    if (o?.state && typeof o.state === 'object') {
      o.state = {
        ...o.state,
        openaiApiKey: '',
        openaiProxyBase:
          typeof o.state.openaiProxyBase === 'string' && o.state.openaiProxyBase.trim()
            ? o.state.openaiProxyBase.replace(/\/$/, '')
            : DEFAULT_OPENAI_PROXY_BASE,
      }
    }
    return JSON.stringify(o)
  } catch {
    return raw
  }
}

export function buildFullBackupDocument(): FullBackupDocument {
  const keys: Record<string, string> = {}
  for (const key of FULL_BACKUP_KEYS) {
    const v = localStorage.getItem(key)
    if (v != null) {
      keys[key] =
        key === PLATE_AI_PREFS_STORAGE_KEY ? redactPlateAiPrefsForExport(v) : v
    }
  }
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    keys,
  }
}

export function serializeFullBackup(): string {
  return JSON.stringify(buildFullBackupDocument(), null, 2)
}

export function parseFullBackupDocument(raw: string): FullBackupDocument {
  const data = JSON.parse(raw) as unknown
  if (!data || typeof data !== 'object') throw new Error('Invalid backup file')
  const doc = data as Partial<FullBackupDocument>
  if (doc.format !== BACKUP_FORMAT) throw new Error('Not a Waist Reset full backup')
  if (doc.version !== BACKUP_VERSION) {
    throw new Error(`Unsupported backup version: ${String(doc.version)}`)
  }
  if (!doc.keys || typeof doc.keys !== 'object') throw new Error('Backup missing keys')
  return doc as FullBackupDocument
}

export function applyFullBackupDocument(doc: FullBackupDocument): number {
  let n = 0
  for (const [key, value] of Object.entries(doc.keys)) {
    if (!ALLOWED.has(key)) continue
    if (typeof value !== 'string') continue
    localStorage.setItem(key, value)
    n++
  }
  return n
}
