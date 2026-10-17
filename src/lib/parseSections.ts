import type { ParsedSection } from './types'

/** Split Markdown on ## headings into titled sections. */
export function parseSections(markdown: string): ParsedSection[] {
  const text = markdown.trim()
  if (!text) return []

  const parts = text.split(/^##\s+/m)
  const sections: ParsedSection[] = []

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    const newline = trimmed.indexOf('\n')
    if (newline === -1) {
      sections.push({ title: trimmed, body: '' })
      continue
    }

    const title = trimmed.slice(0, newline).trim()
    const body = trimmed.slice(newline + 1).trim()
    sections.push({ title, body })
  }

  return sections
}
