export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function slugFilename(businessName: string): string {
  const base = businessName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/gi, '-')
    .replace(/^-+|-+$/g, '')
  return `${base || 'listing-pack'}-listing.md`
}
