import { useEffect, useState } from 'react'
import { BriefForm } from './components/BriefForm'
import { ListingOutput } from './components/ListingOutput'
import { ModelControls } from './components/ModelControls'
import { PrivacyNote } from './components/PrivacyNote'
import { buildChatMessages, GENERATION_TEMPERATURE } from './lib/prompt'
import type { BusinessBrief, ModelOption } from './lib/types'
import { EMPTY_BRIEF } from './lib/types'
import { ensureModel, getLoadedModelId, listAvailableModels, streamCompletion } from './lib/webllm'

export default function App() {
  const [brief, setBrief] = useState<BusinessBrief>(EMPTY_BRIEF)
  const [models, setModels] = useState<ModelOption[]>([])
  const [modelId, setModelId] = useState('')
  const [gpuError, setGpuError] = useState<string | null>(null)
  const [status, setStatus] = useState('Checking WebGPU…')
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await listAvailableModels()
        if (cancelled) return
        if (result.error) {
          setGpuError(result.error)
          setStatus('')
          return
        }
        setModels(result.models)
        setModelId(result.models[0]?.id ?? '')
        setStatus('Ready. Fill the brief and generate — the model loads on first run.')
        setReady(true)
      } catch (err) {
        if (cancelled) return
        setGpuError(`Could not initialise WebGPU: ${err instanceof Error ? err.message : String(err)}`)
        setStatus('')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const canGenerate =
    ready &&
    !streaming &&
    !gpuError &&
    brief.businessName.trim() &&
    brief.category.trim() &&
    brief.location.trim() &&
    brief.phone.trim() &&
    brief.services.trim()

  async function handleGenerate() {
    setError(null)
    setMarkdown('')
    setStreaming(true)

    try {
      setShowProgress(true)
      await ensureModel(modelId, (report) => {
        setStatus(report.text)
        setProgress(report.progress)
      })
      setShowProgress(false)
      setStatus('Writing listing pack…')

      const messages = buildChatMessages(brief)
      let reply = ''
      for await (const delta of streamCompletion(messages, GENERATION_TEMPERATURE)) {
        reply += delta
        setMarkdown(reply)
      }

      setStatus(`Done with ${getLoadedModelId() ?? modelId}.`)
    } catch (err) {
      setShowProgress(false)
      setStatus('')
      setError(`Generation failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="animate-fade-up mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-crimson">
          Nepal SMB listing pack
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Local Listing Nepal
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Turn a small-business brief into ready-to-paste Google Business, Facebook, and marketplace
          copy in English and Nepali — powered by open-weight Gemma in your browser.
        </p>
      </header>

      <div className="animate-fade-up-delay mb-8">
        <PrivacyNote />
      </div>

      <main className="space-y-8">
        <section className="rounded-2xl border border-ink/10 bg-white/75 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink">Business brief</h2>
          <BriefForm brief={brief} onChange={setBrief} disabled={streaming} />

          <div className="mt-6 border-t border-ink/10 pt-5">
            <ModelControls
              models={models}
              modelId={modelId}
              onModelChange={setModelId}
              gpuError={gpuError}
              status={status}
              progress={progress}
              showProgress={showProgress}
              disabled={streaming}
            />
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-crimson px-4 py-3 text-base font-semibold text-white transition hover:bg-crimson-dark disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            {streaming ? 'Generating…' : 'Generate listing pack'}
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-3 text-sm text-crimson-dark">
              {error}
            </div>
          )}
        </section>

        <ListingOutput markdown={markdown} businessName={brief.businessName} streaming={streaming} />
      </main>

      <footer className="mt-14 border-t border-ink/10 pt-6 text-xs text-muted">
        <p>
          Open-source AI at the core · MIT licensed · Built for Hacktoberfest 2026 Side Hustle ·
          Default model: Gemma 2 2B via WebLLM
        </p>
      </footer>
    </div>
  )
}
