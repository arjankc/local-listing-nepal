# Local Listing Nepal

Turn a Nepal small-business brief into ready-to-paste **Google Business Profile**, **Facebook Page**, and **Hamrobazar / marketplace** listing copy in **English and Nepali**.

Open-weight **Gemma** runs in your browser via [WebLLM](https://github.com/mlc-ai/web-llm) + WebGPU. No backend. No paid API by default.

**Live demo:** https://arjankc.github.io/local-listing-nepal/

## Who would pay

- Shop owners, cafes, clinics, tutors, and service businesses in Nepal who currently pay for listing rewrites
- Freelancers who productize listing packs for clients
- Agencies that want a faster first draft before human polish

## Features

1. Simple business brief form (name, category, location, phone, services, optional extras, language mix)
2. Structured listing pack with stable Markdown headings
3. Copy per section (`navigator.clipboard.writeText`)
4. Copy-all Markdown + download `.md`
5. Privacy note: briefs stay on-device; model loads into browser cache

## Requirements

- Recent **Chrome** or **Edge** on desktop with **WebGPU**
- First generate downloads ~1–1.5 GB model weights into browser cache
- Modest integrated GPUs work; pick a lighter model if memory is tight

## Models

| Model | Role |
| --- | --- |
| **Gemma 2 2B** (default) | Best Nepali among the small WebLLM options |
| Qwen 2.5 1.5B | Smaller fallback |
| Llama 3.2 1B | Fastest / weakest Nepali |

The app probes for `shader-f16` and picks `q4f16_1` or `q4f32_1` automatically.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173/local-listing-nepal/).

Production build:

```bash
npm run build
npm run preview
```

## Sample brief (for judges without WebGPU)

```
Business name: Lakuri Hills Cafe
Category: cafe
Location: Lakuri Phedi, Lalitpur
Phone: 9800000000
Services: filter coffee, brunch plates, hiking snacks, outdoor seating
Differentiators: open early for hikers; quiet weekday mornings
Target customer: hikers and families near Lakuri
Language mix: bilingual
```

Expected output sections include Google short/full descriptions, Facebook About + starter posts, marketplace copy when relevant, Nepali short/full descriptions, local search phrases, and assumptions/questions — without inventing amenities not in the brief.

## Privacy

Your brief is processed **in the browser**. Nothing is sent to a paid API by default. After the first model download, generation can work offline.

## Stack

- Vite + React + TypeScript + Tailwind CSS
- `@mlc-ai/web-llm` (Gemma 2 2B default, temperature `0.15`)
- Hosted on GitHub Pages (static only)

## Pattern credit

Inference UX (WebLLM engine load, quantization probe, Gemma user-turn prompting) reuses the approach proven in [Nepali String Localizer](https://github.com/arjankc/Localized-String-Assistant). This is a **new product and repository** for a different job: SMB listing packs, not UI string localization.

## License

[MIT](LICENSE)

## Challenge

Built for [Hacktoberfest Open-Source AI Challenge: Week 2 — Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12). See [SUBMISSION.md](SUBMISSION.md) for the DEV post draft.
