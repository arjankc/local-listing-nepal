import type { BusinessBrief, LanguageMix } from '../lib/types'

interface BriefFormProps {
  brief: BusinessBrief
  onChange: (brief: BusinessBrief) => void
  disabled?: boolean
}

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-crimson/50 focus:ring-2 focus:ring-crimson/20 disabled:opacity-60'

const labelClass = 'block text-sm font-semibold text-ink'

export function BriefForm({ brief, onChange, disabled }: BriefFormProps) {
  const set = <K extends keyof BusinessBrief>(key: K, value: BusinessBrief[K]) => {
    onChange({ ...brief, [key]: value })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={`${labelClass} sm:col-span-2`}>
        Business name
        <input
          className={fieldClass}
          value={brief.businessName}
          onChange={(e) => set('businessName', e.target.value)}
          placeholder="e.g. Lakuri Hills Cafe"
          disabled={disabled}
          required
        />
      </label>

      <label className={labelClass}>
        Category / type
        <input
          className={fieldClass}
          value={brief.category}
          onChange={(e) => set('category', e.target.value)}
          placeholder="e.g. cafe, clinic, tutoring center"
          disabled={disabled}
          required
        />
      </label>

      <label className={labelClass}>
        Location (area + city)
        <input
          className={fieldClass}
          value={brief.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="e.g. Lakuri Phedi, Lalitpur"
          disabled={disabled}
          required
        />
      </label>

      <label className={labelClass}>
        Phone
        <input
          className={fieldClass}
          value={brief.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="e.g. 98XXXXXXXX"
          disabled={disabled}
          required
        />
      </label>

      <label className={labelClass}>
        Website <span className="font-normal text-muted">(optional)</span>
        <input
          className={fieldClass}
          value={brief.website}
          onChange={(e) => set('website', e.target.value)}
          placeholder="https://"
          disabled={disabled}
        />
      </label>

      <label className={`${labelClass} sm:col-span-2`}>
        Services / products
        <textarea
          className={`${fieldClass} min-h-24 resize-y`}
          value={brief.services}
          onChange={(e) => set('services', e.target.value)}
          placeholder="Bullet list or short notes: coffee, brunch, outdoor seating…"
          disabled={disabled}
          required
        />
      </label>

      <label className={`${labelClass} sm:col-span-2`}>
        Differentiators <span className="font-normal text-muted">(optional)</span>
        <textarea
          className={`${fieldClass} min-h-20 resize-y`}
          value={brief.differentiators}
          onChange={(e) => set('differentiators', e.target.value)}
          placeholder="Hours, ambience, specialties — only facts you know"
          disabled={disabled}
        />
      </label>

      <label className={labelClass}>
        Target customer <span className="font-normal text-muted">(optional)</span>
        <input
          className={fieldClass}
          value={brief.targetCustomer}
          onChange={(e) => set('targetCustomer', e.target.value)}
          placeholder="e.g. families and hikers near Lakuri"
          disabled={disabled}
        />
      </label>

      <label className={labelClass}>
        Preferred language mix
        <select
          className={fieldClass}
          value={brief.languageMix}
          onChange={(e) => set('languageMix', e.target.value as LanguageMix)}
          disabled={disabled}
        >
          <option value="bilingual">Bilingual (English + Nepali)</option>
          <option value="english">English only (Nepali still generated)</option>
          <option value="nepali">Nepali primary</option>
        </select>
      </label>
    </div>
  )
}
