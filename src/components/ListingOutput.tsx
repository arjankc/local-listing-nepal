import { useMemo, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { copyText, downloadMarkdown, slugFilename } from '../lib/clipboard'
import { parseSections } from '../lib/parseSections'

interface ListingOutputProps {
  markdown: string
  businessName: string
  streaming: boolean
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="rounded-md border border-ink/15 bg-white px-2.5 py-1 text-xs font-medium text-ink transition hover:border-crimson/40 hover:text-crimson disabled:opacity-50"
      disabled={!text.trim()}
      onClick={async () => {
        const ok = await copyText(text)
        if (!ok) return
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? 'Copied' : label}
    </button>
  )
}

export function ListingOutput({ markdown, businessName, streaming }: ListingOutputProps) {
  const sections = useMemo(() => parseSections(markdown), [markdown])

  if (!markdown && !streaming) return null

  return (
    <section className="animate-fade-up space-y-4" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Listing pack</h2>
          <p className="text-sm text-muted">
            {streaming ? 'Generating…' : 'Copy a section or export the full Markdown.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={markdown} label="Copy all" />
          <button
            type="button"
            className="rounded-md border border-ink/15 bg-ink px-2.5 py-1 text-xs font-medium text-white transition hover:bg-ink-soft disabled:opacity-50"
            disabled={!markdown.trim() || streaming}
            onClick={() => downloadMarkdown(slugFilename(businessName), markdown)}
          >
            Download .md
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const html = DOMPurify.sanitize(marked.parse(section.body || '_…_') as string)
          return (
            <article
              key={section.title}
              className="rounded-xl border border-ink/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-semibold text-ink">{section.title}</h3>
                <CopyButton text={section.body} />
              </div>
              <div
                className="prose-listing font-deva text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </article>
          )
        })}

        {streaming && sections.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink/20 bg-white/50 p-6 text-sm text-muted">
            Waiting for the first tokens…
          </div>
        )}
      </div>

      <details className="rounded-lg border border-ink/10 bg-mist/60 px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-ink">Raw Markdown</summary>
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-ink-soft">
          {markdown}
        </pre>
      </details>
    </section>
  )
}
