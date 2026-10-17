export function PrivacyNote() {
  return (
    <aside
      className="rounded-lg border border-ink/10 bg-white/70 px-4 py-3 text-sm text-muted backdrop-blur-sm"
      role="note"
    >
      <strong className="font-semibold text-ink">Privacy:</strong> Your business brief is processed
      locally in this browser with an open-weight model. Nothing is sent to a paid API by default.
      The first run downloads the model (~1–1.5 GB) into your browser cache; later visits can work
      offline.
    </aside>
  )
}
