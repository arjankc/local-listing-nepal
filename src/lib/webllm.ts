import type { MLCEngine } from '@mlc-ai/web-llm'
import type { ModelOption } from './types'

const CANDIDATE_MODELS = [
  { base: 'gemma-2-2b-it', label: 'Gemma 2 2B (best Nepali of the small models)' },
  { base: 'Qwen2.5-1.5B-Instruct', label: 'Qwen 2.5 1.5B (smaller, weaker Nepali)' },
  { base: 'Llama-3.2-1B-Instruct', label: 'Llama 3.2 1B (fastest, weakest Nepali)' },
] as const

export type ProgressReport = { text: string; progress: number }

let engine: MLCEngine | null = null
let loadedModel: string | null = null
let webllmModule: typeof import('@mlc-ai/web-llm') | null = null

async function loadWebLLM() {
  if (!webllmModule) {
    webllmModule = await import('@mlc-ai/web-llm')
  }
  return webllmModule
}

export async function detectQuantization(): Promise<'q4f16_1' | 'q4f32_1' | null> {
  if (!navigator.gpu) return null
  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) return null
  return adapter.features.has('shader-f16') ? 'q4f16_1' : 'q4f32_1'
}

export async function listAvailableModels(): Promise<{
  models: ModelOption[]
  error: string | null
}> {
  const quant = await detectQuantization()
  if (!quant) {
    return {
      models: [],
      error:
        'WebGPU is not available in this browser, so the model cannot run here. Use a recent Chrome or Edge on desktop.',
    }
  }

  const webllm = await loadWebLLM()
  const available = new Map(webllm.prebuiltAppConfig.model_list.map((m) => [m.model_id, m]))
  const models: ModelOption[] = []

  for (const candidate of CANDIDATE_MODELS) {
    const id = `${candidate.base}-${quant}-MLC`
    const record = available.get(id)
    if (!record) continue
    const vramHint = record.vram_required_MB
      ? `~${(record.vram_required_MB / 1024).toFixed(1)} GB memory`
      : ''
    models.push({ id, label: candidate.label, vramHint })
  }

  if (!models.length) {
    return {
      models: [],
      error: 'None of the expected models are available in this WebLLM version.',
    }
  }

  return { models, error: null }
}

export async function ensureModel(
  modelId: string,
  onProgress: (report: ProgressReport) => void,
): Promise<void> {
  if (engine && loadedModel === modelId) return

  const webllm = await loadWebLLM()
  const initProgressCallback = (report: { text: string; progress: number }) => {
    onProgress({ text: report.text, progress: report.progress ?? 0 })
  }

  if (!engine) {
    engine = await webllm.CreateMLCEngine(modelId, { initProgressCallback })
  } else {
    engine.setInitProgressCallback(initProgressCallback)
    await engine.reload(modelId)
  }
  loadedModel = modelId
}

export function getLoadedModelId(): string | null {
  return loadedModel
}

export async function* streamCompletion(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  temperature: number,
): AsyncGenerator<string, void, unknown> {
  if (!engine) throw new Error('Model is not loaded yet.')

  const stream = await engine.chat.completions.create({
    messages,
    temperature,
    stream: true,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? ''
    if (delta) yield delta
  }
}
