import type { ModelOption } from '../lib/types'

interface ModelControlsProps {
  models: ModelOption[]
  modelId: string
  onModelChange: (id: string) => void
  gpuError: string | null
  status: string
  progress: number
  showProgress: boolean
  disabled?: boolean
}

export function ModelControls({
  models,
  modelId,
  onModelChange,
  gpuError,
  status,
  progress,
  showProgress,
  disabled,
}: ModelControlsProps) {
  return (
    <div className="space-y-3">
      {gpuError && (
        <div className="rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-3 text-sm text-crimson-dark">
          {gpuError}
        </div>
      )}

      <label className="block text-sm font-semibold text-ink">
        Open model
        <select
          className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 disabled:opacity-60"
          value={modelId}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={disabled || !models.length}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
              {m.vramHint ? ` · ${m.vramHint}` : ''}
            </option>
          ))}
        </select>
      </label>

      <p className="min-h-5 text-sm text-muted">{status}</p>

      {showProgress && (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-crimson transition-[width] duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
